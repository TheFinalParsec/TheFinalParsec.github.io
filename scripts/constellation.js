let constellation;
let os = "windows";
let installsData;
document.querySelector("#os").addEventListener("change", async () => {
  os = document.querySelector("#os").value;
  reset();
  await createConstellation();
})

async function setup() {
  const c = createCanvas(windowWidth, windowHeight * 0.75);
  c.parent(document.querySelector(".section4 .constellation"));

  installsData = await fetch("installs.json")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  createConstellation();
}

function draw() { }

// async function keyPressed(){
//   if(key=="n"){
//     clear();
//     await createConstellation();
//   }
// }

function createConstellation() {
  const data = installsData[os.toLowerCase()];
  const n = data.length < 5 ? data.length : 5;

  const distMin = 100;
  const distMax = 250;
  const chanceToClose = 60 / 100;
  const chanceToSplit = 40 / 100;

  const margin = 60;
  //{x:el.p1.x,y:el.p1.y,px:el.p2.x,py:el.p2.y};
  let lineNb = n - 1;

  let p1;
  let p2 = { x: floor(width / 2), y: floor(height / 2) };

  let res = false;

  do {
    reset();
    constellation = [
      //{x:p1.x,y:p1.y,px:p2.x,py:p2.y}
    ];

    let angle, d, v;
    for (let i = 0; i < lineNb; i++) {
      do {
        angle = random(TWO_PI);
        d = random(distMin, distMax);
        v = createVector(d, 0).rotate(angle);

        p1 = { x: floor(p2.x + v.x), y: floor(p2.y + v.y) };
      } while (p1.x < margin || p1.x > width - margin || p1.y < margin || p1.y > height - margin || !checkDist(p1.x, p1.y));

      constellation.push({ x: p2.x, y: p2.y, px: p1.x, py: p1.y });

      i += checkIntersection(p2.x, p2.y, p1.x, p1.y);

      if (random() > chanceToSplit) p2 = p1;
    }

    if (random() < chanceToClose) {
      let ptClose = constellation[floor(random(constellation.length - 1))];
      constellation.push({ x: constellation[constellation.length - 1].px, y: constellation[constellation.length - 1].py, px: ptClose.x, py: ptClose.y });

      checkIntersection(constellation[constellation.length - 1].x, constellation[constellation.length - 1].y, ptClose.x, ptClose.y);
    }

    res = drawConstellation(data.slice(-n));
  } while (!res)
}

function drawConstellation(data) {
  let points = [];

  let avgX = 0, avgY = 0;
  constellation.forEach(el => {
    avgX += el.x;
    avgY += el.y;
  })

  avgX = floor(avgX / constellation.length);
  avgY = floor(avgY / constellation.length);


  constellation.forEach((el, index) => {
    let posX = el.x;
    let posY = el.y
    let posPX = el.px;
    let posPY = el.py;

    posX -= avgX;
    posY -= avgY;
    posPX -= avgX;
    posPY -= avgY;

    posX += floor(width / 2);
    posY += floor(height / 2)
    posPX += floor(width / 2);
    posPY += floor(height / 2)


    stroke(150);
    strokeWeight(2)
    line(posX, posY, posPX, posPY);

    if (points.filter(e => e.x == el.x && e.y == el.y).length == 0) {
      points.push({ x: el.x, y: el.y });
    }
    if (points.filter(e => e.x == el.px && e.y == el.py).length == 0) {
      points.push({ x: el.px, y: el.py });
    }
  });

  let repeat = true;

  points.forEach((el, index) => {
    points.forEach((el2, index2) => {
      if (index != index2) {
        if (dist(el.x, el.y, el2.x, el2.y) < 150) {
          repeat = false;
        }
      }
    })
  })

  if (!repeat) return false;

  points.forEach((el, index) => {
    let posX = el.x;
    let posY = el.y

    posX -= avgX;
    posY -= avgY;

    posX += floor(width / 2);
    posY += floor(height / 2)

    createDownload(posX, posY, data[index]);
  })

  return true;
}

function createPRandom() {
  return { x: floor(random(width)), y: floor(random(height)) };
}

function checkDist(x, y) {
  const minDist = 100;
  for (let i = 0; i < constellation.length; i++) {
    if (dist(x, y, constellation[i].x, constellation[i].y) < minDist || dist(x, y, constellation[i].px, constellation[i].py) < minDist) return false;
  }
  return true;
}

function checkIntersection(x1, y1, x2, y2) {
  let nbIntersect = 0;
  for (let j = constellation.length - 2; j >= 0; j--) {
    let intersect = line_intersect(x1, y1, x2, y2, constellation[j].x, constellation[j].y, constellation[j].px, constellation[j].py);

    if (intersect && intersect.seg1 && intersect.seg2 && intersect.x != constellation[j].px && intersect.y != constellation[j].py && intersect.x != constellation[j].x && intersect.y != constellation[j].y) {
      splitLine(j, intersect.x, intersect.y);
      splitLine(constellation.length - 1, intersect.x, intersect.y);
      nbIntersect++;
    }
  }

  return nbIntersect;
}

function splitLine(id, x, y) {
  let oldLine = constellation.splice(id, 1)[0];

  constellation.splice(id, 0, { x: oldLine.x, y: oldLine.y, px: x, py: y }, { x: x, y: y, px: oldLine.px, py: oldLine.py });
}

function line_intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  var ua,
    ub,
    denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom == 0) {
    return null;
  }
  ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
  return {
    x: x1 + ua * (x2 - x1),
    y: y1 + ua * (y2 - y1),
    seg1: ua >= 0 && ua <= 1,
    seg2: ub >= 0 && ub <= 1,
  };
}

function createDownload(x, y, vData) {
  let install = vData;

  const img = new Node("img", {
    src: `img/${os.toLowerCase()}.png`,
  }).build();

  const version = new Node("span", {
    innerText: `${install["version"]}`,
  }).build();

  const main = new Node("div", {
    classes: ["install"],
    style: `--x:${x}px;--y:${y}px;`,
    innerHTML: `
        ${img.outerHTML}
        ${version.outerHTML}`,
  });

  document.querySelector(".section4 .constellation").appendChild(main.build());
}

function reset() {
  constellation = [];
  clear();
  document.querySelectorAll(".section4 .constellation .install").forEach((e) => {
    e.remove()
  })
}
function mapVal(value, a, b, c, d) {
  value = (value - a) / (b - a);
  return c + value * (d - c);
}

const rotator = document.querySelector(".rotation_effect > div")
const earthImg = document.querySelector("#earth_img")
const sectionRotate = document.querySelector(".section1")
let separators = document.querySelectorAll(".separators .line")
let rotateImgs = [];

for (let i = 1; i <= 3; i++) {
  rotateImgs.push(document.querySelector(`#img_${i}`));
}

let earthImgWidth = getComputedStyle(earthImg).width.replace("px", "");

rotator.style.setProperty("height", Math.floor(earthImgWidth * 0.4 * 2.8) + "px");

//330deg - 30deg
// imgPosdeg,8deg

document.addEventListener("scroll", () => {
  if (sectionRotate.getBoundingClientRect().top < 0) {
    let rotation = mapVal(sectionRotate.getBoundingClientRect().top, 0, -window.innerHeight * 6, -30, 30)
    rotator.style.setProperty("rotate", rotation + "deg");

    const linePos = [
      separators[0].getBoundingClientRect().left,
      separators[1].getBoundingClientRect().left
    ]

    const imgPos = rotateImgs[0].getBoundingClientRect().left + getComputedStyle(rotateImgs[0]).width.replace("px", "") * 1;

    if (imgPos < linePos[0]) {
      rotateImgs[0].style.setProperty("opacity", 1);
      rotateImgs[1].style.setProperty("opacity", 0);
      rotateImgs[2].style.setProperty("opacity", 0);
    } else if (imgPos >= linePos[0] && imgPos < linePos[1]) {
      rotateImgs[0].style.setProperty("opacity", 0);
      rotateImgs[1].style.setProperty("opacity", 1);
      rotateImgs[2].style.setProperty("opacity", 0);
    } else if (imgPos >= linePos[1]) {
      rotateImgs[0].style.setProperty("opacity", 0);
      rotateImgs[1].style.setProperty("opacity", 0);
      rotateImgs[2].style.setProperty("opacity", 1);
    }
  }
})

document.querySelector("#copy").innerText = new Date().getFullYear();
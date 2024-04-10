class Node {
  #node;
  constructor(tag, { classes, ...arg }) {
    this.tag = tag
    this.class = classes || [];
    this.custom = arg;
    this.style = null
    this.#node = null;
  }

  build = () => {
    const node = document.createElement(this.tag);

    this.class.forEach(cl => {
      node.classList.add(cl);
    });

    for (const [key, value] of Object.entries(this.custom)) {
      if (key == "dataset") {
        for (const [key1, value1] of Object.entries(value)) {
          node.dataset[key1] = value1
        }
      } else {
        node[key] = value
      }
    }

    this.#node = node;
    this.style = this.#node.style;

    return node;
  }

  update = () => {

    this.#node.className = "";

    this.class.forEach(cl => {
      this.#node.classList.add(cl);
    });

    for (const [key, value] of Object.entries(this.custom)) {
      if (key == "dataset") {
        for (const [key1, value1] of Object.entries(value)) {
          this.#node.dataset[key1] = value1
        }
      } else {
        this.#node[key] = value
      }
    }
  }
}
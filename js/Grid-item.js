import Vector from "./Vector.js";


export default class GridItem {
  constructor(width = 0, height = 0) {
    this.position = new Vector();
    this.size = new Vector(width, height);
    this.color = { red: 255, blue: 255, green: 255 };
    this.animating = false;
  }

  update(dt) {
    this.color.red = Math.floor(this.color.red + dt * 500);
    this.color.blue = Math.floor(this.color.blue + dt * 500);
    this.color.green = Math.floor(this.color.green + dt * 500);

    if (this.color.red >= 255) {
      this.color = { red: 255, blue: 255, green: 255};
      this.animating = false;
    }
  }
}

import * as PIXI from "pixi.js";
import { letterBox } from "../helpers/utils";

export class Scene {
  public container: PIXI.Container;
  public reposition: () => void;

  constructor(watchResize?: boolean) {
    this.container = new PIXI.Container();
    if (watchResize) {
      this.reposition = () => letterBox(this.container, 20);
      this.container.on("added", this.onAdded.bind(this));
      this.container.on("removed", this.onRemoved.bind(this));
    }

    // const border = new PIXI.Graphics();
    // border.lineStyle(2, 0xff0000, 1);
    // border.drawRect(0, 0, this.container.width, this.container.height);
    // this.container.addChild(border);
  }

  private onAdded() {
    this.reposition();
    window.addEventListener("resize", this.reposition.bind(this));
  }

  private onRemoved() {
    window.removeEventListener("resize", this.reposition.bind(this));
  }
}

import * as PIXI from "pixi.js";

export class Scene {
  public container: PIXI.Container;

  constructor() {
    this.container = new PIXI.Container();
  }
}

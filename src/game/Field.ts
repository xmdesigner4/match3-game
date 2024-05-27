import "reflect-metadata";
import * as PIXI from "pixi.js";
import { AssetsManager } from "../AssetsManager";
import { container as diContainer } from "tsyringe";
import GameItem from "./GameItem";

class Field {
  public sprite: PIXI.Sprite;
  public item: GameItem;

  constructor(
    public row: number,
    public col: number,
  ) {
    const am: AssetsManager = diContainer.resolve(AssetsManager);
    this.sprite = am.getTileSprite("tile.png");
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.5);
    this.sprite.x = this.position.x;
    this.sprite.y = this.position.y;
    this.sprite.eventMode = "none";
  }

  public get position(): PIXI.Point {
    return new PIXI.Point(
      this.col * this.sprite.width,
      this.row * this.sprite.height,
    );
  }

  public attachGameItem(item: GameItem) {
    this.item = item;
    item.field = this;
    item.position = this.position;
  }
}
export default Field;

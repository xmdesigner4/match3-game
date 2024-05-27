import * as PIXI from "pixi.js";
import { AssetsManager } from "../AssetsManager";
import { container as diContainer } from "tsyringe";
import { GameItemType } from "../api/GameItemType";
import Field from "./Field";
import { gsap } from "gsap";
import EaseString = gsap.EaseString;

class GameItem {
  public sprite: PIXI.Sprite;
  public field: Field;

  private _position: { x: number; y: number };
  public get position() {
    return this._position;
  }
  public set position(value) {
    this._position = { x: value.x, y: value.y };
    this.sprite.x = value.x;
    this.sprite.y = value.y;
  }

  private _selected: boolean;
  get selected(): boolean {
    return this._selected;
  }
  set selected(value: boolean) {
    const m = value ? 1 : -1;
    this.sprite.position.y -= m * 10;
    this._selected = value;
  }

  constructor(public type: GameItemType) {
    this.init();
  }

  public init() {
    const am: AssetsManager = diContainer.resolve(AssetsManager);
    this.sprite = am.getTileSprite(`${this.type}.png`);
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.5);
  }

  public moveTo(
    position: PIXI.Point,
    duration: number,
    delay?: number,
    ease?: EaseString,
  ) {
    return new Promise<void>((resolve) => {
      gsap.to(this.sprite, {
        duration,
        delay,
        ease,
        pixi: {
          x: position.x,
          y: position.y,
        },
        onComplete: () => {
          resolve();
        },
      });
    });
  }

  public isNear(toItem: GameItem) {
    return (
      Math.abs(this.field.row - toItem.field.row) +
        Math.abs(this.field.col - toItem.field.col) ===
      1
    );
  }

  public fallDownTo(position: PIXI.Point, delay?: number) {
    return this.moveTo(position, 0.5, delay, "bounce.out");
  }

  public remove() {
    // TODO: add particle explosion
    if (!this.sprite) return;
    this.sprite.destroy();
    this.sprite = null;
    if (!!this.field) {
      this.field.item = null;
      this.field = null;
    }
  }
}

export default GameItem;

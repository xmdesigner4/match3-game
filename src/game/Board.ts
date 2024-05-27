import * as PIXI from "pixi.js";
import gameConfig from "../gameConfig";
import Field from "./Field";
import GameItem from "./GameItem";
import { getRandomGameItemType } from "../helpers/utils";
import { Events } from "../api/Events";
import { GameItemType } from "../api/GameItemType";

class Board {
  public container: PIXI.Container = new PIXI.Container();
  public fields: Field[] = [];

  constructor(
    public rows: number = gameConfig.rows,
    public cols: number = gameConfig.cols,
  ) {
    // add background fields
    for (let col = 0; col < this.cols; col++) {
      for (let row = 0; row < this.rows; row++) {
        const field = new Field(row, col);
        this.fields.push(field);
        this.container.addChild(field.sprite);
      }
    }
    // add items
    this.fields.forEach((field) => {
      this.createGameItem(field);
    });
  }

  public createGameItem(field: Field, type?: GameItemType) {
    const item = new GameItem(type ?? getRandomGameItemType());
    this.container.addChild(item.sprite);
    field.attachGameItem(item);
    item.sprite.interactive = true;
    item.sprite.on("pointerdown", () => {
      console.log("clicked", item.type);
      this.container.emit(Events.ITEM_SELECT, item);
    });
    return item;
  }

  public getField(row: number, col: number): Field | undefined {
    return this.fields.find((f) => f.row === row && f.col === col);
  }

  public swapItems(itemA: GameItem, itemB: GameItem) {
    const tile1Field = itemA.field;
    const tile2Field = itemB.field;

    tile1Field.item = itemB;
    itemB.field = tile1Field;

    tile2Field.item = itemA;
    itemA.field = tile2Field;
  }
}

export default Board;

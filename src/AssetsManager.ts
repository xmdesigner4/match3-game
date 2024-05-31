import * as PIXI from "pixi.js";
import { singleton } from "tsyringe";
import * as FontFaceObserver from "fontfaceobserver";
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
import { loadJson } from "./helpers/utils";
import { GameItemType } from "./api/GameItemType";

export const gameItemShadow = new DropShadowFilter({
  color: 0x000000,
  alpha: 0.3,
  blur: 2,
  resolution: 1,
  offset: { x: 2, y: 2 },
});

export const gameItemShadowUp = new DropShadowFilter({
  color: 0x000000,
  alpha: 0.2,
  blur: 3,
  resolution: 1,
  offset: { x: 2, y: 8 },
});

@singleton()
export class AssetsManager {
  public tiles: PIXI.Spritesheet;
  public assets: PIXI.Spritesheet;
  public bgTx: PIXI.Texture;
  public winTx: PIXI.Texture;
  public failTx: PIXI.Texture;
  public emitterData: Map<GameItemType, JSON>;

  constructor() {
    console.info("Assets init...");
    this.init().then(() => {
      console.info("Assets loaded!");
    });
  }

  public async init() {
    this.tiles = await PIXI.Assets.load("./assets/spritesheets/tiles.json");
    this.assets = await PIXI.Assets.load("./assets/spritesheets/assets.json");
    this.bgTx = await PIXI.Assets.load("./assets/bg.png");
    this.winTx = await PIXI.Assets.load("./assets/win.png");
    this.failTx = await PIXI.Assets.load("./assets/fail.png");

    //fonts
    const font = new FontFaceObserver("Chango");
    await font.load();

    // load particles
    this.emitterData = new Map();
    const emitterRedData = await loadJson("./assets/emitters/emitterRed.json");
    this.emitterData.set(GameItemType.DIAMOND, emitterRedData);
  }

  public getTileSprite = (id: string) => {
    const s = PIXI.Sprite.from(this.tiles.textures[id]);
    // s.filters = id === "tile.png" ? [] : [gameItemShadow];
    return s;
  };

  public getAssetSprite = (id: string) => {
    return PIXI.Sprite.from(this.assets.textures[id]);
  };
}

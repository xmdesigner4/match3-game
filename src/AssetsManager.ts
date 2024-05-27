import * as PIXI from "pixi.js";
import { singleton } from "tsyringe";

@singleton()
export class AssetsManager {
  public tiles: PIXI.Spritesheet;
  public assets: PIXI.Spritesheet;
  public bgTx: PIXI.Texture;
  public winTx: PIXI.Texture;
  public failTx: PIXI.Texture;

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
    // @ts-ignore
    const font = new FontFaceObserver("Chango");
    await font.load();
  }

  public getTileSprite = (id: string) => {
    return new PIXI.Sprite(this.tiles.textures[id]);
  };

  public getAssetSprite = (id: string) => {
    return new PIXI.Sprite(this.assets.textures[id]);
  };
}

import * as PIXI from "pixi.js";
import { container as diContainer } from "tsyringe";
import { AssetsManager } from "../AssetsManager";

export type NineSliceOptions = {
  leftWidth: number;
  topHeight: number;
  rightWidth: number;
  bottomHeight: number;
};

export const defaultNineSliceOptions: NineSliceOptions = {
  leftWidth: 10,
  topHeight: 10,
  rightWidth: 10,
  bottomHeight: 10,
};

export class NineSlice {
  public container: PIXI.Container;
  public nineSliceBG: PIXI.NineSlicePlane;
  public am: AssetsManager;

  get width(): number {
    return this.nineSliceBG.width;
  }
  set width(value: number) {
    if (value === this.width) return;
    this.nineSliceBG.width = value;
  }

  constructor(
    textureID: string,
    options: NineSliceOptions = defaultNineSliceOptions,
  ) {
    this.am = diContainer.resolve(AssetsManager);
    this.container = new PIXI.Container();
    this.init(textureID, options).then();
  }

  public async init(textureID: string, options: NineSliceOptions) {
    const tx = this.am.assets.textures[textureID];
    this.nineSliceBG = new PIXI.NineSlicePlane(
      tx,
      options.leftWidth,
      options.topHeight,
      options.rightWidth,
      options.bottomHeight,
    );
    this.nineSliceBG.scale.set(0.5);
    this.container.addChild(this.nineSliceBG);
  }
}

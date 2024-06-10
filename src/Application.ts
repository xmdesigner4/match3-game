import "reflect-metadata";
import * as PIXI from "pixi.js";
import { ICanvas, Sprite } from "pixi.js";
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import { EasePack } from "gsap/EasePack";
import { AssetsManager } from "./AssetsManager";
import { container as diContainer } from "tsyringe";
import { IGameConfig } from "./gameConfig";
import { SceneType } from "./api/SceneType";
import { SceneManager } from "./SceneManager";
import { GameItemType } from "./api/GameItemType";
import { Emitter } from "@pixi/particle-emitter";

export class Application {
  public app: PIXI.Application<HTMLCanvasElement>;
  public am: AssetsManager;
  public sceneManager: SceneManager;

  constructor(public config?: IGameConfig) {
    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
    gsap.registerPlugin(EasePack);

    this.app = new PIXI.Application({
      backgroundColor: 0xfafafa,
      resizeTo: window,
    });
    this.sceneManager = new SceneManager(this.app);
    this.init(config).then();
  }

  public async init(config: any) {
    document.body.appendChild(this.app.view);

    // inject AssetsManager
    this.am = diContainer.resolve(AssetsManager);
    await this.am.init();

    this.addBackground();

    //add red emitter
    // const particleContainer = new PIXI.ParticleContainer();
    // const emitter = new Emitter(
    //   particleContainer,
    //   this.am.emitterData[GameItemType.DIAMOND],
    // );
    // emitter.emit = true;
    // this.app.stage.addChild(particleContainer);

    this.sceneManager.switchScene(SceneType.START);
  }

  private addBackground() {
    const background = new PIXI.Sprite(this.am.bgTx);
    background.anchor.set(0.5);
    this.app.stage.addChild(background);

    this.positionBackground(background);
    window.addEventListener("resize", () => {
      this.positionBackground(background);
    });
  }

  private positionBackground(back: Sprite) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const windowAspect = vw / vh;
    const backAspect = back.texture.width / back.texture.height;
    if (backAspect > windowAspect) {
      back.width = vh * backAspect;
      back.height = vh;
    } else {
      back.width = vw;
      back.height = vw / backAspect;
    }
    back.x = vw / 2;
    back.y = vh / 2;
  }
}

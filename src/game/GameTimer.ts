import * as PIXI from "pixi.js";
import { container as diContainer } from "tsyringe";
import { AssetsManager } from "../AssetsManager";
import { NineSlice } from "../helpers/NineSlice";
import { gsap, Power0 } from "gsap";
import gameConfig from "../gameConfig";
import Board from "./Board";
import { Events } from "../api/Events";
import { SceneType } from "../api/SceneType";

const TIMER_WIDTH_MIN = 26;

export class GameTimer {
  public container: PIXI.Container;
  public am: AssetsManager;
  public bg: NineSlice;
  public fill: NineSlice;

  constructor(
    public signalContainer: PIXI.Container,
    initWidth: number = TIMER_WIDTH_MIN,
  ) {
    this.container = new PIXI.Container();
    this.init(initWidth).then();
  }

  public async init(initWidth: number) {
    this.am = diContainer.resolve(AssetsManager);

    this.bg = new NineSlice("timer_bg-nsp.png", {
      leftWidth: 12,
      topHeight: 12,
      rightWidth: 12,
      bottomHeight: 12,
    });
    this.container.addChild(this.bg.container);

    this.fill = new NineSlice("timer_fill-nsp.png", {
      leftWidth: 12,
      topHeight: 12,
      rightWidth: 12,
      bottomHeight: 12,
    });
    this.container.addChild(this.fill.container);
    this.setWidth(initWidth);
  }

  public setWidth(value: number) {
    this.bg.width = value;
  }

  public setProgress(value: number) {
    const w = (this.container.width * 2 * value) / 100;
    this.fill.width = Math.max(w, TIMER_WIDTH_MIN);
  }

  reset(): void {
    gsap.killTweensOf(this.fill);
    this.fill.width = 20;
  }

  pause(): void {
    gsap.killTweensOf(this.fill);
  }

  start(): void {
    // this.gameModel.timerStarted = true;
    this.fill.width = TIMER_WIDTH_MIN;
    gsap.to(this.fill, {
      width: this.bg.width,
      duration: gameConfig.timer,
      ease: Power0.easeNone,
      onComplete: () => {
        this.signalContainer.emit(Events.SCENE_CHANGE, {
          scene: SceneType.FINISH,
          win: false,
        });
        // debugger;
      },
    });
  }
}

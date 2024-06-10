import * as PIXI from "pixi.js";
import { container as diContainer } from "tsyringe";
import { AssetsManager } from "../AssetsManager";
import { Events } from "../api/Events";
import { SceneType } from "../api/SceneType";
import { Scene } from "./Scene";

class StartScene extends Scene {
  constructor() {
    super(true);
    this.init();
  }

  public init() {
    const am: AssetsManager = diContainer.resolve(AssetsManager);
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;

    const info = am.getAssetSprite("info01.png");
    info.scale.set(0.5);
    info.anchor.set(0, 0);
    this.container.addChild(info);

    const startButton = am.getAssetSprite("start_btn.png");
    startButton.scale.set(0.5);
    startButton.anchor.set(0, 0);
    startButton.x = info.x + info.width / 2 - startButton.width / 2;
    startButton.y = info.y + info.height / 2 + startButton.height / 2 + 8;
    startButton.eventMode = "static";
    startButton.cursor = "pointer";
    startButton.on("pointerdown", this.startGame.bind(this));
    this.container.addChild(startButton);
  }

  public startGame() {
    this.container.emit(Events.SCENE_CHANGE, {
      scene: SceneType.GAME,
      win: false,
    });
  }
}

export default StartScene;

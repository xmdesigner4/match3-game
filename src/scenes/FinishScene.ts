import * as PIXI from "pixi.js";
import { container as diContainer } from "tsyringe";
import { AssetsManager } from "../AssetsManager";
import { Scene } from "./Scene";
import { Events } from "../api/Events";
import { SceneType } from "../api/SceneType";

class FinishScene extends Scene {
  constructor(win?: boolean) {
    super();
    this.init(win);
  }

  public init(win?: boolean) {
    const am: AssetsManager = diContainer.resolve(AssetsManager);

    const stamp = new PIXI.Sprite(win ? am.winTx : am.failTx);
    stamp.scale.set(0.5);
    stamp.anchor.set(0.5);
    stamp.x = window.innerWidth / 2;
    stamp.y = window.innerHeight / 2;
    this.container.addChild(stamp);

    const tryAgainButton = new PIXI.Sprite(am.getAssetSprite("try_again.png"));
    tryAgainButton.scale.set(0.5);
    tryAgainButton.anchor.set(0.5);
    tryAgainButton.x = window.innerWidth / 2;
    tryAgainButton.y =
      stamp.y + stamp.height / 2 + tryAgainButton.height / 2 + 8;
    tryAgainButton.eventMode = "static";
    tryAgainButton.on("pointerdown", this.onTryAgain.bind(this));
    this.container.addChild(tryAgainButton);
  }

  private onTryAgain() {
    this.container.emit(Events.SCENE_CHANGE, { scene: SceneType.GAME });
  }
}

export default FinishScene;

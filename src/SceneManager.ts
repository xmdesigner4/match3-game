import * as PIXI from "pixi.js";
import { Scene } from "./scenes/Scene";
import { SceneType } from "./api/SceneType";
import StartScene from "./scenes/StartScene";
import GameScene from "./scenes/GameScene";
import FinishScene from "./scenes/FinishScene";
import { Events } from "./api/Events";

export class SceneManager {
  public scene: Scene;

  constructor(public app: PIXI.Application) {}

  public switchScene(toScene: SceneType, win = false) {
    let newScene: Scene;
    switch (toScene) {
      case SceneType.START: {
        newScene = new StartScene();
        break;
      }
      case SceneType.GAME: {
        newScene = new GameScene();
        break;
      }
      case SceneType.FINISH: {
        newScene = new FinishScene(win);
        break;
      }
      default:
        break;
    }
    if (!!newScene) {
      if (!!this.scene) {
        this.scene.container.destroy();
      }
      this.scene = newScene;
      newScene.container.on(Events.SCENE_CHANGE, this.onSceneChange.bind(this));
      this.app.stage.addChild(newScene.container);
    }
  }

  private onSceneChange(payload: { scene: SceneType; win: boolean }) {
    const { scene, win } = payload;
    console.log("scene:", scene);
    this.switchScene(scene, win);
  }
}

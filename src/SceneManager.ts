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

  public startScene(newScene: SceneType, win = false) {
    let scene: Scene;
    switch (newScene) {
      case SceneType.START: {
        scene = new StartScene();
        break;
      }
      case SceneType.GAME: {
        scene = new GameScene();
        break;
      }
      case SceneType.FINISH: {
        scene = new FinishScene(win);
        break;
      }
      default:
        break;
    }
    if (!!scene) {
      if (!!this.scene) {
        this.scene.container.destroy();
      }
      this.scene = scene;
      scene.container.on(Events.SCENE_CHANGE, this.onSceneChange.bind(this));
      this.app.stage.addChild(scene.container);
    }
  }

  private onSceneChange(payload: { scene: SceneType; win: boolean }) {
    const { scene, win } = payload;
    console.log("scene:", scene);
    this.startScene(scene, win);
  }
}

import * as PIXI from "pixi.js";
import { container as diContainer } from "tsyringe";
import { AssetsManager } from "../AssetsManager";
import Board from "./Board";
import gameConfig from "../gameConfig";
import { Events } from "../api/Events";
import { SceneType } from "../api/SceneType";

class Score {
  public container: PIXI.Container;

  private _score: number;
  get score(): number {
    return this._score;
  }
  set score(value: number) {
    this._score = value;
    if (!!this.scoreText) {
      this.scoreText.text = value > 9 ? value : `0${value}`;
    }
  }

  private scoreText: PIXI.Text;

  constructor(
    public board: Board,
    public signalContainer: PIXI.Container,
  ) {
    this.score = 0;
    this.init();
  }

  public init() {
    this.container = new PIXI.Container();

    // score graphics
    const am: AssetsManager = diContainer.resolve(AssetsManager);
    const scoreBack = new PIXI.Sprite(am.getAssetSprite("total.png"));
    scoreBack.anchor.set(0, 1);
    scoreBack.scale.set(0.5);
    scoreBack.x = this.board.container.x - this.board.container.width / 2;
    scoreBack.y = this.board.container.y - this.board.container.height / 2;
    this.container.addChild(scoreBack);

    // @ts-ignore
    this.scoreText = new PIXI.Text({
      text: "00",
      style: {
        fontFamily: "Chango",
        fontWeight: "normal",
        fontSize: "30",
        fill: "white",
        stroke: { color: "black", width: 4 },
      },
    });
    this.scoreText.anchor.set(1, 1);
    this.scoreText.x = scoreBack.x + scoreBack.width + 24;
    this.scoreText.y = scoreBack.y + 6;
    this.container.addChild(this.scoreText);
  }

  public add(toScore: number) {
    // TODO: make score increase gradually slowing, gsap.to(onUpdate, onStart)
    this.score += toScore;
    if (this.score >= gameConfig.winScore) {
      console.log("WIN!!!WIN!!!WIN!!!WIN!!!WIN!!!");
      this.signalContainer.emit(Events.SCENE_CHANGE, {
        scene: SceneType.FINISH,
        win: true,
      });
    }
  }
}

export default Score;

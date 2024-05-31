import * as PIXI from "pixi.js";
import { container as diContainer } from "tsyringe";
import { AssetsManager } from "../AssetsManager";
import Board from "./Board";
import gameConfig from "../gameConfig";
import { Events } from "../api/Events";
import { SceneType } from "../api/SceneType";
import { NineSlice } from "../helpers/NineSlice";

class Score {
  public container: PIXI.Container;
  public score_9bg: NineSlice;

  private _score: number;
  get score(): number {
    return this._score;
  }
  set score(value: number) {
    this._score = value;
    if (!!this.scoreText) {
      this.scoreText.text = value.toString();
      if (!!this.score_9bg) {
        this.score_9bg.width = this.score.toString().length * 44 + 6 * 3 + 2;
        this.scoreText.x =
          this.score_9bg.container.x + this.score_9bg.container.width / 2;
      }
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
    const scoreBack = am.getAssetSprite("total.png");
    scoreBack.anchor.set(0, 1);
    scoreBack.scale.set(0.5);
    scoreBack.x = this.board.container.x - this.board.container.width / 2;
    scoreBack.y = this.board.container.y - this.board.container.height / 2;
    this.container.addChild(scoreBack);

    this.score_9bg = new NineSlice("total-9bg.png");
    this.score_9bg.container.x = scoreBack.x + scoreBack.width + 6;
    this.score_9bg.container.y = scoreBack.y - scoreBack.height - 4;
    this.container.addChild(this.score_9bg.container);

    // @ts-ignore
    this.scoreText = new PIXI.Text(this.score, {
      fontFamily: "Chango",
      fontWeight: "normal",
      fontSize: 24,
      fill: "1ea7e1",
      stroke: "white",
      strokeThickness: 2,
    });
    this.scoreText.anchor.set(0.5, 1);
    this.scoreText.y = scoreBack.y + 2;
    this.container.addChild(this.scoreText);
    this.score_9bg.width = this.score.toString().length * 44 + 6 * 3 + 2;
    this.scoreText.x =
      this.score_9bg.container.x + this.score_9bg.container.width / 2;
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

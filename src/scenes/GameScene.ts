import "reflect-metadata";
import Board from "../game/Board";
import GameItem from "../game/GameItem";
import { Events } from "../api/Events";
import { CombinationManager, MatchingSet } from "../game/CombinationManager";
import Field from "../game/Field";
import Score from "../game/Score";
import { Scene } from "./Scene";
import { GameTimer } from "../game/GameTimer";

class GameScene extends Scene {
  public board: Board;
  public disabled: boolean;
  public cm: CombinationManager;
  public score: Score;

  private _selectedItem: GameItem | null;
  public get selectedItem() {
    return this._selectedItem;
  }
  public set selectedItem(value: GameItem | null) {
    if (!value) {
      this.selectedItem.selected = false;
    }
    this._selectedItem = value;
    if (!!value) {
      this._selectedItem.selected = !!value;
    }
  }

  constructor() {
    super();
    this.addBoard();

    this.score = new Score(this.board, this.container);
    this.container.addChild(this.score.container);

    this.cm = new CombinationManager(this.board);
    this.board.container.on(Events.ITEM_SELECT, this.onItemClick.bind(this));

    this.removeStartMatches();

    const timer = new GameTimer(
      this.container,
      this.board.container.width * 2 - 16,
    );
    timer.container.x =
      this.board.container.x - this.board.container.width / 2 + 4;
    timer.container.y =
      this.board.container.y + this.board.container.height / 2 + 4;
    this.container.addChild(timer.container);
    timer.start();
  }

  public onItemClick(item: GameItem) {
    if (this.disabled) {
      return;
    }

    if (this.selectedItem) {
      if (!this.selectedItem.isNear(item)) {
        this.selectedItem = null;
        this.selectedItem = item;
      } else {
        this.swapItems(this.selectedItem, item);
      }
    } else {
      this.selectedItem = item;
    }
  }

  public swapItems(selectedItem: GameItem, item: GameItem, reverse = false) {
    this.disabled = true;
    selectedItem.sprite.zIndex = 2;

    selectedItem.moveTo(item.field.position, 0.2).then();
    if (this.selectedItem) {
      this.selectedItem = null;
    }

    item.moveTo(selectedItem.field.position, 0.2).then(() => {
      this.board.swapItems(selectedItem, item);
      if (!reverse) {
        const matches = this.cm.getMatches();
        if (!!matches.length) {
          this.processMatches(matches);
        } else {
          this.swapItems(item, selectedItem, true);
        }
      } else {
        this.disabled = false;
      }
    });
  }

  private processMatches(matches: MatchingSet) {
    const sum = matches.reduce((acc, cv) => {
      return (acc += cv.length);
    }, 0);
    this.score.add(sum);
    this.removeItems(matches);
    this.fallItemsDown()
      .then(() => this.addNewGameItems())
      .then(() => this.onFallDownOver());
  }

  private onFallDownOver() {
    const matches = this.cm.getMatches();

    if (matches.length) {
      this.processMatches(matches);
    } else {
      this.disabled = false;
    }
  }

  private addNewGameItems() {
    return new Promise<void>((resolve) => {
      const fields = this.board.fields.filter((field) => field.item === null);
      let total = fields.length;
      let completed = 0;

      fields.forEach((field) => {
        const item = this.board.createGameItem(field);
        item.sprite.y = -800;
        const delay = (Math.random() * 2) / 10 + 0.3 / (field.row + 1);
        item.fallDownTo(field.position, delay).then(() => {
          ++completed;
          if (completed >= total) {
            resolve();
          }
        });
      });
    });
  }

  private removeItems(matches: MatchingSet) {
    matches.forEach((mi) => {
      mi.forEach((i) => {
        i.remove();
      });
    });
  }

  private fallItemsDown() {
    return new Promise<void>((resolve) => {
      let completed = 0;
      let started = 0;

      for (let row = this.board.rows - 1; row >= 0; row--) {
        for (let col = this.board.cols - 1; col >= 0; col--) {
          const field = this.board.getField(row, col);

          if (!field.item) {
            ++started;

            this.fallDownTo(field).then(() => {
              ++completed;
              if (completed >= started) {
                resolve();
              }
            });
          }
        }
      }
    });
  }

  private fallDownTo(emptyField: Field) {
    for (let row = emptyField.row - 1; row >= 0; row--) {
      let fallingField = this.board.getField(row, emptyField.col);

      if (fallingField.item) {
        const fallingItem = fallingField.item;
        fallingItem.field = emptyField;
        emptyField.item = fallingItem;
        fallingField.item = null;
        return fallingItem.fallDownTo(emptyField.position);
      }
    }

    return Promise.resolve();
  }

  private removeStartMatches() {
    let matches = this.cm.getMatches(); // find combinations to collect

    while (matches.length) {
      // as long as there are combinations
      this.removeItems(matches); // remove tiles in combinations

      const fields = this.board.fields.filter((field) => field.item === null); // find empty fields

      fields.forEach((field) => {
        // in each empty field
        this.board.createGameItem(field); // create a new random tile
      });

      matches = this.cm.getMatches(); // looking for combinations again after adding new tiles
    }
  }

  private addBoard() {
    this.board = new Board();
    this.container.addChild(this.board.container);

    this.positionBoard();
    window.addEventListener("resize", () => {
      this.positionBoard();
    });
  }

  private positionBoard() {
    // position
    const tileWidth = this.board.fields[0].sprite.width / 2;
    this.board.container.pivot.x = this.board.container.width / 2 - tileWidth;
    this.board.container.pivot.y = this.board.container.height / 2 - tileWidth;
    this.board.container.x = window.innerWidth / 2;
    this.board.container.y = window.innerHeight / 2;

    // scale
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const boardAspect =
      this.board.container.width / this.board.container.height;
    const windowAspect = vw / vh;
    if (boardAspect > windowAspect) {
      this.board.container.width = vw - tileWidth / 2;
      this.board.container.height = (vw - tileWidth / 2) / boardAspect;
    } else {
      this.board.container.height = vh - tileWidth / 2 - 40;
      this.board.container.width = (vh - tileWidth / 2 - 40) * boardAspect;
    }
  }
}
export default GameScene;

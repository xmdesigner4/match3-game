import Board from "./Board";
import GameItem from "./GameItem";

export type Direction = "left" | "down";
export type MatchingGameItems = GameItem[];
export type MatchingSet = MatchingGameItems[];

export class CombinationManager {
  static readonly MATCHING_COUNT_MIN = 3;
  static readonly MATCHING_COUNT_MAX = 5;

  constructor(public board: Board) {
    this.board = board;
  }

  public getMatches(swappedItemA?: GameItem, swappedItemB?: GameItem) {
    let result: MatchingSet = [];

    this.board.fields.forEach((sampleField) => {
      let matchingItems = [sampleField.item];

      // look left
      for (
        let i_row = 1;
        i_row <= CombinationManager.MATCHING_COUNT_MAX;
        i_row++
      ) {
        const row = sampleField.row + i_row;
        const comparingField = this.board.getField(row, sampleField.col);
        if (comparingField?.item.type === sampleField.item.type) {
          matchingItems.push(comparingField.item);
        } else {
          break;
        }
      }
      if (matchingItems.length >= CombinationManager.MATCHING_COUNT_MIN) {
        result.push(matchingItems);
      }

      // look down
      matchingItems = [sampleField.item];
      for (
        let i_col = 1;
        i_col <= CombinationManager.MATCHING_COUNT_MAX;
        i_col++
      ) {
        const col = sampleField.col + i_col;
        const comparingField = this.board.getField(sampleField.row, col);
        if (comparingField?.item.type === sampleField.item.type) {
          matchingItems.push(comparingField.item);
        } else {
          break;
        }
      }

      if (matchingItems.length >= CombinationManager.MATCHING_COUNT_MIN) {
        result.push(matchingItems);
      }
    });
    result.forEach((mi) => {
      console.log(
        "item:",
        mi.map((i) => `${i.type} at ${i.field.col}:${i.field.row}`),
      );
    });
    return result;
  }
}

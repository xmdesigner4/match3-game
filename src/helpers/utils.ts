import { GameItemType } from "../api/GameItemType";

export const rndRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomGameItemType = () => {
  const map = Object.values(GameItemType);
  return map[rndRange(0, map.length - 1)];
};

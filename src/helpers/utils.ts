import * as PIXI from "pixi.js";
import { GameItemType } from "../api/GameItemType";

export const rndRange = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const getRandomGameItemType = () => {
  const map = Object.values(GameItemType);
  return map[rndRange(0, map.length - 1)];
};

export const loadJson = async (url: string): Promise<JSON> => {
  return await fetch(url).then(async (res) => await res.json());
};

export const letterBox = (
  content: PIXI.Container,
  margin: number = 0,
  container: Window = window,
) => {
  // scale
  const vw = container.innerWidth;
  const vh = container.innerHeight;
  const contentAspect = content.width / content.height;
  const containerAspect = vw / vh;
  if (contentAspect > containerAspect) {
    // content is wide, container is tall
    content.width = vw - margin;
    content.height = (vw - margin) / contentAspect;
  } else {
    // content is tall, container is wide
    content.height = vh - margin / 2;
    content.width = (vh - margin / 2) * contentAspect;
  }
  // position
  // content.pivot.x = content.width / 2;
  // content.pivot.y = content.height / 2;
  // content.x = container.innerWidth / 2;
  // content.y = container.innerHeight / 2;
  content.x = parent.innerWidth / 2 - content.width / 2;
  content.y = parent.innerHeight / 2 - content.height / 2;
};

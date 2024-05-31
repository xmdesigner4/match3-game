export interface IGameConfig {
  rows: number;
  cols: number;
  winScore: number;
  timer: number;
}
const gameConfig: IGameConfig = {
  rows: 8,
  cols: 8,
  winScore: 20,
  timer: 30,
};

export default gameConfig;

export interface IGameConfig {
  rows: number;
  cols: number;
  winScore: number;
}
const gameConfig: IGameConfig = {
  rows: 8,
  cols: 8,
  winScore: 24,
};

export default gameConfig;

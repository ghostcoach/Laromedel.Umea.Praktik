import { SelectedGame } from "./selected-game";

interface ISelectedGameViewModel {
  name: string;
  displayName: string;
  logoImage: string;
  menuImage: string;
  menuImageAlt: string;
  subjectArea: SelectedGame;
}

export interface ISelectedGameStateModel {
  selectedGame: SelectedGame;
  categories: ISelectedGameViewModel[];
}
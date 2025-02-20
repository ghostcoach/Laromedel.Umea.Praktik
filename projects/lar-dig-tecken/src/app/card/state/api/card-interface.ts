export interface ICardStateModel {
    isFlipped: boolean,
    isSelected: boolean,
    isCorrect: boolean
}

export interface IMultipleCardStatesModel {
    cardStates: ICardStateModel[];
  }
  
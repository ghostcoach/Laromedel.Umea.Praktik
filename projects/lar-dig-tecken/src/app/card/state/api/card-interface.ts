export interface ICardStateModel {
    isFlipped: boolean,
    isSelected: boolean,
    isCorrect: boolean
}

export interface IMultipleCardStatesModel {
    cardStates: ICardStateModel[];
  }
  

export interface ICardFullStateModel {
    mode: "firstCard" | "secondCard" | "", //firstCard or secondCard ---> retrieved in card.component
    contentMedium: string, //category ---> retrieved in card.component
    word: string, //word ---> retrieved in card-content.component
    content: string, //word or image/video-path ---> retrieved in card-content.component
    audioPath: string, //audio path ---> retrieved in card.component
    flippedClass: "flipped" | "not-flipped", //flipped or not-flipped ---> retrieved in card.component
    correctClass: "correct-card" | "incorrect-card" | "", //correct-card or incorrect-card ---> retrieved in card.component
    playVideo?: () => void, //function to play video ---> retrieved in card.component
    playAudio?: () => void, //function to play audio ---> retrieved in card.component
}

export interface IMultipleFullStateModel {
    cardStates: ICardFullStateModel[];
}

export interface IFlippedStateModel {
    flippedClass: "flipped" | "not-flipped"
}
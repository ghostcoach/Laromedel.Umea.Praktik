import {SubjectArea} from "../../subject-area/api/subject-area";
import {MemoryCard} from "@games/memory-card";

export interface ICategory {
  name: string;
  displayName: string;
  menuImage: string;
  menuImageAlt: string;
  cardFrontImage: string;
  cardBackImage: string;
  subjectArea: SubjectArea;
  cards: MemoryCard[];
  scoreCardImage: string;
  scoreCardImageAlt: string;
  wordsNotInSameDeck: string[];
}

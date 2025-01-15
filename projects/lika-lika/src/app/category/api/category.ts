import {SubjectArea} from "../../subject-area/api/subject-area";
import {MemoryCard} from "@games/memory-card";

export interface ICategory {
  name: string;
  displayName: string;
  logoImage: string;
  menuImage: string;
  menuImageAlt: string;
  cardFrontImage: string;
  cardBackImage: string;
  subjectArea: SubjectArea;
  cards: MemoryCard[];
  wordsNotInSameDeck: string[];
}

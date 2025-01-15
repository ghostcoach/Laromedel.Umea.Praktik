import {SubjectArea} from "../../subject-area/api/subject-area";

export interface ICategoryViewModel {
  name: string;
  displayName: string;
  logoImage: string;
  menuImage: string;
  menuImageAlt: string;
  subjectArea: SubjectArea;
}

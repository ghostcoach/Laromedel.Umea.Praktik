import {ICategoryViewModel} from "../../category/api/category-view-model";
import {SubjectArea} from "./subject-area";

export interface ISubjectAreaStateModel {
  subjectArea: SubjectArea;
  categories: ICategoryViewModel[];
}

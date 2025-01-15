import {SubjectArea} from "../api/subject-area";
import {ICategoryViewModel} from "../../category/api/category-view-model";

export class UpdateSubjectArea {
  static readonly type = "[SubjectArea] Update Subject Area";

  constructor(public subjectArea: SubjectArea) {}
}

export class UpdateSubjectAreaCategories {
  static readonly type = "[SubjectArea] Update Categories";

  constructor(public categories: ICategoryViewModel[]) {}
}

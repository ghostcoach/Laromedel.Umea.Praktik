import {Selector} from "@ngxs/store";
import {SubjectAreaState} from "./subject-area-state";
import {ISubjectAreaStateModel} from "../api/subject-area-state-model";
import {SubjectArea} from "../api/subject-area";
import {ICategoryViewModel} from "../../category/api/category-view-model";

export class SubjectAreaStateQueries {
  @Selector([SubjectAreaState])
  public static subjectArea$(state: ISubjectAreaStateModel): SubjectArea {
    return state.subjectArea;
  }

  @Selector([SubjectAreaState])
  public static capitalizedSubjectArea$(state: ISubjectAreaStateModel): string {
    return state.subjectArea.charAt(0).toUpperCase() + state.subjectArea.slice(1);
  }

  @Selector([SubjectAreaState])
  public static subjectAreaDataName$(state: ISubjectAreaStateModel): string {
    return state.subjectArea.replace(/\s/g, "-").toLowerCase().toLowerCase().trim();
  }

  @Selector([SubjectAreaState])
  public static categories$(state: ISubjectAreaStateModel): ICategoryViewModel[] {
    return state.categories;
  }

  @Selector([SubjectAreaState])
  public static categoryNamePlaying$(state: ISubjectAreaStateModel): string {
    return state.categoryNamePlaying;
  }
}

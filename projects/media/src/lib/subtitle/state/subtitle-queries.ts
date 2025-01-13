import { Injectable } from "@angular/core";
import { ISubtitleStateModel } from "../api/subtitle-state-model";
import { Selector } from "@ngxs/store";
import { SubtitleState } from "./subtitle-state";
import { ISubtitleText } from "../api/subtitle-text";
import { SubtitleDisplayMode } from "../api/subtitle-display-mode";

@Injectable()
export class SubtitleQueries {
  @Selector([SubtitleState])
  public static isSubtitleEnabled$(state: ISubtitleStateModel): boolean {
    return state.isSubtitleEnabled;
  }

  @Selector([SubtitleState])
  public static subtitleText$(state: ISubtitleStateModel): ISubtitleText {
    return state.subtitleText;
  }

  @Selector([SubtitleState])
  public static isSubtitleHidden$(state: ISubtitleStateModel): boolean {
    return (
      state.isSubtitleHidden ||
      (state.subtitleText.row1 === "" && state.subtitleText.row2 === "") ||
      state.isSubtitleEnabled === false
    );
  }

  @Selector([SubtitleState])
  public static showSecondSubtitleRow$(state: ISubtitleStateModel): boolean {
    return state.subtitleDisplayMode === SubtitleDisplayMode.TWO_ROWS;
  }
}

import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {ISubtitleStateModel} from "../api/subtitle-state-model";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Injectable} from "@angular/core";
import {
  DisableSubtitle,
  DisplayTextAsSubtitle,
  EnableSubtitle,
  HideSubtitle,
  MakeSubtitleVisible,
  ResetSubtitleText,
  ToggleSubtitles,
  UpdateIsSubtitleEnabled,
  UpdateSubtitleDisplayMode,
  UpdateSubtitleText,
} from "./subtitle-actions";
import {SubtitleDisplayMode} from "../api/subtitle-display-mode";
import {ISubtitleText} from "../api/subtitle-text";

const stateToken: StateToken<ISubtitleStateModel> = new StateToken<ISubtitleStateModel>("subtitleState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: {
    isSubtitleEnabled: false,
    subtitleText: {
      row1: "",
      row2: "",
    },
    isSubtitleHidden: true,
    subtitleDisplayMode: SubtitleDisplayMode.ONE_ROW,
  },
})
@Injectable()
export class SubtitleState {
  private readonly SUBTITLE_SPLIT_LIMIT: number = 50;
  private subtitleTimeout: ReturnType<typeof setTimeout>;

  @Action(UpdateSubtitleText)
  public updateSubtitleText({patchState}: StateContext<ISubtitleStateModel>, {subtitleText}: UpdateSubtitleText): void {
    patchState({
      subtitleText: subtitleText,
    });
  }

  @Action(ToggleSubtitles)
  public toggleSubtitle({getState, patchState}: StateContext<ISubtitleStateModel>): void {
    const state: ISubtitleStateModel = getState();
    patchState({
      isSubtitleEnabled: !state.isSubtitleEnabled,
    });
  }

  @Action(EnableSubtitle)
  public enableSubtitle({patchState}: StateContext<ISubtitleStateModel>): void {
    patchState({
      isSubtitleEnabled: true,
    });
  }

  @Action(DisableSubtitle)
  public disableSubtitle({patchState}: StateContext<ISubtitleStateModel>): void {
    patchState({
      isSubtitleEnabled: false,
    });
  }

  @Action(UpdateIsSubtitleEnabled)
  public updateIsSubtitleEnabled({patchState}: StateContext<ISubtitleStateModel>, {isSubtitleEnabled}: UpdateIsSubtitleEnabled): void {
    patchState({
      isSubtitleEnabled: isSubtitleEnabled,
    });
  }

  @Action(ResetSubtitleText)
  public resetSubtitleText({patchState}: StateContext<ISubtitleStateModel>): void {
    clearTimeout(this.subtitleTimeout);
    patchState({
      subtitleText: {
        row1: "",
        row2: "",
      },
    });
  }

  @Action(MakeSubtitleVisible)
  public makeSubtitleVisible({patchState}: StateContext<ISubtitleStateModel>): void {
    patchState({
      isSubtitleHidden: false,
    });
  }

  @Action(HideSubtitle)
  public hideSubtitle({patchState}: StateContext<ISubtitleStateModel>): void {
    patchState({
      isSubtitleHidden: true,
    });
  }

  @Action(UpdateSubtitleDisplayMode)
  public updateSubtitleDisplayMode({patchState}: StateContext<ISubtitleStateModel>, {subtitleText}: UpdateSubtitleDisplayMode): void {
    patchState({
      subtitleDisplayMode: this.parseSubtitleDisplayMode(subtitleText),
    });
  }

  @Action(DisplayTextAsSubtitle)
  public displaySubtitle(
    {dispatch, patchState, getState}: StateContext<ISubtitleStateModel>,
    {text, durationSeconds}: DisplayTextAsSubtitle,
  ): void {
    const subtitleDisplayMode: SubtitleDisplayMode = this.parseSubtitleDisplayMode(text);
    const subtitleText: ISubtitleText = this.getSubtitleTextByDisplayMode(text, subtitleDisplayMode);

    patchState({
      subtitleText: subtitleText,
      subtitleDisplayMode: subtitleDisplayMode,
      isSubtitleHidden: false,
    });

    this.subtitleTimeout = setTimeout((): void => {
      const subtitleTextAfterTimeout: ISubtitleText = getState().subtitleText;
      if (subtitleTextAfterTimeout !== subtitleText) return;

      dispatch(new ResetSubtitleText());
      dispatch(new HideSubtitle());
    }, durationSeconds * 1000);
  }

  private parseSubtitleDisplayMode(text: string): SubtitleDisplayMode {
    return text.length < this.SUBTITLE_SPLIT_LIMIT ? SubtitleDisplayMode.ONE_ROW : SubtitleDisplayMode.TWO_ROWS;
  }

  private getSubtitleTextByDisplayMode(text: string, displayMode: SubtitleDisplayMode): ISubtitleText {
    return displayMode === SubtitleDisplayMode.ONE_ROW
      ? {
          row1: text,
          row2: "",
        }
      : this.splitSubtitleTextIntoTwoRows(text);
  }

  private splitSubtitleTextIntoTwoRows(str: string): ISubtitleText {
    const mid: number = Math.floor(str.length / 2) + 4;
    const splitAt: number = str.lastIndexOf(" ", mid) + 1 || 0;

    return {
      row1: str.slice(0, splitAt).trim(),
      row2: str.slice(splitAt).trim(),
    };
  }
}

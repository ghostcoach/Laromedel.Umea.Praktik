import {Action, State, StateContext, StateToken} from "@ngxs/store";
import {IVideoStateModel} from "../api/video-state-model";
import {UntilDestroy} from "@ngneat/until-destroy";
import {VideoStatus} from "../api/video-status";
import {Injectable} from "@angular/core";
import {
  JumpAhead,
  JumpBack,
  JumpToTimestamp,
  PauseVideo,
  PlayVideo,
  ReplayVideo,
  ResetVideo,
  ToggleVideoStatus,
  UpdateVideoStatus,
} from "./video-state-actions";

const stateToken: StateToken<IVideoStateModel> = new StateToken<IVideoStateModel>("videoState");

@UntilDestroy()
@State({
  name: stateToken,
  defaults: {
    status: VideoStatus.STOPPED,
    jumpToTimestamp: 0,
  },
})
@Injectable()
export class VideoState {
  @Action(UpdateVideoStatus)
  public updateVideoStatus({patchState}: StateContext<IVideoStateModel>, {status}: UpdateVideoStatus): void {
    patchState({status});
  }

  @Action(ToggleVideoStatus)
  public toggleVideoStatus({getState, patchState}: StateContext<IVideoStateModel>): void {
    const state: IVideoStateModel = getState();
    patchState({
      status: state.status === VideoStatus.PLAYING ? VideoStatus.PAUSED : VideoStatus.PLAYING,
    });
  }

  @Action(ReplayVideo)
  public replayVideo({patchState}: StateContext<IVideoStateModel>): void {
    patchState({status: VideoStatus.STOPPED});

    setTimeout((): void => {
      patchState({status: VideoStatus.PLAYING});
    }, 200);
  }

  @Action(JumpToTimestamp)
  public jumpToTimestamp({patchState}: StateContext<IVideoStateModel>, {jumpToTimestamp}: JumpToTimestamp): void {
    patchState({jumpToTimestamp});
  }

  @Action(JumpAhead)
  public jumpAhead({getState, dispatch}: StateContext<IVideoStateModel>): void {
    const state: IVideoStateModel = getState();
    dispatch(new JumpToTimestamp(state.jumpToTimestamp + JumpAhead.SECONDS_TO_JUMP));
  }

  @Action(JumpBack)
  public jumpBack({getState, dispatch}: StateContext<IVideoStateModel>): void {
    const state: IVideoStateModel = getState();
    dispatch(new JumpToTimestamp(state.jumpToTimestamp - JumpBack.SECONDS_TO_JUMP));
  }

  @Action(PlayVideo)
  public playVideo({patchState}: StateContext<IVideoStateModel>): void {
    patchState({status: VideoStatus.PLAYING});
  }

  @Action(PauseVideo)
  public pauseVideo({patchState}: StateContext<IVideoStateModel>): void {
    patchState({status: VideoStatus.PAUSED});
  }

  @Action(ResetVideo)
  public resetVideo({patchState}: StateContext<IVideoStateModel>): void {
    patchState({
      status: VideoStatus.STOPPED,
      jumpToTimestamp: 0,
    });
  }
}

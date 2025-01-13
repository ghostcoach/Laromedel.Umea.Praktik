import {Injectable} from "@angular/core";
import {VideoState} from "./video-state";
import {Selector} from "@ngxs/store";
import {IVideoStateModel} from "../api/video-state-model";
import {VideoStatus} from "../api/video-status";

@Injectable()
export class VideoStateQueries {
  @Selector([VideoState])
  public static isVideoPlaying$(state: IVideoStateModel): boolean {
    return state.status === VideoStatus.PLAYING;
  }

  @Selector([VideoState])
  public static isVideoEnded$(state: IVideoStateModel): boolean {
    return state.status === VideoStatus.ENDED;
  }

  @Selector([VideoState])
  public static videoStatus$(state: IVideoStateModel): VideoStatus {
    return state.status;
  }

  @Selector([VideoState])
  public static jumpToTimestamp$(state: IVideoStateModel): number {
    return state.jumpToTimestamp;
  }

  @Selector([VideoState])
  public static hasVideoEnded$(state: IVideoStateModel): boolean {
    return state.status === VideoStatus.ENDED;
  }
}

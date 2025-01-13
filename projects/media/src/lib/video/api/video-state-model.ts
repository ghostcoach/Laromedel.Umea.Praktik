import { VideoStatus } from "./video-status";

export interface IVideoStateModel {
  status: VideoStatus;
  jumpToTimestamp: number;
}

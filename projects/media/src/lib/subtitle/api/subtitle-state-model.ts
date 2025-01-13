import { ISubtitleText } from "./subtitle-text";
import { SubtitleDisplayMode } from "./subtitle-display-mode";

export interface ISubtitleStateModel {
  subtitleText: ISubtitleText;
  isSubtitleEnabled: boolean;
  isSubtitleHidden: boolean;
  subtitleDisplayMode: SubtitleDisplayMode;
}

import {generateId, parseName} from "@utility/util";
import {CardContent} from "./card-content";
import {ImageExtension} from "@media/image-extension";
import {VideoExtension} from "@media/video-extension";
import {AudioExtension} from "@media/audio-extension";
import {IAudio} from "@media/api/audio";

export interface IMemoryCard {
  pairId: string;
  word: string;
  illustrationImage?: string;
  video?: string;
  ritadeTeckenImage?: string;
}

export class MemoryCard {
  private readonly _id: string;
  private readonly _name: string;
  private readonly illustrationBaseSrc: string;
  private readonly ritadeTeckenBaseSrc: string;
  private readonly videoBaseSrc: string;
  public readonly audioSrc: string;

  constructor(
    public pairId: string,
    public word: string,
    public baseHref: string,
    public cardContent: CardContent = CardContent.WORD,
  ) {
    this._id = generateId();
    this._name = parseName(word);

    this.illustrationBaseSrc = `${baseHref}/illustration/${this._name}`;
    this.ritadeTeckenBaseSrc = `${baseHref}/ritade-tecken/${this._name}`;
    this.videoBaseSrc = `${baseHref}/video/${this._name}`;
    this.audioSrc = `${baseHref}/audio/${this._name}${AudioExtension.MP3}`;
  }

  public get id(): string {
    return this._id;
  }

  public get videoMp4(): string {
    return `${this.videoBaseSrc}${VideoExtension.MP4}`;
  }

  public get illustrationSvg(): string {
    return `${this.illustrationBaseSrc}${ImageExtension.SVG}`;
  }

  public get illustrationWebp(): string {
    return `${this.illustrationBaseSrc}${ImageExtension.WEBP}`;
  }

  public get ritadeteckenSvg(): string {
    return `${this.ritadeTeckenBaseSrc}${ImageExtension.SVG}`;
  }

  public get ritadeteckenWebp(): string {
    return `${this.ritadeTeckenBaseSrc}${ImageExtension.WEBP}`;
  }

  public get audio(): IAudio {
    return {
      src: this.audioSrc,
      name: this.audioSrc,
    };
  }

  public copy(cardContent: CardContent = this.cardContent): MemoryCard {
    return new MemoryCard(this.pairId, this.word, this.baseHref, cardContent);
  }
}

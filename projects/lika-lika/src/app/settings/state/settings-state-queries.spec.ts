import {TestBed} from "@angular/core/testing";
import {NgxsModule, Store} from "@ngxs/store";
import {
  LoadSettingsFromLocalStorage,
  UpdateIsSettingsLocked,
  UpdateNumberOfCards,
  UpdateNumberOfPlayers,
  UpdatePairingMode,
  UpdatePlayMode,
  UpdateTextTransform,
} from "./settings-state-actions";
import {SettingsState} from "./settings-state";
import {TextTransform} from "../api/text-transform";
import {SettingsStateQueries} from "./settings-state-queries";
import {IPairingMode} from "@games/pairing-mode";
import {CardContent} from "@games/card-content";
import {CardCount} from "@games/card-count";
import {PlayerCount} from "../../../../../games/src/lib/api/player-count";
import {PlayMode} from "@games/play-mode";
import {ISettingsStorageData} from "../api/settings-storage-data";
import {AudioState, SubtitleState} from "@media/*";

describe("SettingsStateQueries", (): void => {
  let store: Store;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SettingsState, AudioState, SubtitleState])],
    });

    store = TestBed.inject(Store);
  });

  it("should select the text transform state", (): void => {
    store.dispatch(new UpdateTextTransform(TextTransform.UPPERCASE));
    const textTransform: TextTransform = store.selectSnapshot(SettingsStateQueries.textTransform$);
    expect(textTransform).toBe(TextTransform.UPPERCASE);
  });

  it("should select the pairing mode state", (): void => {
    const pairingMode: IPairingMode = {
      first: CardContent.WORD,
      second: CardContent.ILLUSTRATION,
    };
    store.dispatch(new UpdatePairingMode(pairingMode));
    const selectedPairingMode: IPairingMode = store.selectSnapshot(SettingsStateQueries.pairingMode$);
    expect(selectedPairingMode).toEqual(pairingMode);
  });

  it("should select the number of cards state", (): void => {
    store.dispatch(new UpdateNumberOfCards(CardCount.EIGHT));
    const numberOfCards: CardCount = store.selectSnapshot(SettingsStateQueries.numberOfCards$);
    expect(numberOfCards).toBe(CardCount.EIGHT);
  });

  it("should select the number of players state", (): void => {
    store.dispatch(new UpdateNumberOfPlayers(PlayerCount.TWO_PLAYERS));
    const numberOfPlayers: PlayerCount = store.selectSnapshot(SettingsStateQueries.numberOfPlayers$);
    expect(numberOfPlayers).toBe(PlayerCount.TWO_PLAYERS);
  });

  it("should select the play mode state", (): void => {
    store.dispatch(new UpdatePlayMode(PlayMode.OPEN_CARDS));
    const playMode: PlayMode = store.selectSnapshot(SettingsStateQueries.playMode$);
    expect(playMode).toBe(PlayMode.OPEN_CARDS);
  });

  it("should select the settings locked state", (): void => {
    store.dispatch(new UpdateIsSettingsLocked(true));
    const isSettingsLocked: boolean = store.selectSnapshot(SettingsStateQueries.isSettingsLocked$);
    expect(isSettingsLocked).toBe(true);
  });

  it("should select the settings storage data", (): void => {
    const settingsStorageData: ISettingsStorageData = {
      isSoundEnabled: true,
      isSubtitlesEnabled: false,
      textTransform: TextTransform.UPPERCASE,
      pairingMode: {
        first: CardContent.WORD,
        second: CardContent.ILLUSTRATION,
      },
      numberOfCards: CardCount.EIGHT,
      numberOfPlayers: PlayerCount.TWO_PLAYERS,
      playMode: PlayMode.FLIP_CARDS,
    };
    store.dispatch(new LoadSettingsFromLocalStorage(settingsStorageData));

    const storageData: ISettingsStorageData = store.selectSnapshot(SettingsStateQueries.settingsStorageData$);
    expect(storageData).toEqual(settingsStorageData);
  });
});

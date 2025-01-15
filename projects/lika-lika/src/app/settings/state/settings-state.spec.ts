import {TestBed} from "@angular/core/testing";
import {NgxsModule, Store} from "@ngxs/store";
import {SettingsState} from "./settings-state";
import {
  LoadSettingsFromLocalStorage,
  UpdateIsSettingsLocked,
  UpdateNumberOfCards,
  UpdateNumberOfPlayers,
  UpdatePairingMode,
  UpdatePlayMode,
  UpdateTextTransform,
} from "./settings-state-actions";
import {TextTransform} from "../api/text-transform";
import {IPairingMode} from "@games/pairing-mode";
import {CardContent} from "@games/card-content";
import {CardCount} from "@games/card-count";
import {PlayerCount} from "../../../../../games/src/lib/api/player-count";
import {PlayMode} from "@games/play-mode";
import {ISettingsStorageData} from "../api/settings-storage-data";
import {AudioState, SubtitleState} from "@media/*";

describe("SettingsState", (): void => {
  let store: Store;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([SettingsState, AudioState, SubtitleState])],
    });

    store = TestBed.inject(Store);
  });

  it("should update text transform setting", (): void => {
    store.dispatch(new UpdateTextTransform(TextTransform.UPPERCASE));
    const textTransform: TextTransform = store.selectSnapshot((state) => state.settingsState.textTransform);
    expect(textTransform).toBe(TextTransform.UPPERCASE);
  });

  it("should update pairing mode setting", (): void => {
    const pairingMode: IPairingMode = {
      first: CardContent.WORD,
      second: CardContent.ILLUSTRATION,
    };
    store.dispatch(new UpdatePairingMode(pairingMode));
    const updatedPairingMode: IPairingMode = store.selectSnapshot((state) => state.settingsState.pairingMode);
    expect(updatedPairingMode).toEqual(pairingMode);
  });

  it("should update the number of cards setting", (): void => {
    store.dispatch(new UpdateNumberOfCards(CardCount.SIXTEEN));
    const numberOfCards: CardCount = store.selectSnapshot((state) => state.settingsState.numberOfCards);
    expect(numberOfCards).toBe(CardCount.SIXTEEN);
  });

  it("should update the number of players setting", (): void => {
    store.dispatch(new UpdateNumberOfPlayers(PlayerCount.TWO_PLAYERS));
    const numberOfPlayers: PlayerCount = store.selectSnapshot((state) => state.settingsState.numberOfPlayers);
    expect(numberOfPlayers).toBe(PlayerCount.TWO_PLAYERS);
  });

  it("should update play mode setting", (): void => {
    store.dispatch(new UpdatePlayMode(PlayMode.OPEN_CARDS));
    const playMode: PlayMode = store.selectSnapshot((state) => state.settingsState.playMode);
    expect(playMode).toBe(PlayMode.OPEN_CARDS);
  });

  it("should lock or unlock settings", (): void => {
    store.dispatch(new UpdateIsSettingsLocked(true));
    const isSettingsLocked: boolean = store.selectSnapshot((state) => state.settingsState.isSettingsLocked);
    expect(isSettingsLocked).toBe(true);
  });

  it("should load settings from local storage", (): void => {
    const mockStorageData: ISettingsStorageData = {
      isSoundEnabled: false,
      isSubtitlesEnabled: true,
      textTransform: TextTransform.UPPERCASE,
      pairingMode: {
        first: CardContent.WORD,
        second: CardContent.ILLUSTRATION,
      },
      numberOfCards: CardCount.TWELVE,
      numberOfPlayers: PlayerCount.TWO_PLAYERS,
      playMode: PlayMode.OPEN_CARDS,
    };
    store.dispatch(new LoadSettingsFromLocalStorage(mockStorageData));
    const settings: ISettingsStorageData = store.selectSnapshot((state) => state.settingsState);
    const isSoundEnabled: boolean = store.selectSnapshot((state) => state.audioState.isSoundEnabled);
    const isSubtitlesEnabled: boolean = store.selectSnapshot((state) => state.subtitleState.isSubtitleEnabled);

    expect(isSoundEnabled).toBe(mockStorageData.isSoundEnabled);
    expect(isSubtitlesEnabled).toBe(mockStorageData.isSubtitlesEnabled);
    expect(settings.textTransform).toBe(mockStorageData.textTransform);
    expect(settings.pairingMode).toEqual(mockStorageData.pairingMode);
    expect(settings.numberOfCards).toBe(mockStorageData.numberOfCards);
    expect(settings.numberOfPlayers).toBe(mockStorageData.numberOfPlayers);
    expect(settings.playMode).toBe(mockStorageData.playMode);
  });
});

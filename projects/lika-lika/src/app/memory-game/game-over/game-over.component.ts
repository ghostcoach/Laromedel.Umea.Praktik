import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {SettingsStateQueries} from "../../settings/state/settings-state-queries";
import {IImage} from "@media/image";
import {GameStateQueries} from "@games/game-state-queries";
import {Player} from "@games/src/lib/api/player";
import {ConfettiCanonComponent} from "@ui-components/confetti-canon.component";

@UntilDestroy()
@Component({
  selector: "app-game-over",
  standalone: true,
  imports: [ConfettiCanonComponent],
  templateUrl: "./game-over.component.html",
  styleUrl: "./game-over.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOverComponent {
  private store: Store = inject(Store);
  public winner$: Observable<string> = this.store.select(GameStateQueries.winner$);

  public get gameOverImage(): IImage {
    const winner: string = this.store.selectSnapshot(GameStateQueries.winner$);
    const isSinglePlayerGame: boolean = this.store.selectSnapshot(SettingsStateQueries.isOnePlayer$);
    const gameOverImageFolder: string = "/assets/layout/game-over";

    if (isSinglePlayerGame) {
      return {
        src: `${gameOverImageFolder}/game-over-single.svg`,
        alt: "En gul stjärna med en svart skugga ovanför texten 'GRATTIS!' i vit färg och texten 'Du är Lika=Lika mästare' under",
      };
    }

    switch (winner) {
      case Player.PLAYER1:
        return {
          src: `${gameOverImageFolder}/player-one-wins.svg`,
          alt: "En orange stjärna med en svart skugga ovanför texten 'GRATTIS!' i vit färg och texten 'Du är Lika=Lika mästare' under",
        };
      case Player.PLAYER2:
        return {
          src: `${gameOverImageFolder}/player-two-wins.svg`,
          alt: "En lila stjärna med en svart skugga ovanför texten 'GRATTIS!' i vit färg och texten 'Du är Lika=Lika mästare' under",
        };
      default:
        return {
          src: `${gameOverImageFolder}/game-over-draw.svg`,
          alt: "En orange och lila stjärna ovanför texten 'OAVGJORT!' i vit färg och texten 'Det blev lika mellan er' under",
        };
    }
  }
}

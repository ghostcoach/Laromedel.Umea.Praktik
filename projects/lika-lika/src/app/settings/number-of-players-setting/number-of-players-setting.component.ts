import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {SettingsStateQueries} from "../state/settings-state-queries";
import {PlayerCount} from "../../../../../games/src/lib/api/player-count";
import {UpdateNumberOfPlayers} from "../state/settings-state-actions";
import {AsyncPipe} from "@angular/common";

@UntilDestroy()
@Component({
  selector: "app-number-of-players-setting",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./number-of-players-setting.component.html",
  styleUrl: "./number-of-players-setting.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumberOfPlayersSettingComponent {
  public isOnePlayer$: Observable<boolean> = this.store.select(SettingsStateQueries.isOnePlayer$);
  public isTwoPlayers$: Observable<boolean> = this.store.select(SettingsStateQueries.isTwoPlayers$);

  constructor(private store: Store) {}

  public handleOnePlayerSelectionChange($event: MouseEvent | TouchEvent): void {
    $event.stopPropagation();
    this.store.dispatch(new UpdateNumberOfPlayers(PlayerCount.ONE_PLAYER));
  }

  public handleTwoPlayersSelectionChange($event: MouseEvent | TouchEvent): void {
    $event.stopPropagation();
    this.store.dispatch(new UpdateNumberOfPlayers(PlayerCount.TWO_PLAYERS));
  }
}

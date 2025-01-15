import {ChangeDetectionStrategy, Component, inject} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {SettingsStateQueries} from "../state/settings-state-queries";
import {AsyncPipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {LockedDialogComponent} from "./locked-dialog/locked-dialog.component";
import {UpdateIsSettingsLocked} from "../state/settings-state-actions";

@UntilDestroy()
@Component({
  selector: "app-lock-button",
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: "./lock-button.component.html",
  styleUrl: "./lock-button.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockButtonComponent {
  private store: Store = inject(Store);
  public isSettingsLocked$: Observable<boolean> = this.store.select(SettingsStateQueries.isSettingsLocked$);
  public readonly lockedDialog: MatDialog = inject(MatDialog);

  public handleLocking(): void {
    const currentIsSettingsLocked: boolean = this.store.selectSnapshot(SettingsStateQueries.isSettingsLocked$);

    if (currentIsSettingsLocked) {
      this.openLockedDialog();
    }

    this.store.dispatch(new UpdateIsSettingsLocked(true));
  }

  public openLockedDialog(): void {
    this.lockedDialog.open(LockedDialogComponent, {
      height: "auto",
      width: "600px",
    });
  }
}

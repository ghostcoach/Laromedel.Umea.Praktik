import {Component, inject, OnInit} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {Store} from "@ngxs/store";
import {UpdateIsSettingsLocked} from "../../state/settings-state-actions";

@UntilDestroy()
@Component({
  selector: "app-locked-dialog",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    NgIf,
  ],
  templateUrl: "./locked-dialog.component.html",
  styleUrl: "./locked-dialog.component.scss",
})
export class LockedDialogComponent implements OnInit {
  public readonly dialogRef: MatDialogRef<LockedDialogComponent> = inject(MatDialogRef<LockedDialogComponent>);

  public submittedAnswer: number | null;
  public number1: number;
  public number2: number;
  public correctAnswer: number;
  public isAnswerCorrect: boolean;
  public isAnswered: boolean = false;
  private store: Store = inject(Store);

  public ngOnInit(): void {
    this.initNumbers();
  }

  public handleAnswerSubmit(): void {
    this.isAnswered = true;
    this.isAnswerCorrect = this.submittedAnswer === this.correctAnswer;

    if (this.isAnswerCorrect) {
      this.store.dispatch(new UpdateIsSettingsLocked(false));
      this.dialogRef.close();
    }
  }

  private initNumbers(): void {
    this.number1 = 9;
    this.number2 = Math.floor(Math.random() * 10) + 3;
    this.correctAnswer = this.number1 * this.number2;
  }
}

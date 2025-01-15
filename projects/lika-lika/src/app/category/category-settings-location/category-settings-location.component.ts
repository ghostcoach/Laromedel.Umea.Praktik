import {ChangeDetectionStrategy, Component} from '@angular/core';
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  standalone: true,
  imports: [],
  templateUrl: './category-settings-location.component.html',
  styleUrl: './category-settings-location.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategorySettingsLocationComponent {

}

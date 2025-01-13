import {ChangeDetectionStrategy, Component} from "@angular/core";
import {UntilDestroy} from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  imports: [],
  templateUrl: "./home-location.component.html",
  styleUrl: "./home-location.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLocationComponent {
  //In tsconfig paths to libraries are defined. To use them in the code, the following import statement is for example used:
  //import {MemoryCard} from "@games/memory-card";
  //Components that are routes should have to post-fix "Location" in their name and should not have a selector defined (e.g. "app-home-location")
  //If you do a change in a library, remember to re-build the library before you can see the changes in the project that uses the library.
  //To run the project, use the command "ng serve lar-dig-tecken" in the terminal.
}

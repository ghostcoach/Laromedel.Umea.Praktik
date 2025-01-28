import {inject, Injectable} from "@angular/core";
import {debounceTime, filter, fromEvent, Observable, of, switchMap, take} from "rxjs";
import {Event, NavigationStart, Router} from "@angular/router";
import {Store} from "@ngxs/store";
import {ApplicationStateQueries} from "../state/application-state-queries";
import {
  IndicateRoutingEvent,
  IndicateUserInteraction,
  UpdateIsWebMSupported,
  UpdateIsWebPSupported,
  UpdateWindowDimensions,
} from "../state/application-state-actions";
import {UntilDestroy, untilDestroyed} from "@ngneat/until-destroy";

@Injectable({
  providedIn: "root",
})
@UntilDestroy()
export class ApplicationService {
  private hasRoutingEventHappened$: Observable<boolean> = inject(Store).select(ApplicationStateQueries.hasRoutingEventHappened$);

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  public initApplicationStateSubscriptions(): void {
    this.registerRoutingEvents();
    this.registerUserInteractionEvents();
  }

  public checkMediaSupport(): void {
    this.isWebPSupported().then((isSupported: boolean): void => {
      this.store.dispatch(new UpdateIsWebPSupported(isSupported));
    });

    this.store.dispatch(new UpdateIsWebMSupported(this.isWebMSupported()));
  }

  private registerRoutingEvents(): void {
    this.hasRoutingEventHappened$
      .pipe(
        switchMap((hasHappened: boolean): Observable<Event> | Observable<void> => {
          if (hasHappened) return of();

          return this.router.events.pipe(
            filter((event: Event): boolean => event instanceof NavigationStart),
            take(1),
          );
        }),
      )
      .subscribe((result: Event | void): void => {
        if (!result) return;

        console.debug(
          "%c 🚀 Routing event detected!",
          "color: white; background-color: blue; font-size: 16px; padding: 4px 8px; border-radius: 4px;",
        );

        this.store.dispatch(new IndicateRoutingEvent());
      });
  }

  private registerUserInteractionEvents(): void {
    const click$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, "click");
    const touch$: Observable<TouchEvent> = fromEvent<TouchEvent>(document, "touchstart");

    click$.subscribe(() => this.handleUserInteraction("click"));
    touch$.subscribe(() => this.handleUserInteraction("touch"));
  }

  private handleUserInteraction(eventType: "click" | "touch"): void {
    console.debug(
      `%c 🖱️ User ${eventType} detected!`,
      "color: white; background-color: green; font-size: 16px; padding: 4px 8px; border-radius: 4px;",
    );
    this.store.dispatch(new IndicateUserInteraction());
  }

  private async isWebPSupported(): Promise<boolean> {
    if (!self.createImageBitmap) return Promise.resolve(false);

    // Base64 representation of a white point image
    const webpData: string = "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=";

    try {
      const response: Response = await fetch(webpData);
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const blob: Blob = await response.blob();
      return await createImageBitmap(blob).then(
        (): boolean => true,
        (): boolean => false,
      );
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  private isWebMSupported(): boolean {
    const video: HTMLVideoElement = document.createElement("video");
    const webMTypeString: string = "video/webm";
    const isSupported: CanPlayTypeResult = video.canPlayType(webMTypeString);

    return isSupported === "probably" || isSupported === "maybe";
  }

  public subscribeToWindowResize(): void {
    fromEvent(window, "resize")
      .pipe(debounceTime(200), untilDestroyed(this))
      .subscribe((): void => {
        this.store.dispatch(new UpdateWindowDimensions(window.innerWidth, window.innerHeight));
      });
  }
}

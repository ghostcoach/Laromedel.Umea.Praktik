import {Injectable} from "@angular/core";
import {LocalStorageService} from "ngx-localstorage";
import {compareVersions} from "compare-versions";

@Injectable({
  providedIn: "root",
})
export class AppVersionService {
  constructor(private localStorageService: LocalStorageService) {}

  public checkVersion(newVersion: string, storageKey: string): void {
    const storedVersion: string | null = this.localStorageService.get(storageKey) as string | null;

    if (!storedVersion || compareVersions(newVersion, storedVersion) > 0) {
      this.localStorageService.set(storageKey, newVersion);
      this.hardReload();
    }
  }

  private hardReload(): void {
    setTimeout((): void => {
      window.location.reload();
    }, 100);
  }
}

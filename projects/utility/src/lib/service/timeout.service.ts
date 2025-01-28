import {Injectable} from "@angular/core";

interface TimeoutHandle {
  [key: string]: ReturnType<typeof setTimeout> | undefined;
}

@Injectable({providedIn: "root"})
export class TimeoutService {
  private timeouts: TimeoutHandle = {};

  public setTimeout(callback: () => void, delay: number, key?: string): void {
    if (key) {
      this.clearTimeout(key);
    }
    const handle: ReturnType<typeof setTimeout> = setTimeout(callback, delay);
    if (key) {
      this.timeouts[key] = handle;
    }
  }

  public clearTimeout(key: string): void {
    if (this.timeouts[key]) {
      clearTimeout(this.timeouts[key]!);
      delete this.timeouts[key];
    }
  }

  public clearAllTimeouts(): void {
    Object.keys(this.timeouts).forEach((key) => this.clearTimeout(key));
  }
}

import {TestBed} from "@angular/core/testing";
import {AudioService} from "./audio.service";
import {Howl} from "howler";
import {NgxsModule} from "@ngxs/store";
import {AudioState} from "./state/audio-state";

describe("AudioService", (): void => {
  let service: AudioService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([AudioState])],
    });
    service = TestBed.inject(AudioService);
  });

  it("should be created", (): void => {
    expect(service).toBeTruthy();
  });

  it("should load a sound", (): void => {
    service.loadSound("testSound", "assets/sounds/test.mp3");
    expect(service["sounds"]["testSound"]).toBeDefined();
  });

  it("should debug warn if sound with same key is loaded twice", (): void => {
    spyOn(console, "debug");
    service.loadSound("testSound", "assets/sounds/test.mp3");
    service.loadSound("testSound", "assets/sounds/test.mp3");
    expect(console.debug).toHaveBeenCalledWith("Sound with key testSound already loaded.");
  });

  it("should play a sound", (): void => {
    const playSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy();
    service["sounds"]["testSound"] = new Howl({
      src: ["assets/sounds/test.mp3"],
    });
    spyOn(service["sounds"]["testSound"], "play").and.callFake(playSpy);

    service.playSound("testSound", true);
    expect(playSpy).toHaveBeenCalled();
  });

  it("should log an error if trying to play a non-loaded sound", (): void => {
    spyOn(console, "error");
    service.playSound("nonExistentSound", true);
    expect(console.error).toHaveBeenCalledWith("Sound with key nonExistentSound not found.");
  });

  it("should pause a sound", (): void => {
    const pauseSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy();
    service["sounds"]["testSound"] = new Howl({
      src: ["assets/sounds/test.mp3"],
    });
    spyOn(service["sounds"]["testSound"], "pause").and.callFake(pauseSpy);

    service.pauseSound("testSound");
    expect(pauseSpy).toHaveBeenCalled();
  });

  it("should log an error if trying to pause a non-loaded sound", (): void => {
    spyOn(console, "error");
    service.pauseSound("nonExistentSound");
    expect(console.error).toHaveBeenCalledWith("Sound with key nonExistentSound not found.");
  });

  it("should stop a sound", (): void => {
    const stopSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy();
    service["sounds"]["testSound"] = new Howl({
      src: ["assets/sounds/test.mp3"],
    });
    spyOn(service["sounds"]["testSound"], "stop").and.callFake(stopSpy);

    service.stopSound("testSound");
    expect(stopSpy).toHaveBeenCalled();
  });

  it("should log an error if trying to stop a non-loaded sound", (): void => {
    spyOn(console, "error");
    service.stopSound("nonExistentSound");
    expect(console.error).toHaveBeenCalledWith("Sound with key nonExistentSound not found.");
  });

  it("should unload a sound", (): void => {
    const unloadSpy: jasmine.Spy<jasmine.Func> = jasmine.createSpy();
    service["sounds"]["testSound"] = new Howl({
      src: ["assets/sounds/test.mp3"],
    });
    spyOn(service["sounds"]["testSound"], "unload").and.callFake(unloadSpy);

    service.unloadSound("testSound");
    expect(unloadSpy).toHaveBeenCalled();
    expect(service["sounds"]["testSound"]).toBeUndefined();
  });

  it("should log an error if trying to unload a non-loaded sound", (): void => {
    spyOn(console, "error");
    service.unloadSound("nonExistentSound");
    expect(console.error).toHaveBeenCalledWith("Sound with key nonExistentSound not found.");
  });

  it("should set the global volume", (): void => {
    spyOn(Howler, "volume");
    service.setVolume(0.5);
    expect(Howler.volume).toHaveBeenCalledWith(0.5);
  });

  it("should mute all sounds", (): void => {
    spyOn(Howler, "mute");
    service.mute(true);
    expect(Howler.mute).toHaveBeenCalledWith(true);
  });

  it("should unmute all sounds", (): void => {
    spyOn(Howler, "mute");
    service.mute(false);
    expect(Howler.mute).toHaveBeenCalledWith(false);
  });
});

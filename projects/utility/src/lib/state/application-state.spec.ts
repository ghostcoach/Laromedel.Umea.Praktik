import {NgxsModule, Store} from "@ngxs/store";
import {TestBed} from "@angular/core/testing";
import {ApplicationState} from "./application-state";
import {UpdateIsWebMSupported, UpdateIsWebPSupported} from "./application-state-actions";
import {ApplicationStateQueries} from "./application-state-queries";

describe("ApplicationState", (): void => {
  let store: Store;

  beforeEach((): void => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([ApplicationState])],
    });

    store = TestBed.inject(Store);
  });

  it("should set isWebMSupported to false", (): void => {
    store.dispatch(new UpdateIsWebMSupported(false));
    const isWebMSupported: boolean = store.selectSnapshot(ApplicationStateQueries.isWebmSupported$);
    expect(isWebMSupported).toBeFalse();
  });

  it("should set isWebPSupported to false", (): void => {
    store.dispatch(new UpdateIsWebPSupported(false));
    const isWebPSupported: boolean = store.selectSnapshot(ApplicationStateQueries.isWebpSupported$);
    expect(isWebPSupported).toBeFalse();
  });

  it("should return the correct default state values", (): void => {
    const isWebMSupported: boolean = store.selectSnapshot(ApplicationStateQueries.isWebmSupported$);
    const isWebPSupported: boolean = store.selectSnapshot(ApplicationStateQueries.isWebpSupported$);
    expect(isWebMSupported).toBeTrue();
    expect(isWebPSupported).toBeTrue();
  });
});

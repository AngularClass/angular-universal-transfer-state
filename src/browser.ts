import { NgModule, APP_INITIALIZER } from '@angular/core';
import { TransferState } from './transfer-state';

export function getTransferState(): TransferState {
  const win: any = window;
  const transferState = new TransferState();
  transferState.initialize(win[TransferState.KEY] || {});
  return transferState;
}

export function noop() {

}

export function getTransferInitializer (transferState: TransferState): any {
  return noop;
}

@NgModule({
  providers: [
    {
      provide: TransferState,
      useFactory: getTransferState
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: getTransferInitializer,
      deps: [ TransferState ]
    }
  ]
})
export class BrowserTransferStateModule {

}

export { TransferState, TransferHttp, TransferHttpModule } from './transfer-state';

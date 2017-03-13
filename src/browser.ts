import { NgModule, APP_INITIALIZER } from '@angular/core';
import { TransferState } from './transfer-state';

export function __getTransferState(): TransferState {
  const win: any = window;
  const transferState = new TransferState();
  transferState.initialize(win[TransferState.KEY] || {});
  return transferState;
}

export function __initialize (transferState: TransferState): void {
  return () => {};
}

@NgModule({
  providers: [
    {
      provide: TransferState,
      useFactory: __getTransferState
    },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: __initialize,
      deps: [TransferState]
    }
  ]
})
export class BrowserTransferStateModule {

}

export { TransferState, TransferHttp, TransferHttpModule } from './transfer-state';

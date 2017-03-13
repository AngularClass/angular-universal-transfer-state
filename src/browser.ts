import { NgModule } from '@angular/core';
import { TransferState } from './transfer-state';

export function getTransferState(): TransferState {
  const win: any = window;
  const transferState = new TransferState();
  transferState.initialize(win[TransferState.KEY] || {});
  return transferState;
}

@NgModule({
  providers: [
    {
      provide: TransferState,
      useFactory: getTransferState
    }
  ]
})
export class BrowserTransferStateModule {

}

export { TransferState } from './transfer-state';

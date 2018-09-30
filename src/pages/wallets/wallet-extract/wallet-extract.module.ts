import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletExtractPage } from './wallet-extract';

@NgModule({
  declarations: [
    WalletExtractPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletExtractPage),
  ],
})
export class WalletExtractPageModule {}

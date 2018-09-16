import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletProfilePage } from './wallet-profile';

@NgModule({
  declarations: [
    WalletProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(WalletProfilePage),
  ],
})
export class WalletProfilePageModule {}

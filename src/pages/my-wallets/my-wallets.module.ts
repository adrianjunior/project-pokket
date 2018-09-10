import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyWalletsPage } from './my-wallets';

@NgModule({
  declarations: [
    MyWalletsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyWalletsPage),
  ],
})
export class MyWalletsPageModule {}

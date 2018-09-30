import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditWalletPage } from './edit-wallet';

@NgModule({
  declarations: [
    EditWalletPage,
  ],
  imports: [
    IonicPageModule.forChild(EditWalletPage),
  ],
})
export class EditWalletPageModule {}

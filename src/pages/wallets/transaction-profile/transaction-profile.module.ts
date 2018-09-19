import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionProfilePage } from './transaction-profile';

@NgModule({
  declarations: [
    TransactionProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionProfilePage),
  ],
})
export class TransactionProfilePageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddTransactionPopoverPage } from './add-transaction-popover';

@NgModule({
  declarations: [
    AddTransactionPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(AddTransactionPopoverPage),
  ],
})
export class AddTransactionPopoverPageModule {}

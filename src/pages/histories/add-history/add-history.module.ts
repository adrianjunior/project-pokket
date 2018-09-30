import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddHistoryPage } from './add-history';

@NgModule({
  declarations: [
    AddHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddHistoryPage),
  ],
})
export class AddHistoryPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HistoryResultsPage } from './history-results';

@NgModule({
  declarations: [
    HistoryResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(HistoryResultsPage),
  ],
})
export class HistoryResultsPageModule {}

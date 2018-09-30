import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiagnosticItemsPage } from './diagnostic-items';

@NgModule({
  declarations: [
    DiagnosticItemsPage,
  ],
  imports: [
    IonicPageModule.forChild(DiagnosticItemsPage),
  ],
})
export class DiagnosticItemsPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiagnosticResultsPage } from './diagnostic-results';

@NgModule({
  declarations: [
    DiagnosticResultsPage,
  ],
  imports: [
    IonicPageModule.forChild(DiagnosticResultsPage),
  ],
})
export class DiagnosticResultsPageModule {}

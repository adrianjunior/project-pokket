import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiagnosticItemProfilePage } from './diagnostic-item-profile';

@NgModule({
  declarations: [
    DiagnosticItemProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(DiagnosticItemProfilePage),
  ],
})
export class DiagnosticItemProfilePageModule {}

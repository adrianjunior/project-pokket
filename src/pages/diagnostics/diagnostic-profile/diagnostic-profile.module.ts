import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiagnosticProfilePage } from './diagnostic-profile';

@NgModule({
  declarations: [
    DiagnosticProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(DiagnosticProfilePage),
  ],
})
export class DiagnosticProfilePageModule {}

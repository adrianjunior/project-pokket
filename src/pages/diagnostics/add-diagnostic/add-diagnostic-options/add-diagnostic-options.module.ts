import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDiagnosticOptionsPage } from './add-diagnostic-options';

@NgModule({
  declarations: [
    AddDiagnosticOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDiagnosticOptionsPage),
  ],
})
export class AddDiagnosticOptionsPageModule {}

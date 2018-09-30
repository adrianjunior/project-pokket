import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDiagnosticPage } from './add-diagnostic';

@NgModule({
  declarations: [
    AddDiagnosticPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDiagnosticPage),
  ],
})
export class AddDiagnosticPageModule {}

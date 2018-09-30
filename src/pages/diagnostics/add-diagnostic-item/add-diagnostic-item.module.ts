import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddDiagnosticItemPage } from './add-diagnostic-item';

@NgModule({
  declarations: [
    AddDiagnosticItemPage,
  ],
  imports: [
    IonicPageModule.forChild(AddDiagnosticItemPage),
  ],
})
export class AddDiagnosticItemPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDiagnosticPage } from './edit-diagnostic';

@NgModule({
  declarations: [
    EditDiagnosticPage,
  ],
  imports: [
    IonicPageModule.forChild(EditDiagnosticPage),
  ],
})
export class EditDiagnosticPageModule {}

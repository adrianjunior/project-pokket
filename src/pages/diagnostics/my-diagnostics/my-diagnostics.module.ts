import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyDiagnosticsPage } from './my-diagnostics';

@NgModule({
  declarations: [
    MyDiagnosticsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyDiagnosticsPage),
  ],
})
export class MyDiagnosticsPageModule {}

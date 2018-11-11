import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordEditPage } from './password-edit';

@NgModule({
  declarations: [
    PasswordEditPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordEditPage),
  ],
})
export class PasswordEditPageModule {}

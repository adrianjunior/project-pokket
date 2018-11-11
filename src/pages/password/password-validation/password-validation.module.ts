import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordValidationPage } from './password-validation';

@NgModule({
  declarations: [
    PasswordValidationPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordValidationPage),
  ],
})
export class PasswordValidationPageModule {}

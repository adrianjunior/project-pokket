import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PasswordConfigPage } from './password-config';

@NgModule({
  declarations: [
    PasswordConfigPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordConfigPage),
  ],
})
export class PasswordConfigPageModule {}

import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyHistoriesPage } from './my-histories';

@NgModule({
  declarations: [
    MyHistoriesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyHistoriesPage),
  ],
})
export class MyHistoriesPageModule {}

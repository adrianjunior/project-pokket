import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import moment from 'moment';

import { Diagnostic } from '../../../models/diagnostic.interface';
import { Item } from '../../../models/item.inferface';
import colors from '../../../assets/data/colors';

@IonicPage()
@Component({
  selector: 'page-history-results',
  templateUrl: 'history-results.html',
})
export class HistoryResultsPage {
  @ViewChild('chart') chart;
  chartEl: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistoryResultsPage');
  }

}

import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import moment from 'moment';

import { Diagnostic } from '../../../models/diagnostic.interface';
import { Item } from '../../../models/item.inferface';
import colors from '../../../assets/data/colors';
import { History } from '../../../models/history.interface';

@IonicPage()
@Component({
  selector: 'page-history-results',
  templateUrl: 'history-results.html',
})
export class HistoryResultsPage implements OnInit {
  @ViewChild('chart') chart;
  chartEl: any;
  chartData: number[] = [];
  chartLabels: string[] = [];
  chartType: string = 'line';

  historyId: number;
  history: History;
  diagnostics: Diagnostic[];
  diagnosticsIds: number[]

  section: number = 0;

  constructor(public navCtrl: NavController, private storage: Storage,
    private navParams: NavParams, public appCtrl: App, public toastCtrl: ToastController,
    public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.history = {
      id: 0,
      name: '',
      date: '',
      diagnosticsIds: []
    }
    this.diagnostics = [];
    this.diagnosticsIds = [];
    this.historyId = this.navParams.get('id');
    this.getHistory(this.historyId);
  }

  onSelectSection(){ 
    
  }

  presentToast(message: string, position: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.present();
  }

  // DATABASE FUNCTIONS

  getHistory(historyId: number) {
    this.storage.get(`History ${historyId}`)
      .then(val => {
        if (val != null) {
          val.date = moment(val.date).locale('pt-br').format('L');
        }
        this.history = val;
      })
      /*.then(() => {
        this.getDiagnosticsItems();
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar seu Resultado. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })*/
  }

  /*getDiagnosticsItems(history: History) {
    history.diagnosticsIds.forEach(diagnosticId => {
      
    })
    this.storage.get(`Diagnostic ${diagnosticId} Items`)
      .then(val => {
        if (val != null) {
          this.itemsIds = val
          if (this.itemsIds.length <= 0) {
            this.hasData = false;
          }
        } else {
          this.hasData = false;
        }
        this.itemsIds.forEach(id => {
          this.getDiagnosticItem(diagnosticId, id, isTypeData, type)
        })
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar seu Resultado. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  getDiagnosticItem(diagnosticId: number, itemId: number, isTypeData: boolean, type: number) {
    this.hasData = true;
    this.storage.get(`Diagnostic ${diagnosticId} Item ${itemId}`)
      .then(val => {
        if (val != null) {
          this.items.push(val);
        }
        console.log(`ITEMS ${this.items.length} X ${this.itemsIds.length} IDS`)
        if (this.items.length >= this.itemsIds.length) {

          if (isTypeData) {
            this.getTypeData(this.items, type)
          } else {
            this.getItemData(this.items, type)
          }
        }
      })
  }*/
}

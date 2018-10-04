import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { History } from '../../../models/history.interface';

@IonicPage()
@Component({
  selector: 'page-my-histories',
  templateUrl: 'my-histories.html',
})
export class MyHistoriesPage {

  addHistoryPage: string = `AddHistoryPage`;
  historyProfilePage: string = `HistoryProfilePage`;
  historyResultsPage: string = `HistoryResultsPage`;

  historiesIds: number[];
  histories: History[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private toastCtrl: ToastController) {
  }

  ionViewWillEnter(){
    this.getHistoriesIds();
  }

  ngOnInit() {
    this.historiesIds = [];
    this.histories = [];
  }

  goToHistory(history: History) {
    this.navCtrl.push(this.historyResultsPage, {
      historyId: history.id
    });
  }

  goToAddHistory() {
    this.navCtrl.push(this.addHistoryPage);
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

  // Recebe as IDs dos históricos
  getHistoriesIds() {
    this.storage.get('HistoriesIds')
                .then(val => {
                  this.histories = [];
                  if (val != null) {
                    this.historiesIds = val;
                  }
                  this.historiesIds.forEach(id => {
                    // Recebe uma carteira
                    this.getHistory(id);
                  })
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar seus Históricos. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  // Recebe um históricos
  getHistory(id: number) {
    this.storage.get(`History ${id}`)
                .then(val => {
                  if(val != null) {
                    val.date = moment(val.date).locale('pt-br').format('L');
                  }
                  this.histories.push(val);
                  console.log(this.histories);
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar seus Históricos. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }


}

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Item } from '../../../models/item.inferface';
import { Diagnostic } from '../../../models/diagnostic.interface';

@IonicPage()
@Component({
  selector: 'page-diagnostic-items',
  templateUrl: 'diagnostic-items.html',
})
export class DiagnosticItemsPage {

  diagnosticId: number;
  diagnostic: Diagnostic = {
    id: 0,
    name: '',
    date: '',
    isConcluded: false
  };
  itemsIds: number[] = [];
  items: Item[] = [];

  diagnosticItemProfilePage: string = `DiagnosticItemProfilePage`;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, private storage: Storage,
    private toastCtrl: ToastController) {
  }

  ionViewWillEnter() {
    this.items = [];
    this.itemsIds = [];
    this.diagnosticId = this.navParams.get('id');
    this.getDiagnostic(this.diagnosticId);
    this.getDiagnosticItems(this.diagnosticId);
  }

  goToItemProfile(itemId: number, diagnosticId: number = this.diagnosticId) {
    this.navCtrl.push(this.diagnosticItemProfilePage, {
      itemId: itemId,
      diagnosticId: diagnosticId
    });
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

  // Recebe o diagnostico atual
  getDiagnostic(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId}`)
                .then(val => {
                  this.diagnostic = val;
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar suas Receitas e Despesas. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  // Recebe os itens do diagnostico atual
  getDiagnosticItems(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Items`)
                .then(val => {
                  if(val != null) {
                    this.itemsIds = val;
                  }
                  this.itemsIds.forEach(id => {
                    // Recebe uma carteira
                    this.getItem(id, diagnosticId);
                  })
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar suas Receitas e Despesas. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  getItem(itemId: number, diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Item ${itemId}`)
                .then(val => {
                  console.log(val)
                  this.items.push(val)
                })
  }
}

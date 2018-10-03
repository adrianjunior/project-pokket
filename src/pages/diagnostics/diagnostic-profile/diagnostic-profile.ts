import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Item } from '../../../models/item.inferface';
import { Diagnostic } from '../../../models/diagnostic.interface';

@IonicPage()
@Component({
  selector: 'page-diagnostic-profile',
  templateUrl: 'diagnostic-profile.html',
})
export class DiagnosticProfilePage {

  diagnosticId: number;
  diagnostic: Diagnostic = {
    id: 0,
    name: '',
    date: '',
    isConcluded: false
  };
  itemsIds: number[] = [];
  items: Item[] = [];

  addDiagnosticItemPage: string = `AddDiagnosticItemPage`
  diagnosticItemProfilePage: string = `DiagnosticItemProfilePage`
  diagnosticsItemsPage: string = `DiagnosticItemsPage`
  editDiagnosticPage: string = `EditDiagnosticPage`
  diagnosticResultsPage: string = `DiagnosticResultsPage`

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

  goToAddItem(isIncome: boolean) {
    this.navCtrl.push(this.addDiagnosticItemPage, {
      isIncome: isIncome,
      id: this.diagnosticId
    });
  }

  goToDiagnosticItemsList() {
    this.navCtrl.push(this.diagnosticsItemsPage, {
      id: this.diagnosticId
    })
  }

  goToEditDiagnostic() {
    this.navCtrl.push(this.editDiagnosticPage, {
      id: this.diagnosticId
    })
  }

  concludeDiagnostic() {
    this.navCtrl.push(this.diagnosticResultsPage, {
      diagnosticId: this.diagnosticId
    })
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
  getDiagnostic(id: number) {
    this.storage.get(`Diagnostic ${id}`)
                .then(val => {
                  this.diagnostic = val;
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar seu Diagnóstico. Por favor, reinicie o app.', 'bottom', 3000);
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
                    // Recebe um item
                    this.getItem(id, diagnosticId);
                  })
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar seu Diagnostico. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  getItem(id: number, diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Item ${id}`)
                .then(val => {
                  console.log(val)
                  if(val != null) {
                    this.items.push(val)
                  }
                })
  }

}

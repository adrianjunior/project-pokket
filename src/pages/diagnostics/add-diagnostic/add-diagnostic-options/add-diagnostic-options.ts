import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Transaction } from '../../../../models/transaction.interface';
import { Diagnostic } from '../../../../models/diagnostic.interface';


@IonicPage()
@Component({
  selector: 'page-add-diagnostic-options',
  templateUrl: 'add-diagnostic-options.html',
})
export class AddDiagnosticOptionsPage {

  diagnosticId: number;
  diagnostic: Diagnostic;
  transactionsIds: number[] = [];
  transactions: Transaction[] = [];

  addDiagnosticItemPage: string = `AddDiagnosticItemPage`
  diagnosticItemProfilePage: string = `DiagnosticItemProfilePage`

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, private storage: Storage,
    private toastCtrl: ToastController) {
  }

  ionViewWillEnter() {
    this.transactions = [];
    this.transactionsIds = [];
    this.diagnostic = {
      id: 0,
      name: '',
      date: ''
    }
    this.diagnosticId = this.navParams.get('id');
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

  presentToast(message: string, position: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.present();
  }

}

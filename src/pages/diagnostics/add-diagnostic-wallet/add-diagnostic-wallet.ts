import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../models/wallet.interface';
import { Transaction } from '../../../models/transaction.interface';
import { Diagnostic } from '../../../models/diagnostic.interface';
import { Item } from '../../../models/item.inferface';

@IonicPage()
@Component({
  selector: 'page-add-diagnostic-wallet',
  templateUrl: 'add-diagnostic-wallet.html',
})
export class AddDiagnosticWalletPage {

  selectedWallets: boolean[];
  selected: number;
  walletsIds: number[];
  wallets: Wallet[];
  transactionsIds: number[];
  itemNextId: number;
  diagnosticId: number;
  itemsIds: number[];
  newIdList: number[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, public formBuilder: FormBuilder,
    private toastCtrl: ToastController) { }

  ngOnInit() {
    this.itemNextId = 0;
    this.walletsIds = [];
    this.wallets = [];
    this.selectedWallets = [];
    this.newIdList = [];
    this.selected = 0;
    this.diagnosticId = this.navParams.get('id');
    this.getWalletsIds();
    this.getItemsIds(this.diagnosticId);
    this.getNextItemId(this.diagnosticId);
  }

  updateSelected() {
    this.selected = 0;
    this.selectedWallets.forEach(d => {
      if(d) {
        this.selected += 1;
      }
    });
  }

  addWalletsToDiagnostic() {
    for(let i = 0; i < this.selected; i++) {
      this.newIdList.push(this.itemNextId + i);
    }
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

  getWalletsIds() {
    this.storage.get(`WalletsIds`)
      .then(val => {
        if (val != null) {
          this.walletsIds = val;
        }
      })
  }

  getItemsIds(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Items`)
      .then(val => {
        this.itemsIds = val;
      })
  }

  setItemsIds(diagnosticId: number) {
    this.itemsIds.push(...this.newIdList);
    this.storage.set(`Diagnostic ${this.diagnosticId} Items`, this.itemsIds)
  }

  addItem(item: Item) {
    this.storage.set(`Diagnostic ${this.diagnosticId} Item ${item.id}`, item)
      .then(() => {
        this.setItemsIds(item.diagnostic);
      })
  }

  getWalletTransactionsIds(walletId: number) {
    this.storage.get(`Wallet ${walletId} Transactions`)
      .then(val => {
        if(val != null) {
          this.transactionsIds = val;
        }
        this.transactionsIds.forEach((id, index) => {
          // Recebe uma transação
          this.getWalletTransaction(id, walletId, index);
        })
      })
  }

  getWalletTransaction(transactionId: number, walletId: number, index: number) {
    this.storage.get(`Wallet ${walletId} Transaction ${transactionId}`)
      .then(val => {
        console.log(val)
        if(val != null) {
          let item: Item = {
            id: this.newIdList[index],
            name: val.name,
            value: val.value,
            diagnostic: this.diagnosticId,
            category: val.category,
            type: val.type
          }
          this.addItem(item);
        }
      })
  }

  setNextItemId(diagnosticId: number, id: number) {
    id += this.newIdList.length;
    this.storage.set(`Diagnostic ${diagnosticId} Next Item id`, id)
  }

  getNextItemId(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Next Item id`)
      .then(val => {
        if (val != null) {
          this.itemNextId = val;
          console.log(this.itemNextId);
        } else {
          this.itemNextId = 1;
        }
      })
  }
}

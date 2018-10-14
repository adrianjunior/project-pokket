import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Wallet } from '../../../models/wallet.interface';
import { Item } from '../../../models/item.inferface';
import { Diagnostic } from '../../../models/diagnostic.interface';

@IonicPage()
@Component({
  selector: 'page-add-diagnostic-wallet',
  templateUrl: 'add-diagnostic-wallet.html',
})
export class AddDiagnosticWalletPage {

  walletsIds: number[];
  wallets: Wallet[];
  selected: number;
  walletsSelector: boolean[];
  selectedWallets: number[];
  transactionsIds: number[];
  itemNextId: number;
  diagnosticId: number;
  itemsIds: number[];
  diagnostic: Diagnostic;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private toastCtrl: ToastController) { }

  ngOnInit() {
    this.itemNextId = 0;
    this.wallets = [];
    this.walletsIds = [];
    this.walletsSelector = [];
    this.selectedWallets = [];
    this.selected = 0;
    this.itemsIds = [];
    this.diagnostic = {
      id: 0,
      name: '',
      date: '',
      isConcluded: false
    }
    this.diagnosticId = this.navParams.get('id');
    this.getDiagnostic(this.diagnosticId);
    this.getWalletsIds();
    this.getItemsIds(this.diagnosticId);
    this.getNextItemId(this.diagnosticId);
  }

  updateSelected() {
    this.selected = 0;
    this.selectedWallets = [];
    
    this.walletsSelector.forEach((d, i) => {
      if(d) {
        this.selected += 1;
        this.selectedWallets.push(this.wallets[i].id);
        console.log(`SELECTED: ${this.selected} / SELECTED_ARRAY: ${this.selectedWallets}`)
      }
    });
  }

  addWalletsToDiagnostic() {
    this.selectedWallets.forEach((walletId, index) => {
      if(index >= this.selectedWallets.length-1) {
        this.getWalletTransactionsIds(walletId, true);
      } else {
        this.getWalletTransactionsIds(walletId, false);
      }
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

  getDiagnostic(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId}`)
      .then(val => {
        this.diagnostic = val;
      })
  }

  getWalletsIds() {
    this.storage.get(`WalletsIds`)
      .then(val => {
        if (val != null) {
          this.walletsIds = val;
          this.walletsIds.forEach(walletId => {
            this.getWallet(walletId);
          });
        }
      })
  }

  getWallet(walletId: number) {
    this.storage.get(`Wallet ${walletId}`)
      .then(val => {
        if (val != null) {
          this.wallets.push(val);
        }
      });
  }

  getItemsIds(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Items`)
      .then(val => {
        if(val != null) {
          this.itemsIds = val;
          console.log(`ITEMS IDS ${this.itemsIds}`)
        }
      })
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

  getWalletTransactionsIds(walletId: number, isLast: boolean) {
    let transactionsIds;
    this.storage.get(`Wallet ${walletId} Transactions`)
      .then(val => {
        if(val != null) {
          transactionsIds = val;
        }
        transactionsIds.forEach((id, index) => {
          // Recebe uma transação
          if(index >= transactionsIds.length-1 && isLast) {
            // É a última
            this.getWalletTransaction(id, walletId, true);
          } else {
            // Não é a última
            this.getWalletTransaction(id, walletId, false);
          }
        })
      })
  }

  getWalletTransaction(transactionId: number, walletId: number, isLast: boolean) {
    this.storage.get(`Wallet ${walletId} Transaction ${transactionId}`)
      .then(val => {
        console.log(val)
        console.log(`ITEM NEXT ID: ${this.itemNextId}`)
        if(val != null) {
          let item: Item = {
            id: this.itemNextId,
            name: val.name,
            value: val.value,
            diagnostic: this.diagnosticId,
            category: val.category,
            type: val.type
          }
          this.itemNextId += 1;
          if(isLast) {
            this.addItem(item, true);
          } else {
            this.addItem(item, false);
          }
        }
      })
  }

  addItem(item: Item, isLast: boolean) {
    console.log(`ITEMS IDS: ${this.itemsIds}`)
    this.storage.set(`Diagnostic ${this.diagnosticId} Item ${item.id}`, item)
      .then(() => {
        this.itemsIds = [...this.itemsIds, item.id]
        if (isLast) {
          this.setItemsIds(this.diagnosticId);
          this.setNextItemId(this.diagnosticId, this.itemsIds[this.itemsIds.length - 1]+1)
        }
      })
  }

  setItemsIds(diagnosticId: number) {
    this.storage.set(`Diagnostic ${diagnosticId} Items`, this.itemsIds)
  }

  setNextItemId(diagnosticId: number, id: number) {
    this.storage.set(`Diagnostic ${diagnosticId} Next Item id`, id)
    this.navCtrl.pop();
  }
}

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../models/wallet.interface';
import { Transaction } from '../../../models/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-wallet-profile',
  templateUrl: 'wallet-profile.html',
})
export class WalletProfilePage {

  addTransactionPage: string = `AddTransactionPage`;
  transactionProfilePage: string = `TransactionProfilePage`;
  walletExtractPage: string = `WalletExtractPage`;
  editWalletPage: string = `EditWalletPage`;
  walletResult: string = `WalletResultPage`;

  walletId: number;
  wallet: Wallet = {
    id: 0,
    name: '',
    balance: 0
  };
  transactionsIds: number[] = [];
  transactions: Transaction[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public popoverCtrl: PopoverController, private storage: Storage,
              private toastCtrl: ToastController) {
  }

  ionViewWillEnter(){
    this.transactions = [];
    this.transactionsIds = [];
    this.walletId = this.navParams.get('id');
    this.getWallet(this.walletId);
    this.getWalletTransactions(this.walletId);
  }

  goToTransactionProfile(transactionId: number, walletId: number = this.walletId) {
    this.navCtrl.push(this.transactionProfilePage, {
      transactionId: transactionId,
      walletId: walletId
    });
  }

  goToAddTransaction(isIncome: boolean) {
    this.navCtrl.push(this.addTransactionPage, {
      isIncome: isIncome,
      id: this.walletId
    });
  }
  
  goToWalletExtract() {
    this.navCtrl.push(this.walletExtractPage, {
      id: this.walletId
    })
  }

  goToEditWallet() {
    this.navCtrl.push(this.editWalletPage, {
      id: this.walletId
    })
  }

  goToWalletResults() {
    this.navCtrl.push(this.walletResult, {
      id: this.walletId
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

  // Recebe a carteira atual
  getWallet(id: number) {
    this.storage.get(`Wallet ${id}`)
                .then(val => {
                  this.wallet = val;
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar suas Carteiras. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  // Recebe as transações da carteira atual
  getWalletTransactions(walletId: number) {
    this.storage.get(`Wallet ${walletId} Transactions`)
                .then(val => {
                  if(val != null) {
                    this.transactionsIds = val;
                  }
                  this.transactionsIds.forEach(id => {
                    // Recebe uma carteira
                    this.getTransaction(id, walletId);
                  })
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar sua Carteira. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  getTransaction(id: number, walletId: number) {
    this.storage.get(`Wallet ${walletId} Transaction ${id}`)
                .then(val => {
                  console.log(val)
                  if(val != null) {
                    val.date = moment(val.date).locale('pt-br').format('L');
                    this.transactions.push(val)
                  }
                })
  }
}

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Wallet } from '../../../assets/data/wallet.interface';
import { Transaction } from '../../../assets/data/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-wallet-profile',
  templateUrl: 'wallet-profile.html',
})
export class WalletProfilePage implements OnInit {

  addTransactionPage: string = `AddTransactionPage`;
  transactionProfilePage: string = `TransactionProfilePage`;

  walletId: number;
  wallet: Wallet = {
    id: 0,
    name: '',
    balance: 0
  };
  transactions: Transaction[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public popoverCtrl: PopoverController, private storage: Storage,
              private toastCtrl: ToastController) {
  }

  ionViewWillEnter(){
    
    this.walletId = this.navParams.get('id');
    this.getWallet(this.walletId);
    this.getWalletTransactions(this.walletId);
  }

  ngOnInit() {
    this.transactions = [];
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

  getWalletTransactions(walletId: number) {
    this.storage.get(`Wallet ${walletId} Transactions`)
                .then(val => {
                  if(val != null) {
                    this.transactions = val;
                    console.log('Transactions => ' + this.transactions);
                  }
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar suas Carteiras. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }
}

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../models/wallet.interface';
import { Transaction } from '../../../models/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-edit-wallet',
  templateUrl: 'edit-wallet.html',
})
export class EditWalletPage implements OnInit {

  walletId: number;
  wallet: Wallet = {
    id: 0,
    name: '',
    balance: 0
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, private storage: Storage,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.walletId = this.navParams.get('id');
    this.getWallet(this.walletId);
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
                  this.presentToast('Ocorreu um erro ao carregar sua Carteira. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  setWallet() {

  }

  deleteWallet(id: number) {
    this.storage.remove(`Wallet ${id}`)
                .then(() => {
                  this.storage.remove(`Wallet ${id} Next id`)
                })
                .then(() => {

                })
  }

}

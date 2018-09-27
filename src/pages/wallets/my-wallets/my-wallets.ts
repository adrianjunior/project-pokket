import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Wallet } from '../../../models/wallet.interface';

@IonicPage()
@Component({
  selector: 'page-my-wallets',
  templateUrl: 'my-wallets.html',
})
export class MyWalletsPage implements OnInit {

  walletProfilePage: string = `WalletProfilePage`;
  addWalletPage: string = `AddWalletPage`;

  walletsIds: number[];
  wallets: Wallet[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private storage: Storage, private toastCtrl: ToastController) {
  }

  ionViewWillEnter(){
    this.getWalletsIds();
  }

  ngOnInit() {
    this.walletsIds = [];
    this.wallets = [];
  }

  goToWallet(id: number) {
    this.navCtrl.push(this.walletProfilePage, {
      id: id
    });
  }

  goToAddWallet() {
    this.navCtrl.push(this.addWalletPage);
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

  // Recebe as IDs das carteiras
  getWalletsIds() {
    this.storage.get('WalletsIds')
                .then(val => {
                  this.wallets = [];
                  if (val != null) {
                    this.walletsIds = val;
                  }
                  this.walletsIds.forEach(id => {
                    // Recebe uma carteira
                    this.getWallet(id);
                  })
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar suas Carteiras. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  // Recebe uma carteira
  getWallet(id: number) {
    this.storage.get(`Wallet ${id}`)
                .then(val => {
                  this.wallets.push(val);
                  console.log(this.wallets);
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar suas Carteiras. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

}

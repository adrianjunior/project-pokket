import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';

import wallets from '../../../assets/data/wallets';
import { Wallet } from '../../../assets/data/wallet.interface';

@IonicPage()
@Component({
  selector: 'page-my-wallets',
  templateUrl: 'my-wallets.html',
})
export class MyWalletsPage {

  walletProfilePage: string = `WalletProfilePage`;

  wallets: Wallet[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.wallets = wallets;
  }

  goToWallet(id: number) {
    this.navCtrl.push(this.walletProfilePage, {
      id: id
    });
  }

}

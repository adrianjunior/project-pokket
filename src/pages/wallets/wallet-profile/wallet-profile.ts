import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { Wallet } from '../../../assets/data/wallet.interface';
import wallets from '../../../assets/data/wallets';

@IonicPage()
@Component({
  selector: 'page-wallet-profile',
  templateUrl: 'wallet-profile.html',
})
export class WalletProfilePage {

  addTransactionPopoverPage: string = `AddTransactionPopoverPage`;

  walletId: number;
  wallet: Wallet = {
    id: 0,
    name: '',
    balance: 0
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    this.walletId = this.navParams.get('id');
    this.wallet = wallets.find(wallet => wallet.id == this.walletId);
  }

  showAddTransactionPopover(myEvent, id: string) {
    const popover = this.popoverCtrl.create(this.addTransactionPopoverPage, {
      id: id
    });
    popover.present({
      ev: myEvent
    });
  }

}

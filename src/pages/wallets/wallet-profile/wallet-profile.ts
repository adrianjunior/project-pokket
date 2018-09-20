import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';

import { Wallet } from '../../../assets/data/wallet.interface';

@IonicPage()
@Component({
  selector: 'page-wallet-profile',
  templateUrl: 'wallet-profile.html',
})
export class WalletProfilePage implements OnInit {

  addTransactionPopoverPage: string = `AddTransactionPopoverPage`;
  transactionProfilePage: string = `TransactionProfilePage`;

  walletId: number;
  wallet: Wallet = {
    id: 0,
    name: '',
    balance: 0
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController) {
  }

  ngOnInit() {
    this.walletId = this.navParams.get('id');
  }

  showAddTransactionPopover(myEvent, id: string) {
    const popover = this.popoverCtrl.create(this.addTransactionPopoverPage, {
      id: id
    });
    popover.present({
      ev: myEvent
    });
  }

  goToTransactionProfile(id: number){
    this.navCtrl.push(this.transactionProfilePage, {
      id: id,
    });
  }
}

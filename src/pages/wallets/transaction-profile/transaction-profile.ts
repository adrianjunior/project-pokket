import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Transaction } from '../../../assets/data/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-transaction-profile',
  templateUrl: 'transaction-profile.html',
})
export class TransactionProfilePage {

  transactionId: number;
  transaction: Transaction = {
    id: 0,
    name: '',
    value: 0,
    date: '',
    category: 0,
    type: ''
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.transactionId = this.navParams.get('id');
  }

}

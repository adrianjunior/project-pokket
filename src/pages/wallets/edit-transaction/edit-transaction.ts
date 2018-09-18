import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import wallets from '../../../assets/data/wallets';
import { Transaction } from '../../../assets/data/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-edit-transaction',
  templateUrl: 'edit-transaction.html',
})
export class EditTransactionPage implements OnInit {

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
    /*TODO: Filter Transaction*/
  }

  
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { Wallet } from '../../../assets/data/wallet.interface';
import wallets from '../../../assets/data/wallets';

@IonicPage()
@Component({
  selector: 'page-add-transaction',
  templateUrl: 'add-transaction.html',
})
export class AddTransactionPage {

  isIncome: boolean = false;
  walletId: number = 0;
  wallet: Wallet = {
    id: 0,
    name: '',
    balance: 0
  };

  name: string;
  value: number;
  date: string;
  category: string;
  type: number;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.isIncome = this.navParams.get('isIncome');
    this.walletId = this.navParams.get('id');
    this.wallet = wallets.find(wallet => wallet.id == this.walletId);
    this.formGroup = formBuilder.group({
      'name': ['', Validators.required],
      'value': [null, Validators.required],
      'date': ['', Validators.required],
      'category': [''],
      'type': [null, Validators.required]
    });
  }

  addTransaction(formValue: any, addMore: boolean) {
    console.log(formValue);
    if(addMore) {
      this.formGroup.reset();
    } else {
      this.navCtrl.pop();
    }
  }
}

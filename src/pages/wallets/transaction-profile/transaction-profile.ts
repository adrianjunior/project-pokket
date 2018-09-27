import { Component, OnInit, wtfLeave } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../assets/data/wallet.interface';
import { Transaction } from '../../../assets/data/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-transaction-profile',
  templateUrl: 'transaction-profile.html',
})
export class TransactionProfilePage {

  transactions: Transaction[];
  isIncome: boolean;
  walletId: number;
  wallet: Wallet = {
    id: 0,
    name: '',
    balance: 0
  };
  whatIs: string;
  transactionId: number;
  transaction: Transaction;

  name: string;
  value: number;
  date: string;
  category: string;
  type: number;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public storage: Storage,
    public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.transactions = [];
    this.walletId = this.navParams.get('walletId');
    this.transactionId = this.navParams.get('transactionId');
    this.transaction = {
      id: 0,
      name: '',
      value: 0,
      date: '',
      category: '',
      type: 0,
      wallet: 0
    }
    this.getTransaction(this.walletId, this.transactionId);
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required],
      'value': [null, Validators.required],
      'date': ['', Validators.required],
      'category': [''],
      'type': [null]
    });
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
  getTransaction(walletId: number, transactionId: number) {
    this.storage.get(`Wallet ${walletId} Transactions`)
      .then(val => {
        let transactions: Transaction[];
        if (val != null) {
          transactions = val;
          this.transaction = transactions.find((t) => {
            return t.id == transactionId;
          })
          if (this.transaction.value > 0) {
            this.isIncome = true;
            this.whatIs = 'Receita'
          } else {
            this.isIncome = false;
            this.whatIs = 'Despesa'
          }
          this.formGroup = this.formBuilder.group({
            'name': [this.transaction.name, Validators.required],
            'value': [this.transaction.value, Validators.required],
            'date': [moment(this.transaction.date.replace('/', '')), Validators.required],
            'category': [this.transaction.category],
            'type': [this.transaction.type]
          });
        }
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar sua transação. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

}

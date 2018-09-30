import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../../models/wallet.interface';
import { Transaction } from '../../../../models/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-transaction-profile',
  templateUrl: 'transaction-profile.html',
})
export class TransactionProfilePage {

  isIncome: boolean;
  walletId: number;
  wallet: Wallet;
  whatIs: string;
  transactionId: number;
  transaction: Transaction;
  transactionsIds: number[];

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
    this.walletId = this.navParams.get('walletId');
    this.transactionId = this.navParams.get('transactionId');
    this.transactionsIds = [];
    this.transaction = {
      id: 0,
      name: '',
      value: 0,
      date: '',
      category: '',
      type: 0,
      wallet: 0
    }
    this.wallet =  {
      id: 0,
      name: '',
      balance: 0
    };
    this.getTransaction(this.walletId, this.transactionId);
    this.getTransactions(this.walletId);
    this.getWallet(this.walletId);
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

  setTransaction(formValue: any) {
    let date: string = formValue.date;
    date = moment(date).format('YYYY-MM-DD');
    let value: number = Number(Number(formValue.value).toFixed(2));
    if (value > 0) {
      if (!this.isIncome) {
        value *= -1;
      }
      let  newTransaction: Transaction = {
        id: this.transactionId,
        name: formValue.name,
        value: value,
        date: date,
        wallet: this.walletId
      }
      if (formValue.category != null) {
        newTransaction.category = formValue.category;
      }
      if (formValue.type != null) {
        newTransaction.type = formValue.type;
      }
      this.storage.set(`Wallet ${this.walletId} Transaction ${this.transaction.id}`, newTransaction)
        .then(() => {
          if(!this.isIncome){
            this.wallet.balance = this.wallet.balance + (newTransaction.value-(this.transaction.value*-1));
          } else {
            this.wallet.balance = this.wallet.balance + (newTransaction.value-this.transaction.value);
          }
          console.log('Depois ' + this.wallet.balance);
          this.setWallet(this.walletId, this.wallet);
        })
        .then(() => {
          this.navCtrl.pop();
        })
        .catch(err => {
          this.presentToast(`Ocorreu um erro ao salvar sua ${this.whatIs}. Por favor, reinicie o app.`, 'bottom', 3000);
          console.log(err);
        })
    } else {
      this.presentToast('O valor não pode ser 0 ou menor.', 'bottom', 3000);
    }
  }

  getTransaction(walletId: number, transactionId: number) {
    this.storage.get(`Wallet ${walletId} Transaction ${transactionId}`)
      .then(val => {
        if (val != null) {
          this.transaction = val;
          if (this.transaction.value > 0) {
            this.isIncome = true;
            this.whatIs = 'Receita'
          } else {
            this.isIncome = false;
            this.whatIs = 'Despesa'
            this.transaction.value *= -1;
          }
          this.formGroup = this.formBuilder.group({
            'name': [this.transaction.name, Validators.required],
            'value': [this.transaction.value, Validators.required],
            'date': [this.transaction.date, Validators.required],
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

  deleteTransaction() {
    this.storage.remove(`Wallet ${this.walletId} Transaction ${this.transactionId}`)
                .then(() => {
                  let index = this.transactionsIds.indexOf(this.transactionId);
                  if (index > -1) {
                    this.transactionsIds.splice(index, 1);
                    this.setTransactions(this.walletId, this.transactionsIds);
                  }
                })
                .then(() => {
                  this.wallet.balance = this.wallet.balance - this.transaction.value;
                  this.setWallet(this.walletId, this.wallet);
                })
                .then(() => {
                  this.navCtrl.pop();
                })
                .catch(err => {
                  this.presentToast(`Ocorreu um erro ao excluir sua ${this.whatIs}. Por favor, reinicie o app.`, 'bottom', 3000);
                  console.log(err);
                })
  }

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

  setWallet(id: number, wallet: Wallet) {
    this.storage.set(`Wallet ${id}`, wallet);
    console.log(wallet);
  }

  getTransactions(walletId: number) {
    this.storage.get(`Wallet ${walletId} Transactions`)
      .then(val => {
        if (val != null) {
          this.transactionsIds = val;
        }
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar suas Receitas e Despesas. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  setTransactions(walletId: number, transactionsIds: number[]) {
    this.storage.set(`Wallet ${walletId} Transactions`, transactionsIds)
  }

}

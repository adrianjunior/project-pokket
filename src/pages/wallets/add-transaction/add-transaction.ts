import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../assets/data/wallet.interface';
import { Transaction } from '../../../assets/data/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-add-transaction',
  templateUrl: 'add-transaction.html',
})
export class AddTransactionPage implements OnInit {

  transactions: Transaction[];
  nextId: number;
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

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public formBuilder: FormBuilder, public storage: Storage,
              public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.transactions = [];
    this.isIncome = this.navParams.get('isIncome');
    this.walletId = this.navParams.get('id');
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required],
      'value': [null, Validators.required],
      'date': ['', Validators.required],
      'category': [''],
      'type': [null]
    });
    this.getTransactions(this.walletId);
    this.getNextTransactionId(this.walletId);
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

  addTransaction(formValue: any, addMore: boolean) {
    let date: string = formValue.date;
    date = moment(date.replace('-', ''), 'YYYYMMDD').locale('pt-br').format('L').toString();
    let value: number = formValue.value;
    if(!this.isIncome) {
      value = value*-1;
    }
    let transaction: Transaction = {
      id: this.nextId,
      name: formValue.name,
      value: value,
      date: date,
      wallet: this.walletId
    }
    if (formValue.category != null) {
      transaction.category = formValue.category;
    }
    if (formValue.type != null) {
      transaction.type = formValue.type;
    }
    this.transactions.push(transaction)
    this.storage.set(`Wallet ${this.walletId} Transactions`, this.transactions)
                .then(() => {
                  if(addMore) {      
                    this.formGroup.reset();
                  } else {
                    this.navCtrl.pop();
                  }
                  let text;
                  if(this.isIncome) {
                    text = 'Receita';
                  } else {
                    text = 'Despesa';
                  }
                  this.presentToast('Parabéns. Sua Carteira foi adicionada com sucesso!', 'bottom', 3000);
                })
                .then(() => {
                  this.setNextTransactionId(this.walletId, this.nextId+1);
                })

    if(addMore) {
      this.formGroup.reset();
    } else {
      this.navCtrl.pop();
    }
  }

  getTransactions(walletId: number) {
    this.storage.get(`Wallet ${walletId} Transactions`)
                .then(val => {
                  if(val != null) {
                    this.transactions = val;
                    console.log(this.transactions);
                  }
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar suas Receitas e Despesas. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  setNextTransactionId(walletId: number, id: number) {
    this.storage.set(`Wallet ${walletId} Next Transaction id`, id)
  }

  getNextTransactionId(walletId: number) {
    this.storage.get(`Wallet ${walletId} Next Transaction id`)
                .then(val => {
                  if(val != null) {
                    this.nextId = val;
                    console.log(this.nextId);
                  }
                })
  }

}

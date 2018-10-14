import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../../models/wallet.interface';
import { Transaction } from '../../../../models/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-add-transaction',
  templateUrl: 'add-transaction.html',
})
export class AddTransactionPage implements OnInit {

  transactionsIds: number[];
  nextId: number;
  isIncome: boolean;
  walletId: number;
  wallet: Wallet = {
    id: 0,
    name: '',
    balance: 0
  };
  whatIs: string;

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
    this.transactionsIds = [];
    this.isIncome = this.navParams.get('isIncome');
    this.walletId = this.navParams.get('id');
    if(this.isIncome) {
      this.formGroup = this.formBuilder.group({
        'name': ['', Validators.required],
        'value': [null, Validators.required],
        'date': ['', Validators.required],
        'category': [''],
        'type': [null]
      });
    } else {
      this.formGroup = this.formBuilder.group({
        'name': ['', Validators.required],
        'value': [null, Validators.required],
        'date': ['', Validators.required],
        'category': [''],
        'type': [null, Validators.required]
      });
    }
    
    this.getTransactions(this.walletId);
    this.getNextTransactionId(this.walletId);
    this.getWallet(this.walletId);
    if (this.isIncome) {
      this.whatIs = 'Receita'
    } else {
      this.whatIs = 'Despesa'
    }
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
    date = moment(date).format('YYYY-MM-DD');
    let value: number = Number(Number(formValue.value).toFixed(2));
    console.log(`NAME ${formValue.name}`)
    /*if ((value > 0 && formValue.name != '') && ((this.isIncome) || (!this.isIncome && formValue.type != null))) {
    } else if (formValue.name == '') {
      this.presentToast('Você deve colocar um nome.', 'bottom', 3000);
    } else if (value <= 0) {
      this.presentToast('O valor não pode ser 0 ou menor.', 'bottom', 3000);
    } else if (!this.isIncome && formValue.type == null) {
      this.presentToast('Você deve colocar um tipo.', 'bottom', 3000);
    }*/
    if (!this.isIncome) {
      value = value * -1;
    }
    let transaction: Transaction = {
      id: this.nextId,
      name: formValue.name,
      value: Number(value.toFixed(2)),
      date: date,
      wallet: this.walletId
    }
    if (formValue.category != null) {
      transaction.category = formValue.category;
    }
    if (formValue.type != null) {
      transaction.type = formValue.type;
    }
    this.storage.set(`Wallet ${this.walletId} Transaction ${this.nextId}`, transaction)
      .then(() => {
        this.setTransactions(this.walletId, this.nextId);
      })
      .then(() => {
        this.nextId += 1;
        this.setNextTransactionId(this.walletId, this.nextId);
      })
      .then(() => {
        console.log('Antes ' + this.wallet.balance);
        this.wallet.balance = this.wallet.balance + transaction.value;
        console.log('Depois ' + this.wallet.balance);
        this.setWallet(this.walletId, this.wallet);
      })
      .then(() => {
        if (addMore) {
          this.formGroup.reset();
        } else {
          this.navCtrl.pop();
        }
        this.presentToast(`Parabéns. Sua ${this.whatIs} foi adicionada com sucesso!`, 'bottom', 3000);
      })
      .catch(err => {
        this.presentToast(`Ocorreu um erro ao salvar sua ${this.whatIs}. Por favor, reinicie o app.`, 'bottom', 3000);
        console.log(err);
      })
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

  setTransactions(walletId: number, id: number) {
    this.transactionsIds.push(id);
    this.storage.set(`Wallet ${walletId} Transactions`, this.transactionsIds)
  }

  setNextTransactionId(walletId: number, id: number) {
    this.storage.set(`Wallet ${walletId} Next Transaction id`, id)
  }

  getNextTransactionId(walletId: number) {
    this.storage.get(`Wallet ${walletId} Next Transaction id`)
      .then(val => {
        if (val != null) {
          this.nextId = val;
          console.log(this.nextId);
        }
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

}

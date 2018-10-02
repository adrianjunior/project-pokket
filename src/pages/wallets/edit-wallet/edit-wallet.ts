import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';

import { Wallet } from '../../../models/wallet.interface';
import { Transaction } from '../../../models/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-edit-wallet',
  templateUrl: 'edit-wallet.html',
})
export class EditWalletPage implements OnInit {

  walletId: number;
  wallet: Wallet;
  transactionsIds: number[];
  walletsIds: number[];
  firstTransaction: Transaction;

  // Form Items
  name: string;
  balance: number;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, private storage: Storage,
    private toastCtrl: ToastController, public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.wallet = {
      id: 0,
      name: '',
      balance: 0
    };
    this.transactionsIds = [];
    this.walletsIds = [];
    this.walletId = this.navParams.get('id');
    this.getWallet(this.walletId);
    this.getWalletsIds();
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required],
      'balance': [null, Validators.required],
    });
  }

  editWallet(formValue: any) {
    this.wallet.name = formValue.name;
    if(this.firstTransaction != null) {
      this.wallet.balance = this.wallet.balance + (Number(formValue.balance) - this.firstTransaction.value)
      this.firstTransaction.value = Number(formValue.balance);
    } else {
      this.transactionsIds.reverse().push(0);
      this.transactionsIds.reverse();
      this.firstTransaction = {
        id: 0,
        name: 'Valor Inicial',
        value: Number(formValue.balance),
        date: moment().format('YYYY-MM-DD'),
        wallet: this.walletId
      }
      this.wallet.balance = this.wallet.balance + Number(formValue.balance)
    }
    this.setWallet(this.walletId, this.firstTransaction)
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

  // Recebe a carteira atual
  getWallet(id: number) {
    this.storage.get(`Wallet ${id}`)
                .then(val => {
                  this.wallet = val;
                })
                .then(() => {
                  this.getWalletTransactions(id);
                })
                .then(() => {
                  this.getWalletFirstTransaction(id);
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar sua Carteira. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  getWalletTransactions(walletId: number) {
    this.storage.get(`Wallet ${walletId} Transactions`)
                .then(val => {
                  if(val != null) {
                    this.transactionsIds = val;
                  }
                })
  }

  getWalletFirstTransaction(walletId: number) {
    this.storage.get(`Wallet ${walletId} Transaction 0`)
                .then(val => {
                  this.firstTransaction = val;
                  if (this.firstTransaction != null) {
                    this.formGroup = this.formBuilder.group({
                      'name': [this.wallet.name, Validators.required],
                      'balance': [this.firstTransaction.value, Validators.required],
                    });
                  } else {
                    this.formGroup = this.formBuilder.group({
                      'name': [this.wallet.name, Validators.required],
                      'balance': [null, Validators.required],
                    });
                  }
                })
  }

  getWalletsIds() {
    this.storage.get('WalletsIds')
                .then(val => {
                  this.walletsIds = val;
                })
  }

  setWallet(id: number, transaction: Transaction) {
    this.storage.set(`Wallet ${id}`, this.wallet)
                .then(() => {
                  if(transaction != null) {
                    this.setFirstTransaction(id, transaction)
                  }
                })
                .then(() => {
                  if(transaction != null) {
                    this.setWalletTransactions(id, this.transactionsIds)
                  }
                })
                .then(() => {
                  this.navCtrl.pop();
                })
  }

  setFirstTransaction(id: number, transaction: Transaction) {
    this.storage.set(`Wallet ${id} Transaction 0`, transaction)
  }

  setWalletTransactions(id: number, transactions: number[]) {
    this.storage.set(`Wallet ${id} Transactions`, transactions)
  }

  deleteWallet(id: number = this.walletId) {
    this.storage.remove(`Wallet ${id}`)
                .then(() => {
                  this.deleteWalletTransactionNextId(id);
                })
                .then(() => {
                  this.deleteWalletTransactionsIds(id);
                })
                .then(() => {
                  this.transactionsIds.forEach(transactionId => {
                    this.deleteTransaction(id, transactionId);
                  })
                })
                .then(() => {
                  const index = this.walletsIds.indexOf(this.walletId);
                  console.log(`INDEX ==> ${index}`);
                  console.log(`WALLETSIDS ==> ${this.walletsIds}`);
                  console.log(`WALLETID ==> ${this.walletId}`)
                  if(index > -1) {
                    this.walletsIds.splice(index, 1)
                    console.log(`WALLETSIDS 2 ==> ${this.walletsIds}`);
                    this.setWalletsIds(this.walletsIds);
                  }
                })
                .then(() => {
                  this.navCtrl.popToRoot();
                })
  }

  deleteWalletTransactionNextId(walletId: number) {
    this.storage.remove(`Wallet ${walletId} Next id`)
  }

  deleteWalletTransactionsIds(walletId: number) {
    this.storage.remove(`Wallet ${walletId} Transactions`)
  }

  deleteTransaction(walletId: number, transactionId:number) {
    this.storage.remove(`Wallet ${walletId} Transaction ${transactionId}`);
  }

  setWalletsIds(walletsIds: number[]) {
    this.storage.set('WalletsIds', walletsIds);
  }
}

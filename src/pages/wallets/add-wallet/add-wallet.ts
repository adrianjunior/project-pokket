import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../assets/data/wallet.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transaction } from '../../../assets/data/transaction.interface';

@IonicPage()
@Component({
  selector: 'page-add-wallet',
  templateUrl: 'add-wallet.html',
})
export class AddWalletPage implements OnInit {
  
  nextId: number;
  walletsIds: number[];
  firstTransaction: Transaction;
  transactionNextId: number;
  transactionsIds: number[];

  // Form Items
  name: string;
  balance: number;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private storage: Storage, public formBuilder: FormBuilder,
              private toastCtrl: ToastController) {}

  ngOnInit() {
    this.walletsIds = [];
    this.transactionsIds = [];
    
    this.getNextId();
    this.getWalletsIds();
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required],
      'balance': [null, Validators.required],
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
  addWallet(formValue: any, addMore: boolean) {
    let wallet: Wallet = {
      id: this.nextId,
      name: formValue.name,
      balance: parseFloat(formValue.balance)
    };
    this.storage.set(`Wallet ${wallet.id}`, wallet)
                  .then(() => {
                    this.nextId += 1;
                    this.setNextId(this.nextId);
                  })
                  .then(() => {
                    this.walletsIds.push(wallet.id);
                    this.setWalletsIds(this.walletsIds);
                  })
                  .then(() => {
                    this.setWalletInitialBalance(wallet.id, wallet.balance);
                  })
                  .then(() => {
                    this.setNextTransactionId(wallet.id);
                  })
                  .then(() => {
                    if(addMore) {      
                      this.formGroup.reset();
                    } else {
                      this.navCtrl.pop();
                    }
                    this.presentToast('Parabéns. Sua Carteira foi criada com sucesso!', 'bottom', 3000);
                  })
                  .catch(err => {
                    this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottoms', 3000);
                    console.log(err);
                  })
  }

  setWalletInitialBalance(id: number, value: number) {
    this.firstTransaction = {
      id: 1,
      name: 'Valor Inicial',
      value: value,
      date: moment().locale('pt-br').format('L'),
      wallet: id
    }
    this.storage.set(`Wallet ${id} Transactions`, [this.firstTransaction])
                .catch(err => {
                  this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottoms', 3000);
                  console.log(err);
                })
  }

  setNextTransactionId(walletId: number) {
    this.storage.set(`Wallet ${walletId} Next Transaction id`, 2)
  }

  getWalletsIds() {
    this.storage.get('WalletsIds')
                .then(val => {
                  if (val != null) {
                    this.walletsIds = val;
                  }
                  console.log(this.walletsIds);
                })
                .then(() => {
                  this.getNextId();
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottom', 3000);
                })
  }

  setWalletsIds(walletsIds: number[]) {
    this.storage.set('WalletsIds', walletsIds)
                .catch(err => {
                  this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottom', 3000);
                })
  }

  getNextId() {
    this.storage.get('Next id')
                .then(val => {
                  if(val != null) {
                    this.nextId = val;
                  } else {
                    this.nextId = 1;
                  }
                  console.log((this.nextId));
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottom', 3000);
                })
  }

  setNextId(id: number) {
    this.storage.set('Next id', id)
  }

}

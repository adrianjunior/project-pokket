import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { Wallet } from '../../../models/wallet.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Transaction } from '../../../models/transaction.interface';

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
    private toastCtrl: ToastController) { }

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

  // Adiciona uma nova carteira
  addWallet(formValue: any, addMore: boolean) {
    let wallet: Wallet = {
      id: this.nextId,
      name: formValue.name,
      balance: Number(Number(formValue.balance).toFixed(2))
    };
    this.storage.set(`Wallet ${wallet.id}`, wallet)
      .then(() => {
        this.nextId += 1;
        // Seta a ID da próxima carteira a ser criada
        this.setNextId(this.nextId);
      })
      .then(() => {
        this.walletsIds.push(wallet.id);
        // Adiciona a ID da carteira criada para a lista de carteiras
        this.setWalletsIds(this.walletsIds);
      })
      .then(() => {
        if (wallet.balance != null) {
          // Adiciona uma primeira transação a carteira, com o valor inicial entrado pelo usuário
          this.setWalletInitialBalance(wallet.id, wallet.balance);
        }
      })
      .then(() => {
        // Seta a ID da próxima  transação a ser criada
        this.setNextTransactionId(wallet.id);
      })
      .then(() => {
        if (wallet.balance != null) {
          // Adiciona a ID da transação criada para a lista de transações
          this.setWalletTransactions(wallet.id, [0]);
        }
      })
      .then(() => {
        // Checa se o usuário entrou com a opção de adicionar uma nova carteira ou voltar para a lista
        if (addMore) {
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

  setNextId(id: number) {
    this.storage.set('Next Wallet id', id)
  }

  setWalletsIds(walletsIds: number[]) {
    this.storage.set('WalletsIds', walletsIds)
  }

  setWalletInitialBalance(id: number, value: number) {
    this.firstTransaction = {
      id: 0,
      name: 'Valor Inicial',
      value: value,
      date: moment().format('YYYY-MM-DD'),
      wallet: id
    }
    this.storage.set(`Wallet ${id} Transaction 0`, this.firstTransaction)
  }

  setNextTransactionId(walletId: number) {
    this.storage.set(`Wallet ${walletId} Next Transaction id`, 1)
  }

  setWalletTransactions(id: number, transactions: number[]) {
    this.storage.set(`Wallet ${id} Transactions`, transactions)
  }

  // Recebe a lista de carteiras
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
  }

  // Recebe a próxima ID de carteira ser cadastrada
  getNextId() {
    this.storage.get('Next Wallet id')
      .then(val => {
        if (val != null) {
          this.nextId = val;
        } else {
          this.nextId = 1;
        }
        console.log((this.nextId));
      })
  }



}

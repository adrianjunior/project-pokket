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
  whatIs: string;
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

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public formBuilder: FormBuilder) {
    this.formGroup = formBuilder.group({
      'name': ['', Validators.required],
      'value': [null, Validators.required],
      'date': ['', Validators.required],
      'category': [''],
      'type': [null, Validators.required]
    })
  }

  ionViewDidLoad() {
    this.isIncome = this.navParams.get('isIncome');
    this.walletId = this.navParams.get('id');
    this.wallet = wallets.find(wallet => wallet.id == this.walletId);
    if(this.isIncome) {
      this.whatIs = 'Receita'
    } else {
      this.whatIs = 'Despesa'
    }
  }

  addTransaction(formValue: any) {
    console.log(formValue);
    this.createAlert();
  }

  createAlert() {
    let alert = this.alertCtrl.create({
      title: `Deseja adicionar outra ${this.whatIs}?`,
      subTitle: 'Para adicionar mais uma receita, clique em sim.' + 
                'Caso queira voltar para a página da carteira, clique em não.',
      buttons: [
        {
          text: 'Não',
          handler: () => {
            this.navCtrl.pop();
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.formGroup.reset();
          }
        }
      ]
    });
    alert.present();
  }
}

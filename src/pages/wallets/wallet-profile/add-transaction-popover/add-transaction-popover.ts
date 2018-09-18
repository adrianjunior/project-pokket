import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-add-transaction-popover',
  templateUrl: 'add-transaction-popover.html',
})
export class AddTransactionPopoverPage {

  addTransactionPage: string = `AddTransactionPage`;
  id: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.id = this.navParams.get('id');
  }

  goToAddIncome(id: string) {
    this.navCtrl.push(this.addTransactionPage, {
      isIncome: true,
      id: this.id
    });
    this.viewCtrl.dismiss();
  }

  goToAddExpense(id: string) {
    this.navCtrl.push(this.addTransactionPage, {
      isIncome: false,
      id: this.id
    });
    this.viewCtrl.dismiss();
  }

}

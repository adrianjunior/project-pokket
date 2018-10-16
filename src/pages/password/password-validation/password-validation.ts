import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-password-validation',
  templateUrl: 'password-validation.html',
})
export class PasswordValidationPage implements OnInit {

  password: string;
  //email: string;
  realPassword: string;

  myWalletsPage: string = `MyWalletsPage`;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.password = '';
    //this.email = '';
    this.getPassword();
  }

  validate() {
    if(this.password == this.realPassword) {
      this.navCtrl.setRoot(this.myWalletsPage);
    } else {
      this.presentToast('Senha incorreta.', 'bottom', 3000);
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
  getPassword() {
    this.storage.get('Password')
      .then(val => {
        if(val != null) {
          this.realPassword = val;
        } else {
          this.navCtrl.setRoot(this.myWalletsPage);
        }
      })
  }
  /*getEmailAndPassword() {
    this.storage.get('Email Password')
      .then(val => {
        if(val != null) {
          this.email = val[0];
          this.realPassword = val[1];
        } else {
          this.navCtrl.setRoot(this.myWalletsPage);
        }
      })
  }*/
}

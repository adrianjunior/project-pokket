import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SMS } from '@ionic-native/sms';

@IonicPage()
@Component({
  selector: 'page-password-validation',
  templateUrl: 'password-validation.html',
})
export class PasswordValidationPage implements OnInit {

  password: string;
  phone: string;
  realPassword: string;

  myWalletsPage: string = `MyWalletsPage`;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private toastCtrl: ToastController,
    private alertCtrl: AlertController, private sms: SMS) {
  }

  ngOnInit() {
    this.password = '';
    this.phone = '';
    this.getPhoneAndPassword();
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
  /*getPassword() {
    this.storage.get('Password')
      .then(val => {
        if(val != null) {
          this.realPassword = val;
        } else {
          this.navCtrl.setRoot(this.myWalletsPage);
        }
      })
  }*/
  getPhoneAndPassword() {
    this.storage.get('Phone Password')
      .then(val => {
        if(val != null) {
          this.phone = val[0];
          this.realPassword = val[1];
        } else {
          this.navCtrl.setRoot(this.myWalletsPage);
        }
      })
  }

  sendPasswordToPhone() {
    let alert = this.alertCtrl.create({
      title: 'Tem certeza que deseja enviar sua senha?',
      message: `Ela será enviada para o telefone: ${this.phone}.`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          role: 'delete',
          handler: () => {
            this.sms.send(this.phone, this.realPassword);
          }
        }
      ]
    });
    alert.present();
  }
}

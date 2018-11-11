import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SMS } from '@ionic-native/sms';

@IonicPage()
@Component({
  selector: 'page-password-config',
  templateUrl: 'password-config.html',
})
export class PasswordConfigPage implements OnInit{

  havePassword: boolean;

  phone: string;
  password: string;
  passwordRepeat: string;
  formGroup: FormGroup;

  passwordEditPage: string = `PasswordEditPage`

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, public formBuilder: FormBuilder,
    private toastCtrl: ToastController, private alertCtrl: AlertController, private sms: SMS) {
  }

  ngOnInit() {
    this.havePassword = false;
    this.phone = '';
    this.password = '';
    this.passwordRepeat = '';
    this.formGroup = this.formBuilder.group({
      'phone': ['', Validators.required],
      'password': [null, Validators.required],
      'passwordRepeat': ['', Validators.required]
    });
  }

  ionViewWillEnter() {
    this.getPhoneAndPassword();
    //this.getPassword();
  }

  goToEditPassword() {
    this.navCtrl.push(this.passwordEditPage, {
      phone: this.phone,
      password: this.password
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
            this.sms.send(this.phone, this.password)
              .then(res => this.presentToast(res, 'bottom', 3000))
              .catch(err => this.presentToast(err, 'bottom', 3000));
          }
        }
      ]
    });
    alert.present();
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
          this.password = val;
          this.havePassword = true;
        }
      })
  }

  setPassword(formValue: any) {
    if(formValue.password === formValue.passwordRepeat) {
      this.storage.set('Password', formValue.password)
      .then(() => {
        this.presentToast('Senha salva com sucesso!', 'bottom', 3000);
        this.havePassword = true;
        this.password = formValue.password;
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao salvar sua senha.', 'bottom', 3000);
      })
    } else {
      this.presentToast('Os campos de senha devem ser iguais.', 'bottom', 3000);
    }
  }

  deletePassword() {
    let alert = this.alertCtrl.create({
      title: 'Tem certeza que deseja apagar sua Senha?',
      message: 'Digite sua senha atual para poder apagá-la.',
      inputs: [
        {
          name: 'password',
          placeholder: 'Senha',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          role: 'delete',
          handler: data => {
            if (data.password == this.password) {
              this.storage.remove('Password')
              .then(() => {
                this.presentToast('Senha apagada com sucesso!', 'bottom', 3000);
                this.phone = '';
                this.password = '';
                this.havePassword = false;
              })
              .catch(err => {
                this.presentToast('Ocorreu um erro ao apagar sua senha. Reinicie o app.', 'bottom', 3000);
              })
            } else {
              this.presentToast('Senha incorreta.', 'bottom', 3000);
            }
          }
        }
      ]
    });
    alert.present();
  }*/
  getPhoneAndPassword() {
    this.storage.get('Phone Password')
      .then(val => {
        if(val != null) {
          this.phone = val[0];
          this.password = val[1];
          this.havePassword = true;
        }
      })
  }

  setPhoneAndPassword(formValue: any) {
    if(formValue.password === formValue.passwordRepeat) {
      let phonePassword = [formValue.phone, formValue.password]
      this.storage.set('Phone Password', phonePassword)
      .then(() => {
        this.presentToast('Phone e Senha salvas com sucesso!', 'bottom', 3000);
        this.havePassword = true;
        this.phone = formValue.phone;
        this.password = formValue.password;
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao salvar seu phone e senha.', 'bottom', 3000);
      })
    } else {
      this.presentToast('Os campos de senha devem ser iguais.', 'bottom', 3000);
    }
  }

  deletePhonePassword() {
    let alert = this.alertCtrl.create({
      title: 'Tem certeza que deseja apagar seu Phone e Senha?',
      message: 'Digite sua senha para poder apagar seu phone e senha.',
      inputs: [
        {
          name: 'password',
          placeholder: 'Senha',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          role: 'delete',
          handler: data => {
            if (data.password == this.password) {
              this.storage.remove('Phone Password')
              .then(() => {
                this.presentToast('Telefone e Senha apagados com sucesso!', 'bottom', 3000);
                this.phone = '';
                this.password = '';
                this.havePassword = false;
              })
              .catch(err => {
                this.presentToast('Ocorreu um erro ao apagar seu telefone e senha. Reinicie o app.', 'bottom', 3000);
              })
            } else {
              this.presentToast('Senha incorreta.', 'bottom', 3000);
            }
          }
        }
      ]
    });
    alert.present();
  }

}

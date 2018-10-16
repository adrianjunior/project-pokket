import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-password-config',
  templateUrl: 'password-config.html',
})
export class PasswordConfigPage implements OnInit{

  havePassword: boolean;

  //email: string;
  password: string;
  passwordRepeat: string;
  formGroup: FormGroup;

  passwordEditPage: string = `PasswordEditPage`

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, public formBuilder: FormBuilder,
    private toastCtrl: ToastController, private alertCtrl: AlertController,
    private socialSharing: SocialSharing) {
  }

  ngOnInit() {
    this.havePassword = false;
    //this.email = '';
    this.password = '';
    this.passwordRepeat = '';
    this.formGroup = this.formBuilder.group({
      //'email': ['', Validators.required],
      'password': [null, Validators.required],
      'passwordRepeat': ['', Validators.required]
    });
  }

  ionViewWillEnter() {
    //this.getEmailAndPassword();
    this.getPassword();
  }

  goToEditPassword() {
    this.navCtrl.push(this.passwordEditPage, {
      //email: this.email,
      password: this.password
    })
  }

  /*sendPasswordToEmail() {
    let alert = this.alertCtrl.create({
      title: 'Tem certeza que deseja enviar sua senha?',
      message: `Ela será enviada para o email: ${this.email}.`,
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        },
        {
          text: 'Sim',
          role: 'delete',
          handler: () => {
            this.socialSharing.canShareViaEmail().then(() => {
              // Sharing via email is possible
            }).catch(() => {
              this.presentToast('Não será possível enviar por email', 'bottom', 3000);
            });
        
            this.socialSharing.shareViaEmail(`Sua senha: ${this.password}`, 'Sua Senha', [this.email]).then(() => {
              this.presentToast(`Senha enviada para ${this.email}`, 'bottom', 3000);
            }).catch(() => {
              this.presentToast('Não foi possível enviar sua senha.', 'bottom', 3000);
            });
          }
        }
      ]
    });
    alert.present();
  }*/

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
                //this.email = '';
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
  }
  /*getEmailAndPassword() {
    this.storage.get('Email Password')
      .then(val => {
        if(val != null) {
          this.email = val[0];
          this.password = val[1];
          this.havePassword = true;
        }
      })
  }

  setEmailAndPassword(formValue: any) {
    if(formValue.password === formValue.passwordRepeat) {
      let emailPassword = [formValue.email, formValue.password]
      this.storage.set('Email Password', emailPassword)
      .then(() => {
        this.presentToast('Email e Senha salvas com sucesso!', 'bottom', 3000);
        this.havePassword = true;
        this.email = formValue.email;
        this.password = formValue.password;
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao salvar seu email e senha.', 'bottom', 3000);
      })
    } else {
      this.presentToast('Os campos de senha devem ser iguais.', 'bottom', 3000);
    }
  }

  deleteEmailPassword() {
    let alert = this.alertCtrl.create({
      title: 'Tem certeza que deseja apagar seu Email e Senha?',
      message: 'Digite sua senha para poder apagar seu email e senha.',
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
              this.storage.remove('Email Password')
              .then(() => {
                this.presentToast('Email e Senha apagados com sucesso!', 'bottom', 3000);
                this.email = '';
                this.password = '';
                this.havePassword = false;
              })
              .catch(err => {
                this.presentToast('Ocorreu um erro ao apagar seu email e senha. Reinicie o app.', 'bottom', 3000);
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

}

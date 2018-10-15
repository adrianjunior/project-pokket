import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-password-config',
  templateUrl: 'password-config.html',
})
export class PasswordConfigPage implements OnInit{

  havePassword: boolean;

  email: string;
  password: string;
  passwordRepeat: string;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, public formBuilder: FormBuilder,
    private toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.havePassword = false;
    this.email = '';
    this.password = '';
    this.passwordRepeat = '';
    this.formGroup = this.formBuilder.group({
      'email': ['', Validators.required],
      'password': [null, Validators.required],
      'passwordRepeat': ['', Validators.required]
    });
    this.getEmailAndPassword();
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
  getEmailAndPassword() {
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
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao salvar seu email e senha.', 'bottom', 3000);
      })
    } else {
      this.presentToast('Os campos de senha devem ser iguais.', 'bottom', 3000);
    }
  }
}

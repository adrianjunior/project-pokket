import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-password-edit',
  templateUrl: 'password-edit.html',
})
export class PasswordEditPage {

  password: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
  formGroup: FormGroup;

  passwordEditPage: string = `PasswordEditPage`

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, public formBuilder: FormBuilder,
    private toastCtrl: ToastController, private alertCtrl: AlertController) {
  }

  ngOnInit() {
    this.phone = '';
    this.currentPassword = '';
    this.newPassword = '';
    this.newPasswordRepeat = '';
    this.phone = this.navParams.get('phone');
    this.password = this.navParams.get('password');
    this.formGroup = this.formBuilder.group({
      'phone': [this.phone, Validators.required],
      'currentPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'newPasswordRepeat': ['', Validators.required]
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
  /*setPassword(formValue: any) {
    if(formValue.newPassword == formValue.newPasswordRepeat && formValue.currentPassword == this.password) {
      this.storage.set('Password', formValue.newPassword)
      .then(() => {
        this.presentToast('Senha alterada com sucesso!', 'bottom', 3000);
        this.navCtrl.pop();
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao alterar sua senha.', 'bottom', 3000);
      })
    } else if (formValue.newPassword != formValue.newPasswordRepeat) {
      this.presentToast('Os campos da nova senha devem ser iguais.', 'bottom', 3000);
    } else if (formValue.currentPassword != this.password) {
      this.presentToast('A senha atual está errada.', 'bottom', 3000);
    }
  }*/
  setPhonelAndPassword(formValue: any) {
    if(formValue.newPassword == formValue.newPasswordRepeat && formValue.currentPassword == this.password) {
      let phonePassword = [formValue.phone, formValue.newPassword]
      this.storage.set('Phone Password', phonePassword)
      .then(() => {
        this.presentToast('Telefone e Senha alteradas com sucesso!', 'bottom', 3000);
        this.navCtrl.pop();
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao salvar seu telefone e senha.', 'bottom', 3000);
      })
    } else if (formValue.newPassword != formValue.newPasswordRepeat) {
      this.presentToast('Os campos da nova senha devem ser iguais.', 'bottom', 3000);
    } else if (formValue.currentPassword != this.password) {
      this.presentToast('A senha atual está errada.', 'bottom', 3000);
    }
  }

}

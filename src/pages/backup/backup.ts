import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { SocialSharing } from '@ionic-native/social-sharing';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-backup',
  templateUrl: 'backup.html',
})
export class BackupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private toastCtrl: ToastController, 
    private alertCtrl: AlertController, private file: File, private socialSharing: SocialSharing) {
  }

  /*presentToast(message: string, position: string, duration: number) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position
    });

    toast.present();
  }

  exportFile() {
    this.readAllData();
  }

  importFile() {
    this.file.resolveDirectoryUrl(this.file.dataDirectory)
    .then(url => {
      this.file.getFile(url, `Backup.json`, {})
        .then(file => {
          file.file(file => {
            let reader = new FileReader();
            reader.onloadend = (e) => {
              this.writeAllData(reader.result);
            }
          })
        })
        .catch(err => {
          this.presentToast('Não há um arquivo de backup na pasta de dados da aplicação.', 'bottom', 3000);
        })
    })
  }

  getAndSendFile() {
    this.file.resolveDirectoryUrl(this.file.dataDirectory)
      .then(url => {
        this.file.getFile(url, `Backup.json`, {})
          .then(file => {
            this.socialSharing.share('Seu Backup Meubolso', 'Backup aplicativo Meubolso', file.fullPath)
            console.log(file.fullPath)
          })
      })
  }

  //DATABASE FUNCTIONS
  readAllData() {
    let data: {key: string, value: string}[];
    this.storage.forEach((value, key, index) => {
      data.push({key, value});
    }).then(() => {
      this.file.writeFile(this.file.dataDirectory, `Backup.json`, JSON.stringify(data), {replace: true})
        .then(() => {
          this.getAndSendFile();
        })
    })
  }

  writeAllData(data: {key: string, value:string}[]) {
    console.log('DATA ' + data)
    this.storage.clear()
      .then(() => {
        data.forEach(keyValue => {
          this.storage.set(keyValue.key, keyValue.value)
            .then(() => {
              this.navCtrl.setRoot(`MyWalletsPage`);
            })
        })
      })
  }*/
}

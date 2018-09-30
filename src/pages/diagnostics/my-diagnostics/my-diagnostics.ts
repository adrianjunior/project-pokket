import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Diagnostic } from '../../../models/diagnostic.interface';

@IonicPage()
@Component({
  selector: 'page-my-diagnostics',
  templateUrl: 'my-diagnostics.html',
})
export class MyDiagnosticsPage {

  addDiagnosticPage: string = `AddDiagnosticPage`;
  diagnosticProfilePage: string = `DiagnosticProfilePage`;

  diagnosticsIds: number[];
  diagnostics: Diagnostic[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private toastCtrl: ToastController) {
  }

  ionViewWillEnter(){
    this.getDiagnosticsIds();
  }

  ngOnInit() {
    this.diagnosticsIds = [];
    this.diagnostics = [];
  }

  goToDiagnostic(id: number) {
    this.navCtrl.push(this.diagnosticProfilePage, {
      id: id
    });
  }

  goToAddDiagnostic() {
    this.navCtrl.push(this.addDiagnosticPage);
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

  // Recebe as IDs dos diagnósticos
  getDiagnosticsIds() {
    this.storage.get('DiagnosticsIds')
                .then(val => {
                  this.diagnostics = [];
                  if (val != null) {
                    this.diagnosticsIds = val;
                  }
                  this.diagnosticsIds.forEach(id => {
                    // Recebe uma carteira
                    this.getDiagnostic(id);
                  })
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar seus Diagnósticos. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  // Recebe um diagnóstico
  getDiagnostic(id: number) {
    this.storage.get(`Diagnostic ${id}`)
                .then(val => {
                  this.diagnostics.push(val);
                  console.log(this.diagnostics);
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar suas Diagnósticos. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

}

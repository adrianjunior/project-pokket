import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';

import { Item } from '../../../models/item.inferface';
import { Diagnostic } from '../../../models/diagnostic.interface';

@IonicPage()
@Component({
  selector: 'page-edit-diagnostic',
  templateUrl: 'edit-diagnostic.html',
})
export class EditDiagnosticPage implements OnInit {

  diagnosticId: number;
  diagnostic: Diagnostic;
  itemsIds: number[];
  diagnosticsIds: number[];

  // Form Items
  name: string;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, private storage: Storage,
    private toastCtrl: ToastController, public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.diagnostic = {
      id: 0,
      name: '',
      date: '',
      isConcluded: false
    };
    this.itemsIds = [];
    this.diagnosticsIds = [];
    this.diagnosticId = this.navParams.get('id');
    this.getDiagnostic(this.diagnosticId);
    this.getDiagnosticsIds();
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required]
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

  // Recebe a carteira atual
  getDiagnostic(id: number) {
    this.storage.get(`Diagnostic ${id}`)
                .then(val => {
                  this.diagnostic = val;
                  this.formGroup = this.formBuilder.group({
                    'name': [this.diagnostic.name, Validators.required]
                  });
                })
                .then(() => {
                  this.getDiagnosticItems(id);
                })
                .catch(err => {
                  this.presentToast('Ocorreu um erro ao carregar seu Diagnóstico. Por favor, reinicie o app.', 'bottom', 3000);
                  console.log(err);
                })
  }

  getDiagnosticsIds() {
    this.storage.get('DiagnosticsIds')
                .then(val => {
                  this.diagnosticsIds = val;
                })
  }

  getDiagnosticItems(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Items`)
                .then(val => {
                  if(val != null) {
                    this.itemsIds = val;
                  }
                })
  }

  setDiagnostic(formValue: any, id: number = this.diagnosticId) {
    this.diagnostic.name = formValue.name;
    this.storage.set(`Diagnostic ${id}`, this.diagnostic)
                .then(() => {
                  this.navCtrl.pop();
                })
  }

  setDiagnosticsIds(diagnosticsIds: number[]) {
    this.storage.set('DiagnosticsIds', diagnosticsIds);
  }

  deleteDiagnostic(id: number = this.diagnosticId) {
    this.storage.remove(`Diagnostic ${id}`)
                .then(() => {
                  this.deleteDiagnosticItemNextId(id);
                })
                .then(() => {
                  this.deleteDiagnosticItemsIds(id);
                })
                .then(() => {
                  console.log(`ITEMS IDS ==> ${this.itemsIds}`)
                  this.itemsIds.forEach(itemId => {
                    this.deleteItem(id, itemId);
                  })
                })
                .then(() => {
                  const index = this.diagnosticsIds.indexOf(id);
                  console.log(`INDEX ==> ${index}`);
                  console.log(`DIAGNOSTICSIDS ==> ${this.diagnosticsIds}`);
                  console.log(`DIAGNOSTICID ==> ${id}`)
                  if(index > -1) {
                    this.diagnosticsIds.splice(index, 1)
                    console.log(`DIAGNOSTICSIDS 2 ==> ${this.diagnosticsIds}`);
                    this.setDiagnosticsIds(this.diagnosticsIds);
                  }
                })
                .then(() => {
                  this.navCtrl.popToRoot();
                })
  }

  deleteDiagnosticItemNextId(diagnosticId: number) {
    this.storage.remove(`Diagnostic ${diagnosticId} Next Item id`)
  }

  deleteDiagnosticItemsIds(diagnosticId: number) {
    this.storage.remove(`Diagnostic ${diagnosticId} Items`)
  }

  deleteItem(diagnosticId: number, itemId: number) {
    this.storage.remove(`Diagnostic ${diagnosticId} Item ${itemId}`);
  }
}

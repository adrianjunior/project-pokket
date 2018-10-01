import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Item } from '../../../models/item.inferface'
import { Diagnostic } from '../../../models/diagnostic.interface';

@IonicPage()
@Component({
  selector: 'page-diagnostic-item-profile',
  templateUrl: 'diagnostic-item-profile.html',
})
export class DiagnosticItemProfilePage {

  itemsIds: number[];
  nextId: number;
  isIncome: boolean;
  diagnosticId: number;
  itemId: number;
  whatIs: string;
  item: Item;
  diagnostic: Diagnostic;

  name: string;
  value: number;
  category: string;
  type: number;
  formGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, public storage: Storage,
    public toastCtrl: ToastController) {
  }

  ngOnInit() {
    this.item = {
      id: 0,
      name: '',
      value: 0,
      diagnostic: 0
    }
    this.diagnostic = {
      id: 0,
      name: '',
      date: '',
      isConcluded: false
    }
    this.itemsIds = [];
    this.itemId = this.navParams.get('itemId');
    this.diagnosticId = this.navParams.get('diagnosticId');
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required],
      'value': [null, Validators.required],
      'category': [''],
      'type': [null, Validators.required]
    });
    this.getItem(this.diagnosticId, this.itemId);
    this.getItems(this.diagnosticId);
    this.getDiagnostic(this.diagnosticId);
    if (this.isIncome) {
      this.whatIs = 'Receita'
    } else {
      this.whatIs = 'Despesa'
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

  setItem(formValue: any) {
    let value: number = Number(Number(formValue.value).toFixed(2));
    if (value > 0) {
      if (!this.isIncome) {
        value *= -1;
      }
      let newItem: Item = {
        id: this.itemId,
        name: formValue.name,
        value: value,
        diagnostic: this.diagnosticId
      }
      if (formValue.category != null) {
        newItem.category = formValue.category;
      }
      if (formValue.type != null) {
        newItem.type = formValue.type;
      }
      this.storage.set(`Diagnostic ${this.diagnosticId} Item ${this.item.id}`, newItem)
        .then(() => {
          this.setDiagnostic(this.diagnosticId, this.diagnostic);
        })
        .then(() => {
          this.navCtrl.pop();
        })
        .catch(err => {
          this.presentToast(`Ocorreu um erro ao salvar sua ${this.whatIs}. Por favor, reinicie o app.`, 'bottom', 3000);
          console.log(err);
        })
    } else {
      this.presentToast('O valor não pode ser 0 ou menor.', 'bottom', 3000);
    }
  }

  getItem(diagnosticId: number, itemId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Item ${itemId}`)
      .then(val => {
        if (val != null) {
          this.item = val;
          if (this.item.value > 0) {
            this.isIncome = true;
            this.whatIs = 'Receita'
          } else {
            this.isIncome = false;
            this.whatIs = 'Despesa'
            this.item.value *= -1;
          }
          this.formGroup = this.formBuilder.group({
            'name': [this.item.name, Validators.required],
            'value': [this.item.value, Validators.required],
            'category': [this.item.category],
            'type': [this.item.type, Validators.required]
          });
        }
      })
      .catch(err => {
        this.presentToast(`Ocorreu um erro ao carregar sua ${this.whatIs}. Por favor, reinicie o app.`, 'bottom', 3000);
        console.log(err);
      })
  }

  getItems(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Items`)
      .then(val => {
        if (val != null) {
          this.itemsIds = val;
        }
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar suas Receitas e Despesas. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  setItems(diagnosticId: number, itemsIds: number[]) {
    this.storage.set(`Diagnostic ${diagnosticId} Items`, itemsIds)
  }

  setDiagnostic(id: number, diagnostic: Diagnostic) {
    this.storage.set(`Diagnostic ${id}`, diagnostic);
    console.log(diagnostic);
  }

  getDiagnostic(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId}`)
    .then(val => {
      this.diagnostic = val;
    })
    .catch(err => {
      this.presentToast('Ocorreu um erro ao carregar seu Diagnostico. Por favor, reinicie o app.', 'bottom', 3000);
      console.log(err);
    })
  }

  deleteItem() {
    this.storage.remove(`Diagnostic ${this.diagnosticId} Item ${this.itemId}`)
                .then(() => {
                  let index = this.itemsIds.indexOf(this.itemId);
                  if (index > -1) {
                    this.itemsIds.splice(index, 1);
                    this.setItems(this.diagnosticId, this.itemsIds);
                  }
                })
                .then(() => {
                  this.setDiagnostic(this.diagnosticId, this.diagnostic);
                })
                .then(() => {
                  this.navCtrl.pop();
                })
                .catch(err => {
                  this.presentToast(`Ocorreu um erro ao excluir sua ${this.whatIs}. Por favor, reinicie o app.`, 'bottom', 3000);
                  console.log(err);
                })
  }
}

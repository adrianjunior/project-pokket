import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { Item } from '../../../models/item.inferface'

@IonicPage()
@Component({
  selector: 'page-add-diagnostic-item',
  templateUrl: 'add-diagnostic-item.html',
})
export class AddDiagnosticItemPage implements OnInit {

  itemsIds: number[];
  nextId: number;
  isIncome: boolean;
  diagnosticId: number;
  whatIs: string;

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
    this.itemsIds = [];
    this.isIncome = this.navParams.get('isIncome');
    this.diagnosticId = this.navParams.get('id');
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required],
      'value': [null, Validators.required],
      'category': [''],
      'type': [null, Validators.required]
    });
    this.getItems(this.diagnosticId);
    this.getNextItemId(this.diagnosticId);
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

  addItem(formValue: any, addMore: boolean) {
    let value: number = Number(Number(formValue.value).toFixed(2));
    if (value > 0) {
      if (!this.isIncome) {
        value = value * -1;
      }
      let item: Item = {
        id: this.nextId,
        name: formValue.name,
        value: Number(value.toFixed(2)),
        diagnostic: this.diagnosticId
      }
      if (formValue.category != null) {
        item.category = formValue.category;
      }
      if (formValue.type != null) {
        item.type = formValue.type;
      }
      this.storage.set(`Diagnostic ${this.diagnosticId} Item ${this.nextId}`, item)
        .then(() => {
          this.setItems(this.diagnosticId, this.nextId);
        })
        .then(() => {
          this.nextId += 1;
          this.setNextItemId(this.diagnosticId, this.nextId);
        })
        .then(() => {
          if (addMore) {
            this.formGroup.reset();
          } else {
            this.navCtrl.pop();
          }
          this.presentToast(`Parabéns. Sua ${this.whatIs} foi adicionada com sucesso!`, 'bottom', 3000);
        })
        .catch(err => {
          this.presentToast(`Ocorreu um erro ao salvar sua ${this.whatIs}. Por favor, reinicie o app.`, 'bottom', 3000);
          console.log(err);
        })
    } else {
      this.presentToast('O valor não pode ser 0 ou menor.', 'bottom', 3000);
    }
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

  setItems(diagnosticId: number, id: number) {
    this.itemsIds.push(id);
    this.storage.set(`Diagnostic ${diagnosticId} Items`, this.itemsIds)
  }

  setNextItemId(diagnosticId: number, id: number) {
    this.storage.set(`Diagnostic ${diagnosticId} Next Item id`, id)
  }

  getNextItemId(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Next Item id`)
      .then(val => {
        if (val != null) {
          this.nextId = val;
          console.log(this.nextId);
        } else {
          this.nextId = 1;
        }
      })
  }
}

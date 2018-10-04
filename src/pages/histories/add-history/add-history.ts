import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { History } from '../../../models/history.interface';
import { Diagnostic } from '../../../models/diagnostic.interface';

@IonicPage()
@Component({
  selector: 'page-add-history',
  templateUrl: 'add-history.html',
})
export class AddHistoryPage {

  nextId: number;
  historiesIds: number[];
  diagnosticsIds: number[];
  diagnostics: Diagnostic[];

  // Form Items
  name: string;
  selectedDiagnostics: boolean[];
  selected: number;
  formGroup: FormGroup;

  historyResultsPage: string = `HistoryResultsPage`;
  addDiagnosticPage: string = `AddDiagnosticPage`;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, public formBuilder: FormBuilder,
    private toastCtrl: ToastController) { }

  ngOnInit() {
    this.diagnosticsIds = [];
    this.historiesIds = [];
    this.diagnostics = [];
    this.selectedDiagnostics = [];
    this.selected = 0;
    this.getConcludedDiagnosticsIds();
    this.getHistoriesIds();
    this.formGroup = this.formBuilder.group({
      'name': ['', Validators.required]
    });
  }

  goToAddDiagnostic() {
    this.navCtrl.push(this.addDiagnosticPage);
  }

  updateSelected() {
    this.selected = 0;
    this.selectedDiagnostics.forEach(d => {
      if(d) {
        this.selected += 1;
      }
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

  addHistory(formValue: any) {
    console.log(this.selectedDiagnostics);
    const diagnosticsIds: number[] = [];
    this.selectedDiagnostics.forEach((d, i) => {
      if (d) {
        diagnosticsIds.push(this.diagnostics[i].id)
      }
    })
    let history: History = {
      id: this.nextId,
      name: formValue.name,
      date: moment().format('YYYY-MM-DD'),
      diagnosticsIds: diagnosticsIds
    }
    this.storage.set(`History ${this.nextId}`, history)
      .then(() => {
        this.nextId += 1;
        this.setNextId(this.nextId);
      })
      .then(() => {
        this.historiesIds.push(history.id);
        this.setHistoriesIds(this.historiesIds);
      })
      .then(() => {
        this.navCtrl.pop();
        this.navCtrl.push(this.historyResultsPage, {
          id: this.nextId - 1
        })
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottoms', 3000);
        console.log(err);
      })
  }

  setNextId(id: number) {
    this.storage.set('Next History id', id)
  }

  setHistoriesIds(historiesIds: number[]) {
    this.storage.set('HistoriesIds', historiesIds)
  }

  getHistoriesIds() {
    this.storage.get('HistoriesIds')
      .then(val => {
        if (val != null) {
          this.historiesIds = val;
        }
        console.log(this.historiesIds);
      })
      .then(() => {
        this.getNextId();
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottoms', 3000);
        console.log(err);
      })
  }

  getNextId() {
    this.storage.get('Next History id')
      .then(val => {
        if (val != null) {
          this.nextId = val;
        } else {
          this.nextId = 0;
        }
        console.log((this.nextId));
      })
  }

  getConcludedDiagnosticsIds() {
    this.storage.get('DiagnosticsIds')
      .then(val => {
        if (val != null) {
          this.diagnosticsIds = val;
        }
        console.log(this.diagnosticsIds);
        this.diagnosticsIds.forEach(id => {
          // Recebe um diagnostico
          this.getDiagnostic(id);
        })
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottoms', 3000);
        console.log(err);
      })
  }

  // Recebe um diagnóstico
  getDiagnostic(id: number) {
    this.storage.get(`Diagnostic ${id}`)
      .then(val => {
        if (val != null) {
          val.date = moment(val.date).locale('pt-br').format('L');
        }
        this.diagnostics.push(val);
        console.log(this.diagnostics);
        if (this.diagnostics.length >= this.diagnosticsIds.length) {
          this.diagnostics.forEach((diagnostic, i) => {
            if(!diagnostic.isConcluded) {
              this.diagnostics.splice(i, 1);
              this.diagnosticsIds.splice(i, 1);
              console.log("SPLICE")
            }
          })
        }
      })
  }
}

import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import moment from 'moment';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Diagnostic } from '../../../models/diagnostic.interface';

@IonicPage()
@Component({
  selector: 'page-add-diagnostic',
  templateUrl: 'add-diagnostic.html',
})
export class AddDiagnosticPage implements OnInit {

  nextId: number;
  diagnosticsIds: number[];

  // Form Items
  name: string;
  formGroup: FormGroup;

  addDiagnosticOptionsPage: string = `AddDiagnosticOptionsPage`;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, public formBuilder: FormBuilder,
    private toastCtrl: ToastController) { }

    ngOnInit() {
      this.diagnosticsIds = [];
      this.getDiagnosticsIds();
      this.formGroup = this.formBuilder.group({
        'name': ['', Validators.required],
        'balance': [null, Validators.required],
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
    
    addDiagnostic(formValue: any) {
      let diagnostic: Diagnostic = {
        id: this.nextId,
        name: formValue.name,
        date: moment().format('YYYY-MM-DD')
      }
      this.storage.set(`Diagnostic ${this.nextId}`, diagnostic)
                  .then(() => {
                    this.nextId += 1;
                    this.setNextId(this.nextId);
                  })
                  .then(() => {
                    this.diagnosticsIds.push(diagnostic.id);
                    this.setDiagnosticsIds(this.diagnosticsIds);
                  })
                  .then(() => {
                    this.navCtrl.push(this.addDiagnosticOptionsPage, {
                      id: this.diagnosticsIds
                    })
                  })
                  .catch(err => {
                    this.presentToast('Ocorreu um erro. Volte para a página inicial e tente novamente.', 'bottoms', 3000);
                    console.log(err);
                  })
    }

    setNextId(id: number) {
      this.storage.set('Next Diagnostic id', id)
    }

    setDiagnosticsIds(diagnosticsIds: number[]) {
      this.storage.set('DiagnosticsIds', diagnosticsIds)
    }

    getDiagnosticsIds() {
      this.storage.get('DiagnosticsIds')
        .then(val => {
          if (val != null) {
            this.diagnosticsIds = val;
          }
          console.log(this.diagnosticsIds);
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
      this.storage.get('Next Diagnostic id')
        .then(val => {
          if (val != null) {
            this.nextId = val;
          } else {
            this.nextId = 1;
          }
          console.log((this.nextId));
        })
    }
}

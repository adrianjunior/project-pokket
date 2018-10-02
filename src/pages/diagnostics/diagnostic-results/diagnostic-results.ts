import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import moment from 'moment';

import { Diagnostic } from '../../../models/diagnostic.interface';
import { Item } from '../../../models/item.inferface';
import colors from '../../../assets/data/colors';


@IonicPage()
@Component({
  selector: 'page-diagnostic-results',
  templateUrl: 'diagnostic-results.html',
})
export class DiagnosticResultsPage implements OnInit {

  @ViewChild('chart') chart;
  chartEl: any;
  chartData: number[] = [];
  chartLabels: string[] = [];
  chartType: string;

  section: number;
  expenseType: number;

  haveData: boolean;
  isEditable: boolean;
  isExpense: boolean;

  diagnosticId: number;
  diagnostic: Diagnostic;
  itemsIds: number[];
  items: Item[];

  constructor(public navCtrl: NavController, private storage: Storage,
    private navParams: NavParams, public appCtrl: App, public toastCtrl: ToastController,
    public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.section = 0;
    this.expenseType = 0;
    this.isExpense = false;
    this.isEditable = false;
    this.diagnosticId = this.navParams.get('diagnosticId');
    this.chartType = 'pie';
    this.items = [];
    this.itemsIds = [];
    this.getDiagnostic(this.diagnosticId);
    this.getDiagnosticItems(this.diagnosticId);
  }

  ionViewWillEnter() {
    if (this.section != 0) {
      this.getDiagnostic(this.diagnosticId);
      this.getDiagnosticItems(this.diagnosticId);
    }
  }

  createChart(categoryName: string) {
    Chart.defaults.global.legend.position = 'top';
    this.chartEl = new Chart(this.chart.nativeElement, {
      type: this.chartType,
      data: {
        labels: this.chartLabels,
        datasets: [{
          label: categoryName,
          data: this.chartData,
          duration: 500,
          easing: 'easeInQuart',
          backgroundColor: colors
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        animation: {
          duration: 1000
        },
        legend: {
          labels: {
            fontFamily: 'Roboto',
          }
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let dataset = data.datasets[tooltipItem.datasetIndex];
              let meta = dataset._meta[Object.keys(dataset._meta)[0]];
              let total = meta.total;
              let currentValue = dataset.data[tooltipItem.index];
              let percentage = parseFloat((currentValue / total * 100).toFixed(1));
              return currentValue + ' (' + percentage + '%)';
            },
            title: function (tooltipItem, data) {
              return data.labels[tooltipItem[0].index];
            }
          }
        },
      }
    });
  }

  onSelectSection() {
    switch (this.section) {
      case 0:
        this.isEditable = false;
        this.isExpense = false;
        this.chartType = 'bar';
        this.getDiagnostic(this.diagnosticId);
        this.getDiagnosticItems(this.diagnosticId);
        break;
      case 1:
        this.categoryNumber = 0;
        this.category = categories[0];
        this.isEditable = true;
        this.isExpense = false;
        this.expenseType = 0;
        this.chartType = 'pie';
        this.getDiagnostic(this.diagnosticId);
        this.getDiagnosticItems(this.diagnosticId);
        break;
      case 2:
        this.isExpense = true;
        this.isEditable = false;
        this.chartType = 'pie';
        this.getDiagnostic(this.diagnosticId);
        this.getDiagnosticItems(this.diagnosticId);
        break;
    }
    console.log(this.category);
  }

  onSelectSpentType() {
    switch (this.expenseType) {
      case 0:
        this.loadData(null, 'Total Spent Values');
        this.isEditable = false;
        break;
      case 1:
        this.categoryNumber = 1;
        this.category = categories[1];
        this.loadData(this.categoryNumber, this.category.name);
        this.isEditable = true;
        break;
      case 2:
        this.categoryNumber = 2;
        this.category = categories[2];
        this.loadData(this.categoryNumber, this.category.name);
        this.isEditable = true;
        break;
      case 3:
        this.categoryNumber = 3;
        this.category = categories[3];
        this.loadData(this.categoryNumber, this.category.name);
        this.isEditable = true;
        break;
      case 4:
        this.categoryNumber = 4;
        this.category = categories[4];
        this.loadData(this.categoryNumber, this.category.name);
        this.isEditable = true;
        break;
    }
    console.log(this.category);
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

  // Recebe um diagnóstico
  getDiagnostic(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId}`)
      .then(val => {
        if (val != null) {
          val.date = moment(val.date).locale('pt-br').format('L');
        }
        this.diagnostic = val;
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar seu Resultado. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  getDiagnosticItems(diagnosticId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Items`)
      .then(val => {
        if (val != null) {
          this.itemsIds = val
        }
        this.itemsIds.forEach(id => {
          this.getDiagnosticItem(diagnosticId, id)
        })
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar seu Resultado. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  getDiagnosticItem(diagnosticId: number, itemId: number) {
    this.storage.get(`Diagnostic ${diagnosticId} Item ${itemId}`)
      .then(val => {
        if (val != null) {
          this.items.push(val);
        }
      })
  }
}

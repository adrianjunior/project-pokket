import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import moment from 'moment';

import { Diagnostic } from '../../../models/diagnostic.interface';
import { Item } from '../../../models/item.inferface';
import colors from '../../../assets/data/colors';
import { History } from '../../../models/history.interface';

@IonicPage()
@Component({
  selector: 'page-history-results',
  templateUrl: 'history-results.html',
})
export class HistoryResultsPage implements OnInit {
  @ViewChild('chart') chart;
  chartEl: any;
  chartType: string = 'line';

  historyId: number;
  history: History;
  diagnostics: Diagnostic[];
  diagnosticsIds: number[];
  diagnosticsItemsIds;
  diagnosticsItems;

  section: number = 0;z
  hasData: boolean = false;

  constructor(public navCtrl: NavController, private storage: Storage,
    private navParams: NavParams, public appCtrl: App, public toastCtrl: ToastController,
    public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.history = {
      id: 0,
      name: '',
      date: '',
      diagnosticsIds: []
    }
    this.diagnostics = [];
    this.diagnosticsIds = [];
    this.diagnosticsItemsIds = [];
    this.diagnosticsItems = [];
    this.historyId = this.navParams.get('id');
    this.getHistory(this.historyId);
  }

  onSelectSection() {
    this.getHistory(this.historyId);
  }

  getSectionData(items: Item[][], section: number) {
    const dataset: any[][] = [];
    let incomes: number[] = [];
    let expenses: number[] = [];
    let fixedCompulsory: number[] = [];
    let fixedOptional: number[] = [];
    let variableCompulsory: number[] = [];
    let variableOptional: number[] = [];
    const dates: string[] = [];
    this.diagnosticsIds.forEach((id, i) => {
      let income = 0;
      let expense = 0;
      let fce = 0;
      let foe = 0;
      let vce = 0;
      let voe = 0;
      items[i].forEach((item, j) => {
        if (item.value > 0) {
          income += item.value;
        } else {
          expense += item.value;
          if (item.type == 1) {
            fce += item.value;
          } else if (item.type == 2) {
            foe += item.value;
          } else if (item.type == 3) {
            vce += item.value;
          } else if (item.type == 4) {
            voe += item.value;
          }
        }
        if (j >= items[i].length - 1) {
          incomes.push(income);
          expenses.push(expense);
          fixedCompulsory.push(fce);
          fixedOptional.push(foe);
          variableCompulsory.push(vce);
          variableOptional.push(voe);
        }
      })
      dates.push(this.diagnostics[i].date)
    })
    expenses = expenses.map(num => num*-1);
    fixedCompulsory = fixedCompulsory.map(num => num*-1);
    fixedOptional = fixedOptional.map(num => num*-1);
    variableCompulsory = variableCompulsory.map(num => num*-1);
    variableOptional = variableOptional.map(num => num*-1);
    if (section == 0) {
      dataset[0] = ['Receitas', ...incomes];
      dataset[1] = ['Despesas', ...expenses];
    } else if (section == 1) {
      dataset[0] = ['Fixo Obrigatório', ...fixedCompulsory];
      dataset[1] = ['Fixo Opcional', ...fixedOptional];
      dataset[2] = ['Variável Obrigatório', ...variableCompulsory];
      dataset[3] = ['Variável Opcional', ...variableOptional];
    }
    this.createChart(dataset, dates);
  }

  createChart(dataset: any[][], dates: string[]) {
    Chart.defaults.global.legend.position = 'top';
    this.chartEl = new Chart(this.chart.nativeElement, {
      type: this.chartType,
      data: {
        labels: dates,
        datasets: [],
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
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              let dataset = data.datasets[tooltipItem.datasetIndex];
              let meta = dataset._meta[Object.keys(dataset._meta)[0]];
              let total = meta.total;
              let currentValue = dataset.data[tooltipItem.index];
              return `R$${currentValue.toFixed(2).toString().replace(".", ",")}`;
            },
            title: function (tooltipItem, data) {
              return data.labels[tooltipItem[0].index];
            }
          }
        },
      }
    });
    dataset.forEach((labelDataset, index) => {
      const label = labelDataset.shift();
      const data = labelDataset;
      if (labelDataset.length != 0) {
        this.chartEl.data.datasets.push({
          label: label,
          data: data, 
          duration: 500,
          easing: 'easeInQuart',
          fill: false,
          borderColor: colors[index],
          borderWidth: 3,
          backgroundColor: colors[index],
          lineTension: 0,
          pointRadius: 3
        })
        this.chartEl.update();
      }
    })
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

  getHistory(historyId: number) {
    this.storage.get(`History ${historyId}`)
      .then(val => {
        if (val != null) {
          val.date = moment(val.date).locale('pt-br').format('L');
        }
        this.history = val;
      })
      .then(() => {
        this.getDiagnosticsItems(this.history);
      })
      .then(() => {
        this.getDiagnostics(this.history);
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar seu Resultado. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  getDiagnosticsItems(history: History) {
    this.diagnosticsIds = history.diagnosticsIds;
    history.diagnosticsIds.forEach((diagnosticIds, i) => {
      this.diagnosticsItemsIds[i] = []
      this.diagnosticsItems[i] = []
    })
    history.diagnosticsIds.forEach((diagnosticId, i) => {
      this.storage.get(`Diagnostic ${diagnosticId} Items`)
        .then(val => {
          if (val != null) {
            val.forEach(id => {
              this.diagnosticsItemsIds[i].push(id);
            })
          } else {
            this.hasData = false;
          }
          this.diagnosticsItemsIds[i].forEach(id => {
            this.getDiagnosticItem(diagnosticId, id, this.section, i)
          })
        })
    })
  }

  getDiagnosticItem(diagnosticId: number, itemId: number, section: number, diagnosticIndex: number) {
    this.hasData = true;
    this.storage.get(`Diagnostic ${diagnosticId} Item ${itemId}`)
      .then(val => {
        if (val != null) {
          this.diagnosticsItems[diagnosticIndex].push(val);
        }
        if (diagnosticIndex >= this.diagnosticsIds.length - 1) {
          if (this.diagnosticsItems[diagnosticIndex].length >= this.diagnosticsItemsIds[diagnosticIndex].length) {
            this.getSectionData(this.diagnosticsItems, section)
          }
        }
      })
  }

  getDiagnostics(history: History) {
    history.diagnosticsIds.forEach((diagnosticId, i) => {
      this.storage.get(`Diagnostic ${diagnosticId}`)
        .then(val => {
          if (val != null) {
            this.diagnostics.push(val);
          }
        })
    })
  }
}

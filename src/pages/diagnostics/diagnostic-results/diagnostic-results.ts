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
  show: number;

  hasData: boolean;
  isExpense: boolean;
  isShowable: boolean;

  diagnosticId: number;
  diagnostic: Diagnostic;
  itemsIds: number[];
  items: Item[];

  diagnosticProfilePage: string = `DiagnosticProfilePage`;

  constructor(public navCtrl: NavController, private storage: Storage,
    private navParams: NavParams, public appCtrl: App, public toastCtrl: ToastController,
    public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.diagnostic = {
      id: 0,
      name: '',
      date: '',
      isConcluded: false
    }
    this.hasData = false;
    this.section = 0;
    this.expenseType = 0;
    this.show = 0;
    this.isExpense = false;
    this.isShowable = false;
    this.diagnosticId = this.navParams.get('diagnosticId');
    this.chartType = 'pie';
    this.items = [];
    this.itemsIds = [];
  }

  ionViewWillEnter() {
    this.getDiagnostic(this.diagnosticId);
    this.getDiagnosticItems(this.diagnosticId, true, 0);
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
              return `R$${currentValue.toFixed(2).toString().replace(".", ",")} (${percentage}%)`;
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
    if(this.section == 0) {
      this.isShowable = false;
      this.isExpense = false;
      this.getDiagnosticItems(this.diagnosticId, true, 0);
    } else if (this.section == 1) {
      this.isShowable = true;
      this.isExpense = false;
      this.getDiagnosticItems(this.diagnosticId, false, 0);
    } else if (this.section == 2) {
      this.isShowable = false;
      this.isExpense = true;
      this.expenseType = 0;
      this.getDiagnosticItems(this.diagnosticId, true, 1);
    }
  }

  onSelectExpenseType() {
    if (this.expenseType > 0) {
      this.isShowable = true;
      this.show = 0;
      this.getDiagnosticItems(this.diagnosticId, false, this.expenseType);
    } else {
      this.isShowable = false;
      this.show = 0;
      this.getDiagnosticItems(this.diagnosticId, true, 1);
    }
  }

  onSelectShow() {
    let type: number;
    if (this.section == 1) {
      type = 0;
    } else if (this.section == 2) {
      type = this.expenseType;
    }
    
    this.getItemData(this.items, type);
  }

  getItemData(items: Item[], type: number) {
    let values: number[] = [];
    let names: string[] = [];
    if (this.show == 0) {
      items.filter(item => {
        if (type == 0) {
          return item.value > 0;
        } else if (type <= 4) {
          return item.type == type;
        }
      }).forEach(item => {
        if (type > 0) {
          item.value *= -1;
        }
        values.push(item.value);
        names.push(item.name);
      })
    } else {
      items.filter(item => {
        if (type == 0) {
          return item.value > 0;
        } else if (type <= 4) {
          return item.type == type;
        }
      }).forEach(item => {
        if (item.category == null) {
          item.category = 'Sem Categoria'
        }
        if(names.length == 0) {
          if (type > 0) {
            item.value *= -1;
          }
          names.push(item.category)
          values.push(item.value)
        } else {
          if(names.find(category => category === item.category) == undefined){
            if (type > 0) {
              item.value *= -1;
            }
            names.push(item.category)
            values.push(item.value)
          } else {
            const index = names.indexOf(item.category)
            values[index] += item.value;
          }
        }
      })
    }
    this.chartData = [...values];
    this.chartLabels = [...names];
    let name;
    if (type == 0) {
      name = 'Receitas;'
    } else if (type == 1) {
      name = 'Despesas Fixas Obrigatórias'
    } else if (type == 2) {
      name = 'Despesas Fixas Opcionais'
    } else if (type == 3) {
      name = 'Despesas Variáveis Obrigatórias'
    } else if (type == 4) {
      name = 'Despesas Variáveis Opcionais'
    }
    this.createChart(name);
  }

  getTypeData(items: Item[], type: number) {
    console.log(type, items)
    if (type == 0) {
      // Receitas x Despesas
      let incomeSum = 0;
      let expenseSum = 0;
      const incomeList = items.filter(item => item.value > 0)
      console.log(...incomeList)
      incomeList.forEach(item => {
        incomeSum += item.value;
        console.log('income ' + item.value)
      })
      const expenseList = items.filter(item => item.value < 0)
      console.log(...expenseList)
      expenseList.forEach(item => {
        expenseSum += item.value;
        console.log('expense ' + item.value)
      })
      this.chartData = [incomeSum, expenseSum * -1];
      this.chartLabels = ['Receitas', 'Despesas'];
      this.createChart('Receitas e Despesas');
    } else if (type == 1) {
      // Tipos de Despesas
      let fceSum = 0;
      let foeSum = 0;
      let vceSum = 0;
      let voeSum = 0;
      const fce = items.filter(item => item.type == 1)
        .forEach(item => {
          fceSum += item.value;
        })
      const foe = items.filter(item => item.type == 2)
        .forEach(item => {
        foeSum += item.value;
      })
      const vce = items.filter(item => item.type == 3)
        .forEach(item => {
        vceSum += item.value;
      })
      const voe = items.filter(item => item.type == 4)
        .forEach(item => {
        voeSum += item.value;
      })
      this.chartData = [fceSum * -1, foeSum * -1, vceSum * -1, voeSum * -1];
      this.chartLabels = ['Fixa Obrigatória', 'Fixa Opcional', 'Variável Obrigatória', 'Variável Opcional'];
      this.createChart('Despesas');
    }
  }

  goToDiagnosticProfile() {
    this.navCtrl.push(this.diagnosticProfilePage, {
      id: this.diagnosticId
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

  getDiagnosticItems(diagnosticId: number, isTypeData: boolean, type: number) {
    this.items = [];
    this.storage.get(`Diagnostic ${diagnosticId} Items`)
      .then(val => {
        if (val != null) {
          this.itemsIds = val
          if (this.itemsIds.length <= 0) {
            this.hasData = false;
          }
        } else {
          this.hasData = false;
        }
        this.itemsIds.forEach(id => {
          this.getDiagnosticItem(diagnosticId, id, isTypeData, type)
        })
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar seu Resultado. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  getDiagnosticItem(diagnosticId: number, itemId: number, isTypeData: boolean, type: number) {
    this.hasData = true;
    this.storage.get(`Diagnostic ${diagnosticId} Item ${itemId}`)
      .then(val => {
        if (val != null) {
          this.items.push(val);
        }
        console.log(`ITEMS ${this.items.length} X ${this.itemsIds.length} IDS`)
        if (this.items.length >= this.itemsIds.length) {

          if (isTypeData) {
            this.getTypeData(this.items, type)
          } else {
            this.getItemData(this.items, type)
          }
        }
      })
  }
}

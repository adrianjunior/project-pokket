import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import moment from 'moment';

import { Wallet } from '../../../models/wallet.interface';
import { Transaction } from '../../../models/transaction.interface';
import colors from '../../../assets/data/colors';

@IonicPage()
@Component({
  selector: 'page-wallet-result',
  templateUrl: 'wallet-result.html',
})
export class WalletResultPage implements OnInit {

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

  walletId: number;
  wallet: Wallet;
  transactionsIds: number[];
  transactions: Transaction[];

  walletProfilePage: string = `WalletProfilePage`;

  constructor(public navCtrl: NavController, private storage: Storage,
    private navParams: NavParams, public appCtrl: App, public toastCtrl: ToastController,
    public viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.wallet = {
      id: 0,
      name: '',
      balance: 0
    }
    this.hasData = false;
    this.section = 0;
    this.expenseType = 0;
    this.show = 0;
    this.isExpense = false;
    this.isShowable = false;
    this.walletId = this.navParams.get('id');
    this.chartType = 'pie';
    this.transactions = [];
    this.transactionsIds = [];
  }

  ionViewWillEnter() {
    this.getWallet(this.walletId);
    this.getWalletTransactions(this.walletId, true, 0);
  }

  createChart(categoryName: string) {
    console.log(`CHART LABELS: ${this.chartLabels}`);
    console.log(`CHART DATA: ${this.chartData}`);
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
      this.isExpense = false;
      this.isShowable = false;
      this.getWalletTransactions(this.walletId, true, 0);
    } else if (this.section == 1) {
      this.isExpense = false;
      this.isShowable = true;
      this.show = 0;
      this.getWalletTransactions(this.walletId, false, 0);
    } else if (this.section == 2) {
      this.isExpense = true;
      this.isShowable = false;
      this.expenseType = 0;
      this.show = 0;
      this.getWalletTransactions(this.walletId, true, 1);
    }
  }

  onSelectExpenseType() {
    if (this.expenseType > 0) {
      this.isShowable = true;
      this.show = 0;
      this.getWalletTransactions(this.walletId, false, this.expenseType);
    } else {
      this.isShowable = false;
      this.show = 0;
      this.getWalletTransactions(this.walletId, true, 1);
    }
  }

  onSelectShow() {
    let type: number;
    if (this.section == 1) {
      type = 0;
    } else if (this.section == 2) {
      type = this.expenseType;
    }
    
    this.getTransactionData(this.transactions, type);
  }

  getTransactionData(transactions: Transaction[], type: number) {
    let values: number[] = [];
    let names: string[] = [];    
    if (this.show == 0) {
      transactions.filter(transaction => {
        if (type == 0) {
          return transaction.value > 0;
        } else if (type <= 4) {
          return transaction.type == type;
        }
      }).forEach(transaction => {
        if (type > 0) {
          transaction.value *= -1;
        }
        values.push(transaction.value);
        names.push(transaction.name);
      })
    } else {
      transactions.filter(transaction => {
        if (type == 0) {
          return transaction.value > 0;
        } else if (type <= 4) {
          return transaction.type == type;
        }
      }).forEach(transaction => {
        if (transaction.category == null) {
          transaction.category = 'Sem Categoria'
        }
        if(names.length == 0) {
          if (type > 0) {
            transaction.value *= -1;
          }
          names.push(transaction.category)
          values.push(transaction.value)
        } else {
          if(names.find(category => category === transaction.category) == undefined){
            if (type > 0) {
              transaction.value *= -1;
            }
            names.push(transaction.category)
            values.push(transaction.value)
          } else {
            const index = names.indexOf(transaction.category)
            values[index] += transaction.value;
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

  getTypeData(transactions: Transaction[], type: number) {
    if (type == 0) {
      // Receitas x Despesas
      let incomeSum = 0;
      let expenseSum = 0;
      const incomeList = transactions.filter(transaction => transaction.value > 0)
      incomeList.forEach(transaction => {
        incomeSum += transaction.value;
      })
      const expenseList = transactions.filter(transaction => transaction.value < 0)
      expenseList.forEach(transaction => {
        expenseSum += transaction.value;
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
      const fce = transactions.filter(transaction => transaction.type == 1)
        .forEach(transaction => {
          fceSum += transaction.value;
        })
      const foe = transactions.filter(transaction => transaction.type == 2)
        .forEach(transaction => {
        foeSum += transaction.value;
      })
      const vce = transactions.filter(transaction => transaction.type == 3)
        .forEach(transaction => {
        vceSum += transaction.value;
      })
      const voe = transactions.filter(transaction => transaction.type == 4)
        .forEach(transaction => {
        voeSum += transaction.value;
      })
      this.chartData = [fceSum * -1, foeSum * -1, vceSum * -1, voeSum * -1];
      this.chartLabels = ['Fixa Obrigatória', 'Fixa Opcional', 'Variável Obrigatória', 'Variável Opcional'];
      this.createChart('Despesas');
    }
  }

  goToWalletProfile() {
    this.navCtrl.push(this.walletProfilePage, {
      id: this.walletId
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
  getWallet(walletId: number) {
    this.storage.get(`Wallet ${walletId}`)
      .then(val => {
        this.wallet = val;
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar seu Resultado. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  getWalletTransactions(walletId: number, isTypeData: boolean, type: number) {
    this.transactions = [];
    this.storage.get(`Wallet ${walletId} Transactions`)
      .then(val => {
        if (val != null) {
          this.transactionsIds = val
          if (this.transactionsIds.length <= 0) {
            this.hasData = false;
          }
        } else {
          this.hasData = false;
        }
        this.transactionsIds.forEach(id => {
          this.getWalletTransaction(walletId, id, isTypeData, type)
        })
      })
      .catch(err => {
        this.presentToast('Ocorreu um erro ao carregar seu Resultado. Por favor, reinicie o app.', 'bottom', 3000);
        console.log(err);
      })
  }

  getWalletTransaction(walletId: number, transactionId: number, isTypeData: boolean, type: number) {
    this.hasData = true;
    this.storage.get(`Wallet ${walletId} Transaction ${transactionId}`)
      .then(val => {
        if (val != null) {
          this.transactions.push(val);
          console.log('PASSOU');
        }
        if (this.transactions.length >= this.transactionsIds.length) {          
          if (isTypeData) {
            this.getTypeData(this.transactions, type)
          } else {
            this.getTransactionData(this.transactions, type)
          }
        }
      })
  }
}

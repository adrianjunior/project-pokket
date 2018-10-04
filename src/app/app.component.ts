import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import * as moment from 'moment';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = `MyWalletsPage`;

  pages: Array<{title: string, component: string, icon: string, enabled: boolean}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Minhas Carteiras', component: `MyWalletsPage`, icon: 'cash', enabled: true },
      { title: 'Meus Diagnósticos', component: `MyDiagnosticsPage`, icon: 'clipboard', enabled: true },
      { title: 'Meu Histórico', component: `MyHistoriesPage`, icon: 'trending-up', enabled: true },
      { title: 'Exportar Planilha', component: `MyWalletsPage`, icon: 'open', enabled: false },
      { title: 'Backup', component: `MyWalletsPage`, icon: 'cloud-done', enabled: false },
      { title: 'Ajuda', component: `MyWalletsPage`, icon: 'help-circle', enabled: false },
      { title: 'Configuração', component: `MyWalletsPage`, icon: 'settings', enabled: false },
      { title: 'Sobre o Aplicativo', component: `MyWalletsPage`, icon: 'information-circle', enabled: false },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

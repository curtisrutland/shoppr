import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListService } from '../services/list.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private alertCtrl: AlertController,
    private listSvc: ListService
  ) {
    this.initializeApp();

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
  
  home() {
    this.nav.setRoot(HomePage);
  }

  promptDeleteLists() {
    this.alertCtrl.create({
      title: "Are you sure?",
      message: "Are you sure you want to delete ALL your lists? There is no way to undo this.",
      buttons: ["Cancel", {
        text: "Yes I'm Sure",
        cssClass: "red",
        handler: () => { this.listSvc.clearAllLists(); }
      }]
    }).present();
  }

}

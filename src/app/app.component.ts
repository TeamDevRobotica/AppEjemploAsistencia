import { Component, ViewChildren, QueryList } from '@angular/core';
import { Plugins, StatusBarStyle } from '@capacitor/core';
import { Platform, IonRouterOutlet, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // for storing the returned subscription
  backButtonSubscription;
  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private router: Router,
    public alertController: AlertController
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    const { SplashScreen, StatusBar } = Plugins;
    try {
      this.backButtonEvent();
      await SplashScreen.hide();
      await StatusBar.setStyle({ style: StatusBarStyle.Light });
      if (this.platform.is('android')) {
        StatusBar.setBackgroundColor({ color: '#CDCDCD' });
      }
    } catch (err) {
      console.log('This is normal in a browser', err);
    }
  }


  backButtonEvent() {
    this.backButtonSubscription = this.platform.backButton.subscribe(async () => {
      this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
        if (outlet && outlet.canGoBack()) {
          outlet.pop();
        } else if (this.router.url === "/") {
          this.presentAlertConfirm();
        }
      });
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: 'Quiere salir de la app !!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirmar Cancelar: blah');
          }
        }, {
          text: 'Salir',
          handler: () => {
            console.log('Confirm Okay');
            navigator["app"].exitApp();
          }
        }
      ]
    });
    await alert.present();
  }


  //Called when view is left
  ngOnDestroy() {
    // Unregister the custom back button action for this page
    this.backButtonSubscription.unsubscribe();
  }


}

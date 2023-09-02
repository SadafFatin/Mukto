import {
  LoadingController,
  NavController,
  MenuController,
  ToastController,
  ModalController,
  AlertController,
} from '@ionic/angular';
import { Injectable } from '@angular/core';
import { GlobalProvider } from 'src/app/services/global';
import { NavigationExtras } from '@angular/router';

import { Browser } from '@capacitor/browser';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class BaseHelper {
  gLoading;
  supplierCache = [];

  constructor(
    protected loadingCtrl: LoadingController,
    protected toastController: ToastController,
    protected alert: AlertController,
    protected modal: ModalController,
    protected navCtrl: NavController,
    protected g: GlobalProvider,
    protected menu: MenuController,
  ) {
    this.initLoadLoading();
  }
  menuOpen() {
    console.log(`menu open`);
    this.menu.enable(true);
  }
  menuClose() {
    console.log(`menu close`);
    this.menu.enable(false);
  }

  async openTab(url) {

    // const browser = this.iab.create(url);
    //browser.show();
    this.openCapacitorSite(url);

  }


  openCapacitorSite = async (url) => {
    await Browser.open({ url });
  };


  async toast(message, duration = 1000, color = `success`) {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      buttons: [
        {
          icon: 'close',
          role: 'cancel',
          // handler: () => {
          //   console.log('Cancel clicked');
          // },
        },
      ],
    });
    toast.present();
  }
  async initLoadLoading() {
    this.gLoading = await this.loadingCtrl.create({
      message: 'Please Wait...',
      duration: 5000,
    });
  }
  async loadLoading(toggle = true) {
    if (toggle) {
      if (!this.gLoading) {
        await this.initLoadLoading();
      }
      this.gLoading.present();
    } else {
      if (this.gLoading) {
        await this.gLoading.dismiss();
      }

      this.initLoadLoading();
    }
    return;
  }
  async loadAlert(header, msg) {
    const alert = await this.alert.create({
      header,
      message: msg,
      buttons: ['Ok'],
    });
    alert.present();

  }

  async setStorage(key, value) {
    //await this.storage.set(key, value);
  }
  async getStorage(key) {
    //return await this.storage.get(key);
  }

  setJws(tokenObj, profile, userXCompany) {
    console.log(`userXCompany`, tokenObj);
    this.setStorage('companyToken', tokenObj);
    this.g.jws = tokenObj.token;
    this.g.profile = profile;
    this.g.role = this.g.profile.companyProfiles[0].userXCompany.role;
    this.g.accessRole = userXCompany && userXCompany.accessRole;
  }
  async clearJws() {
    this.setStorage('companyToken', null);
    this.g.jws = null;
    this.g.profile = null;
    this.g.notifications = [];
    this.g.accessRole = null;
    this.g.role = null;
    this.g.auditLogAllow = false;
    this.g.docShareAllow = false;
  }
  async getJws() {
    return await this.getStorage('companyToken');
  }
  navigateRoot(path, queryParams = null) {
    if (queryParams) {
      const navigationExtras: NavigationExtras = {
        queryParams,
      };
      this.navCtrl.navigateRoot(path, navigationExtras);
    } else {
      this.navCtrl.navigateRoot(path);
    }
  }

  navigateWithParam(path, queryParams) {
    if (queryParams) {
      const navigationExtras: NavigationExtras = {
        queryParams,
      };
      this.navCtrl.navigateForward(path, navigationExtras);
    } else {
      this.navCtrl.navigateForward(path);
    }
  }


  navigate(path) {
    this.navCtrl.navigateForward(path);
  }
  navigateBack(path) {
    this.navCtrl.navigateBack(path);
  }



  async writeImage(data: string) {
    this.toast('Writing file...Please wait');

    const file = await Filesystem.writeFile({
      path: 'unique_text.pdf',
      data,
      directory: Directory.Documents,
    });
    console.log(file.uri);

  }



  public getValueFromObservable(obj: Observable<any>) {
    let value: any;
    obj.subscribe(v => value = v);
    return value;
  }









}

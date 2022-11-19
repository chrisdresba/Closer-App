import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SplashScreen } from '@capacitor/splash-screen';
//import { Plugins } from '@capacitor/core';
//const {SplashScreen} = Plugins;
//import { SplashScreen } from '@capacitor/splash-screen';


@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(private router: Router) {

  setTimeout(() => {
      this.router.navigateByUrl('login')
    }, 3000);
   }

  async ngOnInit() {
    await SplashScreen.hide();
  }
  async ionViewWillEnter(){
    await SplashScreen.hide();
  }

 /* async ionViewWillEnter(){
    //Plugins.SplashScreen.hide() 
    await SplashScreen.hide();
  } */

}
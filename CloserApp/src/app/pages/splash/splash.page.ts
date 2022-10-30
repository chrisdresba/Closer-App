import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const {SplashScreen} = Plugins;

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

  ngOnInit() {
    
  }

  ionViewWillEnter(){
    Plugins.SplashScreen.hide() 
  }

}
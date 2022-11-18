import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-juegos',
  templateUrl: './menu-juegos.page.html',
  styleUrls: ['./menu-juegos.page.scss'],
})
export class MenuJuegosPage implements OnInit {

  constructor(private toast: ToastController, private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }
  async presentToast(header: string, message: string, color: string) {
    const toast = await this.toast.create({
      header,
      message,
      color,
      duration: 2000,
      position: "middle"
    });
    toast.present();
  }

  Logout() {
    localStorage.removeItem('sesionRol');
    this.authService.logout();
    this.router.navigate(["login"]);
  }

  back() {
    this.router.navigate(["home"]);
  }

}

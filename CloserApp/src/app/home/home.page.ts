import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { MesaService } from '../services/mesa.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  usuario: any;
  usuarioLogin: string;
  rol: string;

  constructor(private authService: AuthService, private router: Router, public afAuth: AngularFireAuth,public servMesa:MesaService,public toastSrv: ToastService, private toast: ToastController) {

  }

  ngOnInit(): void {
    if (localStorage.getItem('sesionRol')) {
      this.rol = localStorage.getItem('sesionRol');
      console.log(this.rol);
    }
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
        this.usuarioLogin = this.usuario.email;
      }
    })
  }

  async logout() {
    await this.authService.logout();
    localStorage.removeItem('sesionRol');
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  gestionarUsuarios() {
    this.router.navigateByUrl('usuarios', { replaceUrl: true });
  }

  realizarPedido() {
    this.router.navigateByUrl('pedido', { replaceUrl: true });
  }

  realizarEncuesta() {
    this.router.navigateByUrl('encuesta', { replaceUrl: true });
  }

  ingresarListaEspera() {
    try {
    this.servMesa.agregarUsuarioListaEspera(this.usuarioLogin);
      this.presentToast("Lista de Espera", "Ya te encuentras en la lista de espera!", "success");
    } catch (error) {
    
      console.log(error);
    }
  
  }

  verListaEspera() {
    this.router.navigateByUrl('espera', { replaceUrl: true });
  }

  async presentToast(header: string, message: string, color: string) {
    const toast = await this.toast.create({
      header,
      message,
      color,
      duration: 2500,
      position: "middle"
    });
    toast.present();
  }

}

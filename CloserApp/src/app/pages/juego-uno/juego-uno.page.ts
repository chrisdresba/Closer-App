import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Mesa } from 'src/app/classes/mesa';
import { Pedido } from 'src/app/classes/pedido';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-juego-uno',
  templateUrl: './juego-uno.page.html',
  styleUrls: ['./juego-uno.page.scss'],
})
export class JuegoUnoPage implements OnInit {

  listadoPedidos: Pedido[] = [];
  pedido: Pedido;
  juegoValue: string = '';

  usuario: any;
  usuarioLogin: string;
  rol: string;

  public carta1: number = 6;
  public carta2: string = "";
  public url: string = "assets/in.png";
  public random: number = 0;
  public puntaje: number = 0;
  public mensaje?: string;
  public intentos: number = 5;
  public juego: string = 'mayor o menor';
  email: string = '';
  fecha?: string = '';

  constructor(
    public authSrv: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private toast: ToastController,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public servPedido: PedidosService
  ) {
    this.identificarPedido();
  }

  ngOnInit() {
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
        this.usuarioLogin = this.usuario.email;
      }
    })


    if (localStorage.getItem('anonimo')) {
      this.usuarioLogin = localStorage.getItem('anonimo');
    }

    if (localStorage.getItem('juegoOk')) {
      this.juegoValue = localStorage.getItem('juegoOk');
    }

    this.servPedido.getPedidos().subscribe(item => {
      this.listadoPedidos = item;
    })

  }

  identificarPedido() {

    setTimeout(() => {
      if (this.juegoValue == 'OK') {
        this.presentToast("Mayor o Menor", "Suma 100 puntos para ganar un descuento!", "success");
      } else {
        this.presentToast("Mayor o Menor", "Suma 100 puntos y gana!", "success");
      }
    }, 1000)

    setTimeout(() => {
      this.listadoPedidos.forEach(item => {
        if (item.productos.length > 0 && item.usuario == this.usuarioLogin) {
          this.pedido = item;
        }
      })
    }, 2500)
  }

  //////////////

  partida() {
    this.random = Math.round(Math.random() * 12);
    this.carta2 = this.random.toString();
  }

  reiniciar() {
    setTimeout(() => {
      this.mensaje = "";
      this.carta1 = this.random;
      this.carta2 = "";
      this.puntaje = 0;
      this.intentos = 5;
    }, 3000)
  }

  menor() {
    this.partida();

    if (this.carta1 > this.random) {
      this.url = "assets/ok.png";
      this.puntaje = this.puntaje + 10;
    } else if (this.carta1 == this.random) {
      this.url = "assets/in.png";
    } else {
      this.url = "assets/no.png";
      this.intentos--;
    }

    this.comprobarVictoria();

    if (this.intentos != 0) {
      setTimeout(() => {
        this.url = "assets/in.png";
        this.carta1 = this.random;
        this.carta2 = ""
      }, 3000)
    } else {
      this.finDePartida();
    }
  }

  mayor() {
    this.partida();

    if (this.carta1 < this.random) {
      this.url = "assets/ok.png";
      this.puntaje = this.puntaje + 10;
    } else if (this.carta1 == this.random) {
      this.url = "assets/in.png";
    } else {
      this.url = "assets/no.png";
      this.intentos--;
    }

      this.comprobarVictoria();

    if (this.intentos != 0) {
      setTimeout(() => {
        this.url = "assets/in.png";
        this.carta1 = this.random;
        this.carta2 = ""
      }, 3000)
    } else {
      this.finDePartida();
    }
  }

  comprobarVictoria() {
    if (this.puntaje == 100) {
      if (localStorage.getItem('juegoOk')) {
        this.presentToast("Mayor o Menor", "Felicitaciones, has ganado!", "success");
      } else {
        this.pedido.descuento = 10;
        this.servPedido.actualizarEstadoPedido(this.pedido);
        this.presentToast("Mayor o Menor", "Felicitaciones, has ganado! 10% DE DESCUENTO", "success");
        localStorage.setItem('juegoOk', 'OK');
      }

      setTimeout(() => {
        this.router.navigate(["home"]);
      }, 3000);
    }
  }

  finDePartida() {
    this.puntaje = 0;
    this.url = "assets/in.png";
    this.presentToast("Mayor o Menor", "Ser?? la pr??xima!", "warning");
    this.reiniciar();
    this.pedido.descuento = 0;
    this.servPedido.actualizarEstadoPedido(this.pedido);

    setTimeout(() => {
      this.router.navigate(["home"]);
    }, 2000);
  }

  ////////////

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Cargando...',
      duration: 3000,
      translucent: true,

      cssClass: 'my-loading-class'

    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

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
    this.authSrv.logout();
    this.router.navigate(["login"]);
  }

  back() {
    this.router.navigate(["menu-juegos"]);
  }

}

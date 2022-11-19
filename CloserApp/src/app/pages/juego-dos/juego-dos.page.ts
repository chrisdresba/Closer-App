import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Pedido } from 'src/app/classes/pedido';
import { AuthService } from 'src/app/services/auth.service';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-juego-dos',
  templateUrl: './juego-dos.page.html',
  styleUrls: ['./juego-dos.page.scss'],
})

export class JuegoDosPage implements OnInit {
  public random: number = 0;
  public letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  public palabras = ['RESTAURANT', 'RATATOUILLE', 'EXCELENTE', 'ALMUERZO', 'DESAYUNO', 'AVELLANEDA', 'MERIENDA', 'GUALEGUAYCHU', 'CAPACIDAD', 'MIERCOLES'];
  public palabra: any;
  public palabraAuxiliar: any;
  public letrasAuxiliar: any;
  public espacios: number = 0;
  public intentos: number = 0;
  public puntaje: number = 0;
  public vidas: number = 5;
  public url: string = "assets/ahorcado/ahorcado" + this.intentos + ".jpg";
  public unidad: string = "";
  public juego: string = "ahorcado";
  public usuario:any;
  public usuarioLogueado:string = '';
  public fecha:any;

  usuarioLogin: string;
  juegoValue: string = '';
  listadoPedidos: Pedido[] = [];
  pedido: Pedido;

  constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthService,
    private toast: ToastController, private servPedido: PedidosService
    ) {
        this.identificarPedido();
        this.iniciar();
  }

  ngOnInit(): void {
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

  iniciar() {
    this.random = Math.round(Math.random() * 9);
    this.palabra = Array.from(this.palabras[this.random]);
    this.palabraAuxiliar = new Array(this.palabra.length - 1);
    for (let i = 0; i < this.palabra.length; i++) {
      this.palabraAuxiliar[i] = '';
    }
    this.letrasAuxiliar = new Array();
  }

  identificarPedido() {

    setTimeout(() => {
      if (this.juegoValue == 'OK') {
        this.presentToast("Ahorcado", "Suma 300 puntos y gana!", "success");
      } else {
        this.presentToast("Ahorcado", "Suma 300 puntos para ganar un descuento!", "success");
      }
    }, 1000)

    setTimeout(() => {
      console.log(this.listadoPedidos);
      this.listadoPedidos.forEach(item => {
        console.log(item.productos.length, item.usuario, this.usuarioLogin);
        if (item.productos.length > 0 && item.usuario == this.usuarioLogin) {
          this.pedido = item;
          console.log(this.pedido);
        }
      })
    }, 2500)
  }

  letrasIngresadas(letra: any) {

    for (let i = 0; i < this.letrasAuxiliar.length; i++) {
      if (this.letrasAuxiliar[i] == letra) {
        return false;
      }
    }
    return true;
  }

  buscar(letra: any) {

    if (this.intentos < 6 && this.letrasIngresadas(letra)) {
      let auxiliar = 0;
      for (let i = 0; i < this.palabra.length; i++) {
        if (this.palabra[i] == letra) {
          this.palabraAuxiliar[i] = letra;
          auxiliar++;
        }

      }

      this.letrasAuxiliar.push(letra);

      if (auxiliar == 0) {
        this.intentos++;
        this.url = "assets/ahorcado/ahorcado" + this.intentos + ".jpg";
      }

      if (this.arrayEquals(this.palabra, this.palabraAuxiliar)) {
        this.presentToast("Ahorcado", "Excelente!!", "warning");

        setTimeout(() => {
          this.puntaje = this.puntaje + 100;
          this.comprobarVictoria();
          this.recargar();
        }, 3000)

      }
    }
    if (this.intentos == 6) {
      this.palabraAuxiliar = this.palabra;
      this.vidas--;

      if (this.vidas == 0) {
        this.presentToast("Ahorcado", "Será la próxima!", "warning");
        this.vidas = 4;
        this.puntaje = 0;
        this.recargar();
      }else{
        this.presentToast("Ahorcado", "Vuelve a intentarlo!", "warning");
        this.recargar();
      }

    }

  }

  recargar() {
    this.intentos = 0;
    this.url = "assets/ahorcado/ahorcado" + this.intentos + ".jpg";
    this.iniciar();
  }

  arrayEquals(a: any, b: any) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }

  comprobarVictoria() {
    if (this.puntaje == 300) {
      if (localStorage.getItem('juegoOk')) {
        this.presentToast("Ahorcado", "Felicitaciones, has ganado!", "success");
      } else {
        console.log("desc", this.pedido);
        this.pedido.descuento = 15;
        this.servPedido.actualizarEstadoPedido(this.pedido);
        this.presentToast("Ahorcado", "Felicitaciones, has ganado! 15% DE DESCUENTO", "success");
        localStorage.setItem('juegoOk', 'OK');
      }

      setTimeout(() => {
        this.router.navigate(["home"]);
      }, 3000);
    }
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
    this.router.navigate(["menu-juegos"]);
  }

}
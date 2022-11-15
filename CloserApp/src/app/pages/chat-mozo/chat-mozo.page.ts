import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Mesa } from 'src/app/classes/mesa';
import { MesaService } from 'src/app/services/mesa.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mensaje } from 'src/app/classes/mensaje';


@Component({
  selector: 'app-chat-mozo',
  templateUrl: './chat-mozo.page.html',
  styleUrls: ['./chat-mozo.page.scss'],
})
export class ChatMozoPage implements OnInit {

  view: boolean = false;
  public listadoMensajes: Observable<Mensaje[]>;
  public listaMesa: Mesa[] = [];
  public mensaje: string = '';
  usuario: any;
  usuarioLogin: string;
  rol: string;
  mesa: any;

  constructor(
    public authSrv: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private toast: ToastController,
    public chat: ChatService,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private mesaService: MesaService
  ) {

  }

  ngOnInit() {
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
        this.usuarioLogin = this.usuario.email;
      }
    })

    //Busqueda Mesa
    this.mesaService.getListaMesa().subscribe(item => {
      this.listaMesa = item;
    })

  }

  traerMensajes(mesa:any) {
    switch (mesa) {
      case '01':
        this.listadoMensajes = this.chat.chats01;
        break;
      case '02':
        this.listadoMensajes = this.chat.chats02;
        break;
      case '03':
        this.listadoMensajes = this.chat.chats03;
        break;
      case '04':
        this.listadoMensajes = this.chat.chats04;
        break;
    }
  }

  ordenarMensajes() {
    this.listadoMensajes = this.listadoMensajes.pipe(
      map(docs => {
        return docs.sort((a?, b?) => (((a.fecha! > b.fecha!) || (a.fecha! == b.fecha! && a.referencia! > b.referencia!)) ? 1 : -1));
      })
    );
  }

  guardarMensaje() {
    let fecha = new Date();
    const dia = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
    const hora = fecha.getHours() + ':' + this.revision(fecha.getMinutes()) + ':' + this.revision(fecha.getSeconds());
    let referencia = (fecha.getHours() * 3600) + (fecha.getMinutes() * 60) + fecha.getSeconds();

    let obj;
    obj = new Mensaje()
    obj.usuario = this.usuarioLogin;
    obj.fecha = dia;
    obj.hora = hora;
    obj.mensaje = this.mensaje;
    obj.referencia = referencia.toString();
    obj.mesa = this.mesa;

    if (this.mensaje.length > 0) {
      this.chat.guardarMensaje(this.usuarioLogin, this.mesa, this.mensaje);
      this.mensaje = '';
    }
  }

  chatPorMesa(mesa: any) {
    this.mesa = '0'+mesa;
    this.presentLoading();
    setTimeout(() => {
      this.traerMensajes(this.mesa);
      this.ordenarMensajes();
      this.view = true;
    }, 3000)
  }

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

  backHome() {
    this.router.navigate(["home"]);
  }

  back() {
    this.view = false;
    this.listadoMensajes;
  }

  revision(dato: any) {
    if (dato < 10) {
      return ('0' + dato);
    }
    return dato;
  }

}

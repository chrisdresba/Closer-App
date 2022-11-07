import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Mesa } from 'src/app/classes/mesa';
import { MesaService } from 'src/app/services/mesa.service';



@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  public listado: Array<any> = [];
  public listadoAux: Array<any> = [];
  public listadoMensajes: Array<any> = [];
  public listaMesa: Mesa[] = [];
  public mensaje: string = '';
  usuario: any;
  usuarioLogin: string;
  rol: string;
  mesa:any;

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
    this.presentLoading();
    setTimeout(() => {
      this.ordenarMensajes()
    }, 2000)
  }

  ngOnInit() {
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
        this.usuarioLogin = this.usuario.email;
      }
    })

    //Busqueda Mesa
    this.mesaService.getListaMesa().subscribe(item=>{
      this.listaMesa = item;
    })
    this.buscarMesa();

  //Busqueda Mensajes
    this.chat.getMensajes().subscribe(aux => {
      this.listado = aux;
    })
    this.filtrarMensajes();
    this.ordenarMensajes();
  }

  buscarMesa(){
    for (let i = 0; i < this.listaMesa.length; i++) {
      if (this.listaMesa[i].usuario == this.usuarioLogin) {
        this.mesa = this.listaMesa[i].numero;
        break;
      }
    }
    this.mesa = '1';//prueba
  }

  filtrarMensajes() {
    return this.listado.filter(item => item.mesa == this.mesa);
  }

  ordenarMensajes() {
    this.listadoMensajes = this.listado.sort((a?, b?) => (((a.referencia! > b.referencia!)) ? 1 : -1));
  }

  guardarMensaje() {
    this.chat.guardarMensaje(this.usuarioLogin, this.mesa,this.mensaje);
    setTimeout(() => {
      this.ordenarMensajes();
    }, 500)
    this.mensaje = '';
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Cargando...',
      duration: 2000,
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
    localStorage.removeItem('creditos');
    localStorage.removeItem('usuario');
    this.authSrv.logout();
    this.router.navigate(["login"]);
  }

  back() {
    this.router.navigate(["home"]);
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MesaService } from 'src/app/services/mesa.service';
import { EstadoPedido } from 'src/app/enumerados/estado-pedido';
import { Observable } from 'rxjs';
import { Pedido } from 'src/app/classes/pedido';
import { ItemPedido } from 'src/app/classes/item-pedido';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-estado-pedido',
  templateUrl: './estado-pedido.page.html',
  styleUrls: ['./estado-pedido.page.scss'],
})
export class EstadoPedidoPage implements OnInit {

  listadoPedidos: Pedido[] = [];
  listaItemPedidos: ItemPedido[] = [];
  listadoVista: any[] = [];
  usuario: any;
  usuarioLogin: any;
  pedido: Pedido;
  itemPedido: ItemPedido;

  constructor(
    public authSrv: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private toast: ToastController,
    public chat: ChatService,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private mesaService: MesaService,
    public servPedido: PedidosService
  ) {
    this.presentLoading();
    setTimeout(() => {
      if (localStorage.getItem('anonimo')) {
        this.usuarioLogin = localStorage.getItem('anonimo');
      }
    }, 1000);
    setTimeout(() => {
      this.filtrarPedido();
    }, 2500)
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


    this.servPedido.getItemPedido().subscribe(item => {
      this.listaItemPedidos = item;
    })

    this.servPedido.getPedidos().subscribe(item => {
      this.listadoPedidos = item;
    })
  }

  filtrarPedido() {

    this.listadoPedidos.forEach(item => {


      if (item.productos.length > 0 && item.usuario == this.usuarioLogin) {

        let platos = [];
        this.listadoVista.push(item.uid);
        this.listadoVista.push(item.mesa);
        this.listadoVista.push(item.estado);

        for (let e = 0; e < item.productos.length; e++) {

          for (let i = 0; i < this.listaItemPedidos.length; i++) {
            let validacion = false;
            if (this.listaItemPedidos[i].uid == item.productos[e]) {

              for (let e = 0; e < platos.length; e++) { //PLATOS 
                if (this.listaItemPedidos[i].producto.nombre == platos[e].nombre) {
                  platos[e].cantidad += 1;
                  validacion = true;
                }
              }

              if (validacion == false) {
                platos.push({ 'nombre': this.listaItemPedidos[i].producto.nombre, 'cantidad': this.listaItemPedidos[i].cantidad, 'precio': this.listaItemPedidos[i].producto.precio })
              }
            }
          }
        }
        this.listadoVista.push(platos);
        this.pedido = item;
      }
    })
  }

  async confirmarPedido() {
    this.listadoVista[2] = EstadoPedido.CONFIRMADO;
    this.pedido.estado = EstadoPedido.CONFIRMADO;
    console.log(this.pedido);
    this.mesaService.actualizarEstadoPedido(this.pedido);
    this.presentToast("Pedido", "El pedido fue confirmado", "success");

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
    this.router.navigate(["home"]);
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


}

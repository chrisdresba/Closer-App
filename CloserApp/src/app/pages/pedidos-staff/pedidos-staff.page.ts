import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/classes/producto';
import { TipoProducto } from 'src/app/enumerados/tipo-producto';
import { Pedido } from 'src/app/classes/pedido';
import { user } from '@angular/fire/auth';
import { EstadoPedido } from 'src/app/enumerados/estado-pedido';
import { ItemPedido } from 'src/app/classes/item-pedido';
import { Mesa } from 'src/app/classes/mesa';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-pedidos-staff',
  templateUrl: './pedidos-staff.page.html',
  styleUrls: ['./pedidos-staff.page.scss'],
})
export class PedidosStaffPage implements OnInit {

  listadoPedidos: Pedido[] = [];
  listaItemPedidos: ItemPedido[] = [];
  listadoVista: any[] = [];
  usuario: any;
  pedido: Pedido;
  itemPedido: ItemPedido;

  constructor(public authSrv: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private toast: ToastController,
    private mesaService: MesaService,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public servPedido: PedidosService
  ) {
    this.presentLoading();
    setTimeout(() => {
      this.filtrarPedidos()
    }, 2500)
  }

  ngOnInit() {

    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
      }
    })

    this.servPedido.getItemPedido().subscribe(item => {
      this.listaItemPedidos = item;
    })
    this.servPedido.getPedidos().subscribe(item => {
      this.listadoPedidos = item;
    })
  }

  filtrarPedidos() {
    this.listadoPedidos.forEach(item => {

      if (item.productos.length > 0) {
        let obj = [];
        let platos = [];
        obj.push(item.uid);
        obj.push(item.mesa);
        obj.push(item.estado);

        for (let e = 0; e < item.productos.length; e++) {
          for (let i = 0; i < this.listaItemPedidos.length; i++) {
            if (this.listaItemPedidos[i].uid == item.productos[e]) {
              platos.push({ 'nombre': this.listaItemPedidos[i].producto.nombre, 'cantidad': this.listaItemPedidos[i].cantidad })
            }
          }
        }
        obj.push(platos);
        this.listadoVista.push(obj);
      }

    })
  }

  recargar() {
    setTimeout(() => {
      this.listadoVista = [];
      this.filtrarPedidos()
    }, 2500)
  }

  async aceptarPedido(id: string) {
    let auxiliar = false;

    for (let e = 0; e < this.listadoPedidos.length; e++) {
      if (this.listadoPedidos[e].uid == id) {
        this.pedido = this.listadoPedidos[e];
        if (this.pedido.estado == EstadoPedido.CONFIRMAR) {
          this.listadoPedidos[e].estado = EstadoPedido.PENDIENTE;
          auxiliar = true;
        }
      }
    }

    if (auxiliar) {
      this.pedido.estado = EstadoPedido.PENDIENTE;
      this.mesaService.actualizarEstadoPedido(this.pedido);
      this.recargar();
      this.presentToast("Pedido", "El pedido fue aceptado", "success");
    } else {
      this.presentToast("Pedido", "El pedido ya fue aceptado", "warning");
    }

  }

  async entregarPedido(id: string) {
    let auxiliar = false;
    for (let e = 0; e < this.listadoPedidos.length; e++) {
      if (this.listadoPedidos[e].uid == id) {
        this.pedido = this.listadoPedidos[e];
        if (this.pedido.estado == EstadoPedido.LISTO) {
          this.listadoPedidos[e].estado = EstadoPedido.ENTREGADO;
          auxiliar = true;
        }
      }
    }

    if (auxiliar) {
      this.pedido.estado = EstadoPedido.ENTREGADO;
      this.mesaService.actualizarEstadoPedido(this.pedido);
      this.recargar();
      this.presentToast("Pedido", "El pedido fue entregado", "success");
    } else {
      this.presentToast("Pedido", "Aún no esta listo para servir", "warning");
    }

  }


  confirmarPedido() {
    // console.log("conf ", this.pedido);
    this.pedido.estado = EstadoPedido.PENDIENTE;
    this.mesaService.actualizarEstadoPedido(this.pedido);
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

  back() {
    this.router.navigate(["home"]);
  }


}

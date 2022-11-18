import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Mesa } from 'src/app/classes/mesa';
import { MesaService } from 'src/app/services/mesa.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ItemPedido } from 'src/app/classes/item-pedido';
import { TipoProducto } from 'src/app/enumerados/tipo-producto';
import { EstadoPedido } from 'src/app/enumerados/estado-pedido'

@Component({
  selector: 'app-items-pedido-staff',
  templateUrl: './items-pedido-staff.page.html',
  styleUrls: ['./items-pedido-staff.page.scss'],
})
export class ItemsPedidoStaffPage implements OnInit {

  listaItemsPedido: ItemPedido[] = [];
  listaItemsPedidoCocinero: ItemPedido[] | any = [];
  listaItemsPedidoBartender: ItemPedido[] | any = [];
  rol: string;

  constructor(public authSrv: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private toast: ToastController,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private pedidosService: PedidosService
  ) { }

  ngOnInit() {
    if (localStorage.getItem('sesionRol')) {
      this.rol = localStorage.getItem('sesionRol');
    }

    this.obtenerItemsPedido();
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

  obtenerItemsPedido() {

    this.pedidosService.getItemPedido().subscribe(items => {
      this.listaItemsPedido = items;
      console.log(this.listaItemsPedido)
      this.listaItemsPedidoCocinero = this.agruparPorMesa(this.filtrarPedidosCocinero());
      this.listaItemsPedidoBartender = this.agruparPorMesa(this.filtrarPedidosBartender());
    }, error => console.log(error));
  }

  filtrarPedidosCocinero() {
    return this.listaItemsPedido.filter((item: ItemPedido) => (item.producto.tipo === TipoProducto.COCINA || item.producto.tipo === TipoProducto.POSTRE) && (item.estado === EstadoPedido.ACEPTADO|| item.estado === EstadoPedido.ELABORACION));
  }

  filtrarPedidosBartender() {
    return this.listaItemsPedido.filter((item: ItemPedido) => (item.producto.tipo === TipoProducto.BAR) && (item.estado === EstadoPedido.ACEPTADO || item.estado === EstadoPedido.ELABORACION));
  }

  agruparPorMesa(lista: ItemPedido[]) {
    let itemsPorMesa: [
      {
        mesa: string,
        itemsMesa: ItemPedido[]
      }
    ] | any = [];

    let mesasPosibles: string[] = [];

    lista.forEach(element => {
      mesasPosibles.push(element.mesa);
    });

    mesasPosibles = mesasPosibles.filter((item, index) => {
      return mesasPosibles.indexOf(item) === index;
    });

    mesasPosibles.forEach(mesaPosible => {
      itemsPorMesa.push({
        mesa: mesaPosible,
        itemsMesa: lista.filter((item: ItemPedido) => item.mesa === mesaPosible)
      })
    });
    
    return itemsPorMesa;
  }

  async actualizarEstadoItem(item: ItemPedido, estado: string) {
    const loading = await this.loadingController.create();
    await loading.present();

    if (estado === 'ELABORACION') {
      item.estado = EstadoPedido.ELABORACION;
    } else if (estado === 'LISTO') {
      item.estado = EstadoPedido.LISTO;
    }


    this.pedidosService.actualizarEstadoItemPedido(item).then((resultado) => {
    }, (err) => {
      console.log(err);
    });

    await loading.dismiss();
  }

}

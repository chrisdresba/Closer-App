import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Mesa } from 'src/app/classes/mesa';
import { MesaService } from 'src/app/services/mesa.service';
import { ItemPedidoService } from 'src/app/services/item-pedido.service';
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
  listaItemsPedidoCocinero: ItemPedido[] = [];
  listaItemsPedidoBartender: ItemPedido[] = [];
  rol: string;

  constructor(public authSrv: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private toast: ToastController,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    private itemPedidoService: ItemPedidoService
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
    this.itemPedidoService.getItemsPedido().subscribe(items => {
      this.listaItemsPedido = items;
      this.listaItemsPedidoCocinero = this.filtrarPedidosCocinero();
      this.listaItemsPedidoBartender = this.filtrarPedidosBartender();
    }, error => console.log(error));
  }

  filtrarPedidosCocinero() {
    return this.listaItemsPedido.filter((item: ItemPedido) => (item.producto.tipo === TipoProducto.COCINA || item.producto.tipo === TipoProducto.POSTRE) && (item.estado === EstadoPedido.PENDIENTE));
  }

  filtrarPedidosBartender() {
    return this.listaItemsPedido.filter((item: ItemPedido) => (item.producto.tipo === TipoProducto.BAR) && (item.estado === EstadoPedido.PENDIENTE));
  }
}

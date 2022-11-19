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
import { PushNotificationService } from 'src/app/services/push-notification.service';
import { PushUserRolToken } from 'src/app/classes/push-user-rol-token'

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
  pedidoAux: Pedido;
  itemPedido: ItemPedido;
  mesaAsignada: Mesa;

  constructor(public authSrv: AuthService,
    private router: Router,
    public loadingController: LoadingController,
    private toast: ToastController,
    private mesaService: MesaService,
    public firestore: AngularFirestore,
    public afAuth: AngularFireAuth,
    public servPedido: PedidosService,
    private pnService: PushNotificationService
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
        let acumulador = 0;
        obj.push(item.uid);
        obj.push(item.mesa);

        for (let e = 0; e < item.productos.length; e++) {
          for (let i = 0; i < this.listaItemPedidos.length; i++) {
            if (this.listaItemPedidos[i].uid == item.productos[e]) {
              platos.push({ 'nombre': this.listaItemPedidos[i].producto.nombre, 'cantidad': this.listaItemPedidos[i].cantidad, 'estado': this.listaItemPedidos[i].estado, 'tipo': this.listaItemPedidos[i].producto.tipo })
              if (this.listaItemPedidos[i].estado == EstadoPedido.LISTO) {
                acumulador++;
              }
            }
          }
        }
        obj.push(platos);
        if (item.productos.length == acumulador && !( item.estado == EstadoPedido.ENTREGADO ||  item.estado == EstadoPedido.CONFIRMADO )) {
          obj.push(EstadoPedido.LISTO);
          this.pedidoAux = item;
          this.pedidoAux.estado = EstadoPedido.LISTO;
          this.mesaService.actualizarEstadoPedido(this.pedidoAux);
        } else {
          obj.push(item.estado);
        }
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

        if (this.pedido.estado == EstadoPedido.PENDIENTE) {
          this.listadoPedidos[e].estado = EstadoPedido.ACEPTADO;
          auxiliar = true;
        }
      }
    }

    if (auxiliar) {
      this.pedido.estado = EstadoPedido.ACEPTADO;

      this.enviarPushNotification();

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
      this.pedido.estado = 'ENTREGADO'
      this.mesaService.actualizarEstadoPedido(this.pedido);
      this.recargar();
      this.presentToast("Pedido", "El pedido fue entregado", "success");
    } else {
      this.presentToast("Pedido", "Aún no esta listo para servir", "warning");
    }

  }

  async confirmarPago(id: string) {
    let auxiliar = false;
    for (let e = 0; e < this.listadoPedidos.length; e++) {
      if (this.listadoPedidos[e].uid == id) {
        this.pedido = this.listadoPedidos[e];
        if (this.pedido.estado == EstadoPedido.CONFIRMADO) {
          auxiliar = true;
          this.mesaAsignada = this.mesaService.devolverMesaAsignada(this.pedido.mesa);
        }
      }
    }

    if (auxiliar) {
      // this.pedido.estado = EstadoPedido.ENTREGADO;
      //   this.mesaService.actualizarEstadoPedido(this.pedido);
      this.mesaAsignada.estado = 'libre';
      this.mesaAsignada.usuario = '';
      this.mesaService.actualizarMesa(this.mesaAsignada);
      this.recargar();
      this.presentToast("Pago", "Pago confirmado", "success");
    } else {
      this.presentToast("Pago", "Aún no se puede realizar el pago, el pedido no fue entregado", "warning");
    }

  }


  confirmarPedido() {
    // console.log("conf ", this.pedido);
    this.pedido.estado = EstadoPedido.ACEPTADO;
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

  enviarPushNotification(){
    // //Envío de push notification al cocinero y bartender (COCINERO y BARTENDER)

    let productos = [];

    this.listadoVista.forEach(elementoVista => {
      if(elementoVista[0] === this.pedido.uid){
        productos = elementoVista[2];
      }
    });

    let productosCocinero = [];
    let productosBartender = [];

    if(productos.length > 0){
      productosCocinero = productos.filter(item => ((item.tipo === 'COCINA' || item.tipo === 'POSTRE')));
      productosBartender = productos.filter(item => ((item.tipo === 'BAR')));
    }

    if(productosCocinero.length > 0){
      let productosCocineroString: string[] = [];
      
      productosCocinero.forEach(productoCocinero => {
        productosCocineroString.push(productoCocinero.nombre + ' x ' + productoCocinero.cantidad + ' ')
      });

      this.pnService
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: this.pnService.listUserToken.filter((usrToken: PushUserRolToken) => (usrToken.perfil === 'COCINERO')).map(usrTokenReading => usrTokenReading.token),
        notification: {
          title: 'Nuevo pedido de la mesa N°: ' + this.pedido.mesa + ':',
          body: productosCocineroString.toString(),
        },
        data: {
          id: 4,
          nombre: 'pedido',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
    }

    if(productosBartender.length > 0){
      let productosBartenderString: string[] = [];
      
      productosBartender.forEach(productoCocinero => {
        productosBartenderString.push(productoCocinero.nombre + ' x ' + productoCocinero.cantidad + ' ')
      });

      this.pnService
      .sendPushNotification({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        registration_ids: this.pnService.listUserToken.filter((usrToken: PushUserRolToken) => (usrToken.perfil === 'BARTENDER')).map(usrTokenReading => usrTokenReading.token),
        notification: {
          title: 'Nuevo pedido de la mesa N°: ' + this.pedido.mesa + ':',
          body: productosBartenderString.toString(),
        },
        data: {
          id: 4,
          nombre: 'pedido',
        },
      })
      .subscribe((data) => {
        console.log(data);
      });
    }
  }

}

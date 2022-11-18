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
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Pedido } from 'src/app/classes/pedido';
import { ItemPedido } from 'src/app/classes/item-pedido';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-solicitar-cuenta',
  templateUrl: './solicitar-cuenta.page.html',
  styleUrls: ['./solicitar-cuenta.page.scss'],
})
export class SolicitarCuentaPage implements OnInit {

  scannedResult: any;
  content_visibility = '';

  listadoPedidos: Pedido[] = [];
  listaItemPedidos: ItemPedido[] = [];
  listadoVista: any[] = [];
  usuario: any;
  usuarioLogin: any;
  pedido: Pedido;
  itemPedido: ItemPedido;
  propinaValue: boolean = false;

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

    if (localStorage.getItem('propina')) {
      this.propinaValue = true;
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
        let precioFinal;
        let propina$ = (item.precioAcumulado / 100) * item.propina;
        let descuento$ = (item.precioAcumulado / 100) * item.descuento;
        this.listadoVista.push(item.uid);
        this.listadoVista.push(item.mesa);
        this.listadoVista.push(item.usuario);
        this.listadoVista.push(descuento$);
        this.listadoVista.push(item.descuento);
        this.listadoVista.push(propina$);
        this.listadoVista.push(item.propina);
        this.listadoVista.push(item.precioAcumulado);

        for (let e = 0; e < item.productos.length; e++) { //PRODUCTOS

          for (let i = 0; i < this.listaItemPedidos.length; i++) { //ITEMS PEDIDOS - PRODUCTOS PEDIDOS
            let validacion = false;
            if (this.listaItemPedidos[i].uid == item.productos[e]) {

              for (let e = 0; e < platos.length; e++) { //PLATOS 
                if (this.listaItemPedidos[i].producto.nombre == platos[e].nombre) {
                  platos[e].cantidad += 1;
                  platos[e].precioFinal += platos[e].precio;
                  validacion = true;
                }
              }

              if (validacion == false) {
                platos.push({ 'nombre': this.listaItemPedidos[i].producto.nombre, 'cantidad': this.listaItemPedidos[i].cantidad, 'precio': this.listaItemPedidos[i].producto.precio, 'precioFinal': this.listaItemPedidos[i].producto.precio })
              }

            }
          }
        }
        this.listadoVista.push(platos);
        precioFinal = item.precioAcumulado + propina$ - descuento$;
        this.listadoVista.push(precioFinal);
        this.pedido = item;

      }
    })
  }

  async confirmarPedido() {
    this.pedido.estado = EstadoPedido.CONFIRMADO;
    this.mesaService.actualizarEstadoPedido(this.pedido);
    this.listadoVista[2] = EstadoPedido.CONFIRMADO;
    this.presentToast("Pedido", "El pedido fue confirmado", "success");

  }

  /////LECTURA QR

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // the user granted permission
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }

  async ReadQrCode() {

   // localStorage.setItem('propina', '10'); /////VALOR ETAPA DE PRUEBA
   // this.actualizarPropina(10);/////VALOR ETAPA DE PRUEBA

    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      const result = await BarcodeScanner.startScan();
      this.opcionesQr(result.content);

      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if (result?.hasContent) {
        this.scannedResult = result.content;
      }
    } catch (e) {
      console.log(e);
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
  /////////

  opcionesQr(qr: string) {

    switch (qr) {
      case '00malo':
        localStorage.setItem('propina', '0');
         this.actualizarPropina(0);
        break;
      case '05regular':
        localStorage.setItem('propina', '5');
        this.actualizarPropina(5);
        break;
      case '10bueno':
        localStorage.setItem('propina', '10');
        this.actualizarPropina(10);
        break;
      case '15muybueno':
        localStorage.setItem('propina', '15');
        this.actualizarPropina(15);
        break;
      case '20excelente':
        localStorage.setItem('propina', '20');
        this.actualizarPropina(20);
        break;
      default: ;
    }
  }

  actualizarPropina(value:number){
    this.pedido.propina = value;
    this.mesaService.actualizarEstadoPedido(this.pedido);
    this.presentLoading();
    setTimeout(()=>{
      this.propinaValue = true;
    },3000)

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

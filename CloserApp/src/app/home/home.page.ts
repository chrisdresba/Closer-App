import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { MesaService } from '../services/mesa.service';
import { ToastService } from '../services/toast.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { ListaEspera } from '../classes/lista-espera';
import { PedidosService } from '../services/pedidos.service';
import { Pedido } from '../classes/pedido';
import { Mesa } from '../classes/mesa';
import { EstadoPedido } from '../enumerados/estado-pedido';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  scannedResult: any;
  content_visibility = '';
  listaEspera: ListaEspera[] = [];

  usuario: any;
  usuarioLogin: string;
  rol: string;
  mesa: string;
  view:boolean = false;
  encuesta:boolean = false;

  listaPedidos: Pedido[] = [];
  public listaMesas: Mesa[] = [];

  constructor(private authService: AuthService, public loadingController: LoadingController, private router: Router, 
    public afAuth: AngularFireAuth, public servMesa: MesaService, public toastSrv: ToastService, 
    private toast: ToastController, private pedidoService: PedidosService) {

    this.presentLoading();
    setTimeout(()=>{
      this.mesa = this.servMesa.comprobarMesaAsignada(this.usuarioLogin);
      this.view = true;
    },2000)
  }

  ngOnInit(): void {
    this.servMesa.getListaMesa().subscribe(item => {
      this.listaMesas = item;
      // console.log(this.listaMesas);
    })

    if (localStorage.getItem('sesionRol')) {
      this.rol = localStorage.getItem('sesionRol');
      console.log(this.rol);
    }
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
        this.usuarioLogin = this.usuario.email;
        this.traerPedidos(this.usuarioLogin);
      }
    })

    if (localStorage.getItem('anonimo')) {
      this.usuarioLogin = localStorage.getItem('anonimo');
      this.traerPedidos(this.usuarioLogin);
    }

    this.servMesa.getListaEspera().subscribe(item => {
      this.listaEspera = item;
      // console.log(this.listaEspera);
    })

  }

  async traerPedidos(usuarioLogueado: string){
    this.pedidoService.getPedidos().subscribe(aux => {
      this.listaPedidos = aux;
      // console.log("lista",this.listaPedidos);

      this.filtrarPedidos(usuarioLogueado);
    });
  }

  filtrarPedidos(userLogin: string) {
    // console.log("userLogin", userLogin);
    // console.log("log",this.usuarioLogin);
    for( let i=0; i< this.listaPedidos.length; i++) {
      // console.log (this.listaPedidos[i].usuario, this.listaPedidos[i].estado);
      // console.log("mes",this.listaMesas);
      if (this.usuarioLogin == this.listaPedidos[i].usuario && this.listaPedidos[i].uidEncuesta != '') {
        for( let i=0; i< this.listaMesas.length; i++) {
          // console.log (this.listaPedidos[i].mesa, this.listaMesas[i].numero, this.listaMesas[i].estado);
          if (this.listaPedidos[i].mesa == this.listaMesas[i].numero && this.listaMesas[i].estado == 'ocupado') {
    
            this.encuesta = true;       
            break;
          }
        }

      }
      if(this.encuesta == true){
        break;
      }      
    }
    console.log("filtro", this.encuesta);
  }

  async logout() {
    await this.authService.logout();
    localStorage.removeItem('sesionRol');
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  gestionarUsuarios() {
    this.router.navigateByUrl('usuarios', { replaceUrl: true });
  }

  realizarPedido() {
    this.router.navigateByUrl('pedido', { replaceUrl: true });
  }

  verPedidos(){
    this.router.navigateByUrl('pedidos-staff', { replaceUrl: true });
  }

  verItemsPedidos(){
    this.router.navigateByUrl('items-pedido-staff', { replaceUrl: true });
  }

  realizarEncuesta() {
    this.router.navigateByUrl('encuesta', { replaceUrl: true });
  }

  verValoraciones() {
    this.router.navigateByUrl('graficos', { replaceUrl: true });
  }

  ingresarListaEspera() {
    try {
      this.servMesa.agregarUsuarioListaEspera(this.usuarioLogin);
      this.presentToast("Lista de Espera", "Ya te encuentras en la lista de espera!", "success");
    } catch (error) {

      console.log(error);
    }

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
        console.log(this.scannedResult);
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
      case 'listaEspera':
        this.agregarALista();
        break;
      case '8soLfeZGDhBYjhkJhaVM':
        console.log('mesa 4');
        break;
      case '9USkEuuY6nJWaO8CSF5Z':
        console.log('mesa 3');
        break;
      case 'EXceXQ6iRmsibO4jXRHj':
        console.log('mesa 2');
        break;
      case 'tR1zsOW4f0Lpqfc0kAGp':
        console.log('mesa 1');
        break;
      default: ;
    }
  }

  agregarALista() {
    for (let i = 0; i < this.listaEspera.length; i++) {
      if (this.listaEspera[i].usuario == this.usuarioLogin) {
        if (this.listaEspera[i].estado == true) {
          this.presentToast("Lista de Espera", "No puedes agregarte nuevamente a la lista de espera!", "warning");
          return false;
        }
      }
    }
    this.ingresarListaEspera();
    return true;
  }

  verListaEspera() {
    this.router.navigateByUrl('espera', { replaceUrl: true });
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
      duration: 2500,
      position: "middle"
    });
    toast.present();
  }

}

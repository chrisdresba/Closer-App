import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/classes/producto';
import { TipoProducto } from 'src/app/enumerados/tipo-producto';
import { MesaService } from 'src/app/services/mesa.service';
import { Pedido } from 'src/app/classes/pedido';
import { user } from '@angular/fire/auth';
import { EstadoPedido } from 'src/app/enumerados/estado-pedido';
import { ItemPedido } from 'src/app/classes/item-pedido';
import { timeStamp } from 'console';
import { v4 as uuidv4 } from 'uuid';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Mesa } from 'src/app/classes/mesa';
import { ToastService } from 'src/app/services/toast.service';
import { PedidosService } from 'src/app/services/pedidos.service';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {
  listaProductos: any[] = [];
  listaComida: any[] = [];
  listaBebida: any[] = [];
  listaPostre: any[] = [];
  listaItems: ItemPedido[] = [];
  listaItemsPedido: ItemPedido[] = [];
  listaPedido: Pedido[] = [];
  public listaMesa: Mesa[] = [];
  mesaOcupadas: Mesa;
  menu:string='PLATOS';

  mesa: Mesa;
  pedido: Pedido;
  itemPedido: ItemPedido;
  uuid: string = '';
  
  // listaProductosPedido: Array<ItemPedido> = new Array<ItemPedido>();
  listaProductosPedido: Array<string> = new Array<string>();
  listaDetalle: any[] = [];

  usuarioLogin: string;
  usuario: any;
  importeAcumulado: number = 0;
  tiempoMaximo: number = 0;
  confirmar: boolean = false;

  constructor(private router: Router, private authService: AuthService, private productosService: ProductosService,
    private mesaService: MesaService, private afAuth: AngularFireAuth, public toastSrv: ToastService, 
    private pedidoService: PedidosService ) {
      this.traerListaMesa();
        this.filtrarPedido();
        }

  ngOnInit() {
    this.obtenerProductos();
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
        this.usuarioLogin = this.usuario.email;
      }
    })

    
  }

  async traerListaMesa(){
    this.mesaService.getListaMesa().subscribe(item => {
      this.listaMesa = item;
      // this.listaMesaLibre = this.filtrarLibres();
      // console.log(this.listaMesa);

      this.listaMesa.forEach(mesa => {
        if(mesa.estado == "ocupado" && mesa.usuario == this.usuarioLogin){
          this.mesa = mesa;
        }});
      // console.log(this.mesa);
    })
  }

  async traerListaItems(){
    console.log("aqui");
    // this.pedidoService.getItemPedido().subscribe(item => {
    //   this.listaItems = item;
    // })
    console.log("it",this.listaItems);
    this.listaItemsPedido = this.filtrarItemsPedidos();
    console.log("itPe",this.listaItemsPedido);
}

  async back() {
    this.router.navigateByUrl('home', { replaceUrl: true });
  }

  async logout() {
    await this.authService.logout();

    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  obtenerProductos() {
    this.productosService.getProductos().subscribe(prods => {
      this.listaProductos = prods;
      this.listaComida = this.filtrarComida();
      this.listaBebida = this.filtrarBebida();
      this.listaPostre = this.filtrarPostre();
    }, error => console.log(error));
  }

  filtrarComida() {
    return this.listaProductos.filter((prod: Producto) => prod.tipo === TipoProducto.COCINA);
  }

  filtrarBebida() {
    return this.listaProductos.filter((prod: Producto) => prod.tipo === TipoProducto.BAR);
  }

  filtrarPostre() {
    return this.listaProductos.filter((prod: Producto) => prod.tipo === TipoProducto.POSTRE);
  }

  // filtrarMesa() {
  //   return this.listaMesas.filter((mesa: Mesa) => mesa.estado == "ocupado" && mesa.usuario == this.usuario.email);
  // }

  filtrarPedido() {

    console.log("1",this.listaPedido);
    this.listaPedido.forEach(item => {


      if (item.productos.length > 0 && item.usuario == this.usuarioLogin) {

        let platos = [];
        this.listaDetalle.push(item.uid);
        this.listaDetalle.push(item.mesa);
        this.listaDetalle.push(item.estado);

        for (let e = 0; e < item.productos.length; e++) {

          for (let i = 0; i < this.listaItemsPedido.length; i++) {
            let validacion = false;
            if (this.listaItemsPedido[i].uid == item.productos[e]) {

              for (let e = 0; e < platos.length; e++) { //PLATOS 
                if (this.listaItemsPedido[i].producto.nombre == platos[e].nombre) {
                  platos[e].cantidad += 1;
                  validacion = true;
                }
              }

              if (validacion == false) {
                platos.push({ 'nombre': this.listaItemsPedido[i].producto.nombre, 'cantidad': this.listaItemsPedido[i].cantidad, 'precio': this.listaItemsPedido[i].producto.precio })
              }
            }
          }
        }
        this.listaDetalle.push(platos);
        console.log("2",this.listaDetalle);
        // this.pedido = item;
      }
    })
  }



  filtrarItemsPedidos() {
    this.listaDetalle = [];
    console.log("hola");
    this.pedido.productos.forEach(item => {

      for (let i = 0; i < this.listaItems.length; i++) {
        if (this.listaItems[i].uid == item) {
          console.log("1",item);
          console.log("2",this.listaItems[i].uid);
          this.listaDetalle.push({ 'nombre': this.listaItems[i].producto.nombre, 
          'cantidad': this.listaItems[i].cantidad })
          break;
        }
      }
    })

    console.log("detalle", this.listaDetalle);
    return this.listaDetalle;
  }

  agregar(item: Producto){
    this.uuid = uuidv4();
    this.itemPedido = new ItemPedido();
    this.itemPedido.mesa = this.mesa.numero;
    this.itemPedido.producto = item;
    this.itemPedido.usuario = this.usuarioLogin;
    this.itemPedido.estado = EstadoPedido.PENDIENTE;
    this.itemPedido.cantidad += 1;
    this.itemPedido.uid = this.uuid;

    this.mesaService.agregarItemPedido(this.itemPedido); 
    console.log("item", this.itemPedido);

    this.importeAcumulado += item.precio;

    if(this.tiempoMaximo < item.tiempo)
      this.tiempoMaximo = item.tiempo;

    console.log("null", this.pedido);
    if(this.pedido == undefined){
      console.log("null2", this.pedido);
      this.cargarPedido(this.itemPedido);
    } else {
      this.actualizarPedido(this.itemPedido);
    }
    // this.traerListaItems();
    this.filtrarPedido();
  }

  actualizarPedido(item: ItemPedido){
    this.pedido.precioAcumulado = this.importeAcumulado;
    this.listaProductosPedido.push(item.uid);
    this.pedido.productos = this.listaProductosPedido;

    this.mesaService.actualizarItemsPedido(this.pedido);

    console.log("agregar", this.pedido);
  }

  cargarPedido(item: ItemPedido){
    this.uuid = uuidv4();
    this.pedido = new Pedido();
    this.pedido.estado = EstadoPedido.CONFIRMAR;
    this.pedido.mesa = this.mesa.numero;
    this.pedido.precioAcumulado = this.importeAcumulado;
    this.pedido.uid = this.uuid;
    // console.log('uid', this.pedido.uid);
    this.pedido.usuario = this.usuarioLogin;
    this.listaProductosPedido.push(item.uid);
    this.pedido.productos = this.listaProductosPedido;
    this.pedido.uidEncuesta = '';

    this.mesaService.agregarPedido(this.pedido);

    console.log("agregar", this.pedido);
  }

  confirmarPedido(){
    // console.log("conf ", this.pedido);
    this.presentToast("Confirmado", "El pedido está en marcha", "success");
    this.pedido.estado = EstadoPedido.PENDIENTE;   
    this.mesaService.actualizarEstadoPedido(this.pedido);
    this.confirmar = true;

  }

  async presentToast(header: string, message: string, color: string) {
    const toast = await this.toastSrv.toast.create({
      header,
      message,
      color,
      duration: 2500,
      position: "middle"
    });
    toast.present();
  }
}

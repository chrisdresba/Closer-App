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
  pedido: Pedido;
  itemPedido: ItemPedido;
  uuid: string = '';
  // listaProductosPedido: Array<ItemPedido> = new Array<ItemPedido>();
  listaProductosPedido: Array<string> = new Array<string>();

  usuario: any;
  importeAcumulado: number = 0;
  tiempoMaximo: number = 0;

  constructor(private router: Router, private authService: AuthService, private productosService: ProductosService,
    private mesaService: MesaService, private afAuth: AngularFireAuth) { }

  ngOnInit() {
    this.obtenerProductos();
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
      }
    })
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

  agregar(item: Producto){
    this.uuid = uuidv4();
    this.itemPedido = new ItemPedido();
    this.itemPedido.mesa = "02";
    this.itemPedido.producto = item;
    this.itemPedido.usuario = this.usuario.email;
    this.itemPedido.estado = EstadoPedido.PENDIENTE;
    this.itemPedido.cantidad += 1;
    this.itemPedido.uid = this.uuid;

    this.mesaService.agregarItemPedido(this.itemPedido); 
    // console.log("item", this.itemPedido);

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
    this.pedido.mesa = "02";
    this.pedido.precioAcumulado = this.importeAcumulado;
    this.pedido.uid = this.uuid;
    // console.log('uid', this.pedido.uid);
    this.pedido.usuario = this.usuario.email;
    this.listaProductosPedido.push(item.uid);
    this.pedido.productos = this.listaProductosPedido;
    this.pedido.uidEncuesta = '';

    this.mesaService.agregarPedido(this.pedido);

    console.log("agregar", this.pedido);
  }

  confirmarPedido(){
    // console.log("conf ", this.pedido);
    this.pedido.estado = EstadoPedido.PENDIENTE;   
    this.mesaService.actualizarEstadoPedido(this.pedido);
  }
}

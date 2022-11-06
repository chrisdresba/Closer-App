import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ProductosService } from 'src/app/services/productos.service';
import { Producto } from 'src/app/classes/producto';
import { TipoProducto } from 'src/app/enumerados/tipo-producto';

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

  constructor(private router: Router, private authService: AuthService, private productosService: ProductosService) { }

  ngOnInit() {
    this.obtenerProductos();
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
}

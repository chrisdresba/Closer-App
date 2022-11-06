import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/classes/cliente';
import { ListaEspera } from 'src/app/classes/lista-espera';
import { Mesa } from 'src/app/classes/mesa';
import { AuthService } from 'src/app/services/auth.service';
import { MesaService } from 'src/app/services/mesa.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-espera',
  templateUrl: './espera.page.html',
  styleUrls: ['./espera.page.scss'],
})
export class EsperaPage implements OnInit {
  public clientes : Cliente[] = [];
  public listaEspera: ListaEspera[] = [];
  public listaEsperaFiltro: ListaEspera[] = [];

  public listaMesa: Mesa[] = [];
  public listaMesaLibre: Mesa[] = [];

  public clienteSeleccionado: ListaEspera;
  public mesaSeleccionada: Mesa;

  public select: string = '';

  constructor(private authService: AuthService, private router: Router, private serv: UsuariosService, 
    private mesaService: MesaService) {
    this.traerListaEspera();
    this.traerListaMesa();
   }

  ngOnInit() {
  }

  async traerListaEspera(){
    this.mesaService.getListaEspera().subscribe(item => {
      this.listaEspera = item;
      this.listaEsperaFiltro = this.filtrarPendientes();
      // console.log(this.listaEspera);
    })
    this.serv.getClientes().subscribe(item => {
      this.clientes = item;
      // console.log(this.clientes);
    });
  }

  async traerListaMesa(){
    this.mesaService.getListaMesa().subscribe(item => {
      this.listaMesa = item;
      this.listaMesaLibre = this.filtrarLibres();
      // console.log(this.listaMesa);
    })
  }

  filtrarPendientes() {
    return this.listaEspera.filter(usuario => usuario.estado == false);
  }

  filtrarLibres() {
    return this.listaMesa.filter(mesa => mesa.estado == "libre");
  }


  async seleccionarCliente(cliente: ListaEspera){
    this.clienteSeleccionado = cliente;
    this.select = "select"; 
  }
  async seleccionarMesa(mesa: Mesa){
    this.mesaSeleccionada = mesa; 
    this.select = "select"; 
  }

  async asignarMesa(){
    this.clienteSeleccionado.estado = true;
    this.mesaService.actualizarClienteListaEspera(this.clienteSeleccionado);

    this.mesaSeleccionada.estado = "ocupado";
    this.mesaSeleccionada.usuario = this.clienteSeleccionado.usuario;
    this.mesaSeleccionada.mozoAsignado = "dgMzu3eG5kNN77m6DDsRmM6EXz43";
    // asignar nombre y mozo aleatorio
    this.mesaService.actualizarMesa(this.mesaSeleccionada);

    this.select = "confirmado"; 
  }

  async cancelarSeleccion(){
    this.back();
    // this.clienteSeleccionado = ; 
    // this.mesaSeleccionada = mesa; 
  }

  async back(){
    this.router.navigateByUrl('home', { replaceUrl: true });
  }

  async logout(){
    await this.authService.logout();

    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/classes/cliente';
import { ListaEspera } from 'src/app/classes/lista-espera';
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

  constructor(private authService: AuthService, private router: Router, private serv: UsuariosService, 
    private mesaService: MesaService) {
    this.traerListaEspera();
   }

  ngOnInit() {
  }

  async traerListaEspera(){
    this.mesaService.getListaEspera().subscribe(item => {
      this.listaEspera = item;
      console.log(this.listaEspera);
    })
    this.serv.getClientes().subscribe(item => {
      this.clientes = item;
      console.log(this.clientes);
    });
  }
  async logout(){
    await this.authService.logout();

    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}


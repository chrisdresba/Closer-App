import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  listaUsuarios: any;
  listaPendientes: any;

  constructor() { }

  ngOnInit() {
    // this.obtenerUsuarios();
  }

  // obtenerUsuarios() {
  //   this.usuarioService.obtenerUsuarios().subscribe(usuarios => {
  //     this.listaPendientes = this.filtrarPendientes();
  //   }, error => console.log(error));
  // }

  // filtrarPendientes() {
  //   return this.listaUsuarios.filter(usuario => usuario.estado === EstadoUsuario.PENDIENTE
  //     && (this.getPerfil() === 'METRE'
  //       ? (usuario.perfil === TipoUsuario.CLIENTE_ANONIMO || usuario.perfil === TipoUsuario.CLIENTE_REGISTRADO)
  //       : true));
  // }
}

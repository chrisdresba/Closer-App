import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ValidacionUsuario } from 'src/app/enumerados/validacion-usuario';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  listaUsuarios: any[] = [];
  listaPendientes: any[] = [];

  constructor(public usuarioService: UsuariosService, private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.obtenerUsuarios();
  }

  obtenerUsuarios() {
    this.usuarioService.getClientes().subscribe(usuarios => {
      this.listaUsuarios = usuarios;
      this.listaPendientes = this.filtrarPendientes();
    }, error => console.log(error));
  }

  filtrarPendientes() {
    return this.listaUsuarios.filter(usuario => usuario.validacion === ValidacionUsuario.PENDIENTE);
  }

  aprobarUsuario(usuario) {

  }

  declinarUsuario(usuario) {

  }

  async logout() {
    await this.authService.logout();
    localStorage.removeItem('sesionRol');
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  back() {
    this.router.navigate(["home"]);
  }
}

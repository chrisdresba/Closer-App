import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ValidacionUsuario } from 'src/app/enumerados/validacion-usuario';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/classes/cliente'
import { ToastService } from 'src/app/services/toast.service'
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {

  listaUsuarios: any[] = [];
  listaPendientes: any[] = [];

  constructor(public usuarioService: UsuariosService, private authService: AuthService, private router: Router, private toastService: ToastService, private loadingController: LoadingController) { }

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

  async aprobarUsuario(usuario: Cliente, permitido: boolean) {
    const loading = await this.loadingController.create();
    await loading.present();

    permitido ? usuario.validacion = ValidacionUsuario.APROBADO : usuario.validacion = ValidacionUsuario.RECHAZADO;

    this.usuarioService.actualizarCliente(usuario).then((resultado) => {
      // this.toastService.presentToast("Información:", "Usuario actualizado correctamente.", "success");
    }, (err) => {
      console.log(err);
    });

    await loading.dismiss();
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

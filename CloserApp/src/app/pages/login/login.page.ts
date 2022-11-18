import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Cliente } from 'src/app/classes/cliente';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from '../../services/auth.service';
import { ValidacionUsuario } from 'src/app/enumerados/validacion-usuario'
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  opcion: string;
  public listado: Cliente[] = [];
  estado: boolean;
  // cargarEmail: string;
  // cargarPassword: string;

  constructor(private fb: FormBuilder, private loadingController: LoadingController, public toastSrv: ToastService, private toast: ToastController,
    private authService: AuthService, private alertController: AlertController, private router: Router, public serv: UsuariosService, private pnService: PushNotificationService) {
    this.opcion = "Staff";
    // this.cargarEmail="";
    // this.cargarPassword="";
    this.serv.getClientes().subscribe(item => {
      this.listado = item;
    });
  }

  get email() {
    return this.credentials.get('email');
  }
  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.router.navigate(["register"]);
    await loading.dismiss();

    /*  if(user){
        this.showAlert('Registro exitoso','!!!!');
      } else {
        this.showAlert('Registro falló','!!!!');
      }*/
  }

  async anonimo() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.router.navigate(["register-anonimo"]);
    await loading.dismiss();
  }

  async login() {
    const email = this.credentials.value.email;
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    this.estado = this.buscarCliente(email);

    await loading.dismiss();

    if (user) {
      if (this.estado) {
        this.serv.rolUsuario(email);
        this.router.navigate(['home']);

        this.pnService.inicializar();
      } else {
        this.presentToast("Ingreso", "El usuario aún no fue validado!", "warning");
      }
    } else {
      this.presentToast("Ingreso", "El usuario o la contraseña son incorrectos!", "warning");
    }
  }


  async cargarUsuario(numero: string) {
    switch (numero) {
      case '1':
        this.credentials.setValue({ email: 'admin@admin.com', password: '111111' });
        this.opcion = "Admin";
        break;
      case '2':
        this.credentials.setValue({ email: 'supervisor@supervisor.com', password: '123456' });
        this.opcion = "Supervisor";
        break;
      case '3':
        this.credentials.setValue({ email: 'metre@metre.com', password: '333333' });
        this.opcion = "Metre";
        break;
      case '4':
        this.credentials.setValue({ email: 'mozo@mozo.com', password: '444444' });
        this.opcion = "Mozo";
        break;
      case '5':
        this.credentials.setValue({ email: 'cliente@cliente.com', password: '123456' });
        // this.opcion = "Cliente";
        break;
      case '6':
        this.credentials.setValue({ email: 'cliente10@cliente.com', password: '123456' });
        // this.opcion = "Cliente";
        break;
      case '7':
        this.credentials.setValue({ email: 'cocinero@cocinero.com', password: '123456' });
        this.opcion = "Cocinero";
        break;
      case '8':
        this.credentials.setValue({ email: 'bartender@bartender.com', password: '123456' });
        this.opcion = "Bartender";
        break;
      }
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({ header, message, buttons: ['OK'], });
    await alert.present();
  }

  buscarCliente(email: string) {
    for (let i = 0; i < this.listado.length; i++) {
      if (this.listado[i].email == email && (this.listado[i].validacion == ValidacionUsuario.PENDIENTE || this.listado[i].validacion == ValidacionUsuario.RECHAZADO)){
        return false
      }
    }
    return true;
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

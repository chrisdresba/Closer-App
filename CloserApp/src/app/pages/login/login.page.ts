import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  opcion:string;

  // cargarEmail: string;
  // cargarPassword: string;

  constructor(private fb: FormBuilder, private loadingController: LoadingController, 
    private authService: AuthService, private alertController: AlertController, private router: Router) 
  { 
    this.opcion = "Staff";        
    // this.cargarEmail="";
    // this.cargarPassword="";
  }

  get email(){
    return this.credentials.get('email');
  }
  get password(){
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

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if(user){
      this.showAlert('Registro exitoso','!!!!');
    } else {
      this.showAlert('Registro falló','!!!!');
    }
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if(user){
      // this.showAlert('Ingreso home','!!!!');
      this.router.navigate(['home']);
    } else {
      this.showAlert('Ingreso falló','!!!!');
    }
  }

  async cargarUsuario(numero:string){
    switch(numero){
      case '1':
        this.credentials.setValue({email:'admin@admin.com', password:'111111'});
        this.opcion = "Admin";        
        break;
      case '2':
        this.credentials.setValue({email:'supervisor@supervisor.com', password:'123456'});
        this.opcion = "Supervisor";        
        break;
      case '3':
        this.credentials.setValue({email:'metre@metre.com', password:'333333'});
        this.opcion = "Metre";        
        break;
      case '4':
        this.credentials.setValue({email:'mozo@mozo.com', password:'444444'});
        this.opcion = "Mozo";        
        break;
      case '5':
        this.credentials.setValue({email:'cliente@cliente.com', password:'123456'});
        this.opcion = "Cliente";        
        break;
      }  
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({header, message, buttons: ['OK'], });
    await alert.present();
  }
}

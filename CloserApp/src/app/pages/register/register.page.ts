import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/classes/cliente';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  user: Cliente;
  foto: string;
  loginForm: FormGroup;
  perfilCliente:boolean = true;
  view:boolean = false;

  constructor(
    public authSrv: AuthService,
    private router: Router,
    private fromBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loginForm = this.fromBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["",Validators.compose([Validators.required, Validators.maxLength(6)])],
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
      apellido: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
      dni: ["", Validators.compose([Validators.required,Validators.max(99999999)])],
      fotoUrl: ["urlFoto", Validators.compose([Validators.required])],
    });
  }

  viewPerfil(value:boolean){
    this.perfilCliente = value;
    this.view = true;
  }

  back(){
    this.view = false;
  }

  guardarUsuario(){
    console.log(this.loginForm.value.email)
    console.log(this.loginForm.value.password)
    console.log(this.loginForm.value.nombre)
    console.log(this.loginForm.value.apellido)
    console.log(this.loginForm.value.dni)
  }

  Logout() {
    localStorage.removeItem('creditos');
    localStorage.removeItem('usuario');
    this.authSrv.logout();
    this.router.navigate(["login"]);
  }
}

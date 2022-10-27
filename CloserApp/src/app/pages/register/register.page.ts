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
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  dni: number;
  fotoUrl: string;
  loginForm: FormGroup;
  perfilCliente:boolean = true;

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
      fotoUrl: ["", Validators.compose([Validators.required, Validators.email])],
    });
  }

  viewPerfil(value:boolean){
    this.perfilCliente = value;
  }

  Logout() {
    localStorage.removeItem('creditos');
    localStorage.removeItem('usuario');
    this.authSrv.logout();
    this.router.navigate(["login"]);
  }
}

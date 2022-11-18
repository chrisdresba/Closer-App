import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-juego-dos',
  templateUrl: './juego-dos.page.html',
  styleUrls: ['./juego-dos.page.scss'],
})

export class JuegoDosPage implements OnInit {
  public random: number = 0;
  public letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  public palabras = ['ANGULAR', 'TYPESCRIPT', 'EXCELENTE', 'METODOS', 'LOCALIZAR', 'AVELLANEDA', 'FACULTAD', 'INVERSION', 'CAPACIDAD', 'MIERCOLES'];
  public palabra: any;
  public palabraAuxiliar: any;
  public letrasAuxiliar: any;
  public espacios: number = 0;
  public intentos: number = 0;
  public puntaje: number = 0;
  public vidas: number = 5;
  public url: string = "assets/ahorcado/ahorcado" + this.intentos + ".jpg";
  public unidad: string = "";
  public juego: string = "ahorcado";
  public usuario:any;
  public usuarioLogueado:string = '';
  public fecha:any;

  constructor(public afAuth: AngularFireAuth, private router: Router, private authService: AuthService,
    private toast: ToastController
    //,public serv: ResultadosService
    ) {
    this.iniciar();
  }

  ngOnInit(): void {
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (!user) {
        this.usuarioLogueado = 'anonimo';
      } else {
        this.usuario = user;
        this.usuarioLogueado = this.usuario.email;
      }
    })
  }

  iniciar() {
    this.random = Math.round(Math.random() * 9);
    this.palabra = Array.from(this.palabras[this.random]);
    this.palabraAuxiliar = new Array(this.palabra.length - 1);
    for (let i = 0; i < this.palabra.length; i++) {
      this.palabraAuxiliar[i] = '';
    }
    this.letrasAuxiliar = new Array();
  }

  letrasIngresadas(letra: any) {

    for (let i = 0; i < this.letrasAuxiliar.length; i++) {
      if (this.letrasAuxiliar[i] == letra) {
        return false;
      }
    }
    return true;
  }

  buscar(letra: any) {

    if (this.intentos < 6 && this.letrasIngresadas(letra)) {
      let auxiliar = 0;
      for (let i = 0; i < this.palabra.length; i++) {
        if (this.palabra[i] == letra) {
          this.palabraAuxiliar[i] = letra;
          auxiliar++;
        }

      }

      //guardo la letra que ingreso para que no se repitan
      this.letrasAuxiliar.push(letra);

      if (auxiliar == 0) {
        this.intentos++;
        this.url = "assets/ahorcado/ahorcado" + this.intentos + ".jpg";
      }

      if (this.arrayEquals(this.palabra, this.palabraAuxiliar)) {
        // Swal.fire({
        //   icon: 'success',
        //   title: 'Excelente',
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
        setTimeout(() => {
          this.puntaje = this.puntaje + 10;
          this.recargar();
        }, 3000)
      }
    }
    if (this.intentos == 6) {
      this.palabraAuxiliar = this.palabra;
      this.vidas--;

      if (this.vidas == 0) {
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'Perdiste, volvamos a jugar',
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
        this.guardarResultado();
        this.vidas = 4;
        this.puntaje = 0;
        this.recargar();
      }else{
        // Swal.fire({
        //   icon: 'warning',
        //   title: 'Vuelve a intentarlo',
        //   showConfirmButton: false,
        //   timer: 1500,
        // });
        this.recargar();
      }

    }

  }

  recargar() {
    this.intentos = 0;
    this.url = "assets/ahorcado/ahorcado" + this.intentos + ".jpg";
    this.iniciar();
  }

  arrayEquals(a: any, b: any) {
    return Array.isArray(a) &&
      Array.isArray(b) &&
      a.length === b.length &&
      a.every((val, index) => val === b[index]);
  }


  guardarResultado(){
    let pipe = new DatePipe('en-US');
    this.fecha = String(pipe.transform(Date.now(), 'dd/MM/yyyy'));
    // let resultado = new Resultados();
    // resultado.crearResultado(this.usuarioLogueado,this.puntaje,this.juego,this.fecha);
    // this.serv.guardarResultado(resultado);
  }

  async presentToast(header: string, message: string, color: string) {
    const toast = await this.toast.create({
      header,
      message,
      color,
      duration: 2000,
      position: "middle"
    });
    toast.present();
  }

  Logout() {
    localStorage.removeItem('sesionRol');
    this.authService.logout();
    this.router.navigate(["login"]);
  }

  back() {
    this.router.navigate(["home"]);
  }

}
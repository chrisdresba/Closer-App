import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { uuidv4 } from '@firebase/util';
import { Console } from 'console';
import { Encuesta } from 'src/app/classes/encuesta';
import { Pedido } from 'src/app/classes/pedido';
import { EstadoPedido } from 'src/app/enumerados/estado-pedido';
import { AuthService } from 'src/app/services/auth.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
import { PedidosService } from 'src/app/services/pedidos.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-encuesta',
  templateUrl: './encuesta.page.html',
  styleUrls: ['./encuesta.page.scss'],
})
export class EncuestaPage implements OnInit {

  public formEncuesta: FormGroup;
  encuesta: Encuesta;
  uuid: string = '';
  personal: string = '';
  comida: string = '';
  recomendacion: string = '';

  usuarioLogin: string;
  usuario: any;
  confirmar: boolean = false;

  pedido: Pedido;
  listaPedidos: Pedido[] = [];

  constructor(private router: Router, private authService: AuthService, private encuestaService: EncuestaService,
    private formBuilder: FormBuilder, private afAuth: AngularFireAuth, public toastSrv: ToastService, 
    private pedidoService: PedidosService ) { 
      this.formEncuesta = this.formBuilder.group({
        // 'comida': ['', Validators.required],
        // 'recomendacion': ['', Validators.required],
        // 'personal': ['', Validators.required]
   
      });
    }

  ngOnInit() {
    this.usuario = this.afAuth.onAuthStateChanged(user => {
      if (user) {
        this.usuario = user;
        this.usuarioLogin = this.usuario.email;
      }
    })

    if (localStorage.getItem('anonimo')) {
      this.usuarioLogin = localStorage.getItem('anonimo');
    }
    this.traerPedidos(this.usuarioLogin);
  }

  async checkValueComida(event) { 
    this.comida = event.detail.value;  
    // console.log(event.detail.value);
  }

  async checkValuePersonal(event) { 
    this.personal = event.detail.value;  
    // console.log(event.detail.value);
  }

  async checkValueRecomendacion(event) { 
    this.recomendacion = event.detail.value;  
    // console.log(event.detail.value);
  }

  filtrarPedidos(userLogin: string) {
    console.log("userLogin", userLogin);
    console.log("log",this.usuarioLogin);
    for( let i=0; i< this.listaPedidos.length; i++) {
      console.log (this.listaPedidos[i].usuario, this.listaPedidos[i].estado);
      if (this.usuarioLogin == this.listaPedidos[i].usuario && this.listaPedidos[i].estado != EstadoPedido.CONFIRMAR && 
          this.listaPedidos[i].estado != EstadoPedido.PENDIENTE) {
            this.pedido = this.listaPedidos[i];       
            break;
      }      
    }
    console.log("filtro", this.pedido);
  }

  async agregarEncuesta(){

    this.uuid = uuidv4();
    this.encuesta = new Encuesta();

    this.encuesta.uid = this.uuid;
    // this.encuesta.comida = this.formEncuesta.controls['comida'].value;
    // this.encuesta.recomendacion = this.formEncuesta.controls['recomendacion'].value;
    // this.encuesta.personal = this.formEncuesta.controls['personal'].value;

    // console.log(this.recomendacion);
    if(this.recomendacion == 'default'){
      this.encuesta.recomendacion = 'SI';
    } else {
      this.encuesta.recomendacion = this.recomendacion;
    }
    this.encuesta.personal = this.personal;
    this.encuesta.comida = this.comida;
    this.encuesta.usuario = this.usuarioLogin;

    this.encuestaService.agregarEncuesta(this.encuesta);

    this.presentToast("Confirmado", "La encuesta fue ingresada con éxito", "success");
    this.confirmar = true;

    // this.traerPedidos();

    if(this.pedido){
      console.log("pedi",this.pedido);
      this.pedido.uidEncuesta = this.uuid;
      this.pedidoService.actualizarEstadoPedido(this.pedido);
    }
    // this.back();
  }

  async traerPedidos(usuarioLogueado: string){
    this.pedidoService.getPedidos().subscribe(aux => {
      this.listaPedidos = aux;
      console.log("lista",this.listaPedidos);
      this.filtrarPedidos(usuarioLogueado);
    });
    }

  async presentToast(header: string, message: string, color: string) {
    const toast = await this.toastSrv.toast.create({
      header,
      message,
      color,
      duration: 2500,
      position: "middle"
    });
    toast.present();
  }

  async back(){
    this.router.navigateByUrl('home', { replaceUrl: true });
  }

  async logout(){
    await this.authService.logout();

    this.router.navigateByUrl('/', { replaceUrl: true });
  }  
}

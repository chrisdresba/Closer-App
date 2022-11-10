import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Cliente } from 'src/app/classes/cliente';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ValidacionUsuario } from 'src/app/enumerados/validacion-usuario'
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

declare let window: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {

  usuario: Cliente;
  foto: string;
  loginForm: FormGroup;
  perfilCliente: boolean = true;
  view: boolean = true;
  fecha: string;
  hora: string;
  storageRef = this.storage.storage.ref();
  nombre:string;
  apellido:string;
  dni: number; 

  scannedResult: any;
  content_visibility = '';

  options: CameraOptions = {
    quality: 50,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: this.camera.PictureSourceType.CAMERA
  }

  constructor(
    public authSrv: AuthService,
    private router: Router,
    private fromBuilder: FormBuilder,
    public servUsuario: UsuariosService,
    public toastSrv: ToastService,
    private toast: ToastController,
    private storage: AngularFireStorage,
    public loadingController: LoadingController,
    private camera: Camera,
  ) {

  }

  ngOnInit() {
    this.loginForm = this.fromBuilder.group({
      email: ["", Validators.compose([Validators.required, Validators.email])],
      password: ["", Validators.compose([Validators.required, Validators.minLength(6)])],
      passwordAux: ["", Validators.compose([Validators.required, Validators.minLength(6)])],
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
      apellido: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
      dni: ["", Validators.compose([Validators.required, Validators.max(99999999)])],
      //  fotoUrl: ["", Validators.compose([Validators.required])],
    });
   
  }



  async guardarUsuario() {
    try {
      let email, password, passAux, nombre, apellido, dni, foto;

        email = this.loginForm.value.email;
        password = this.loginForm.value.password;
        passAux = this.loginForm.value.passwordAux;
        nombre = this.loginForm.value.nombre;
        apellido = this.loginForm.value.apellido;
        dni = this.loginForm.value.dni;
        foto = this.foto;

      if (password == passAux) {

        if (this.validarEmail(email) && this.validarContraseña(password)) {
          const user = await this.authSrv.register({ email, password });
          if (user) {
            const uid = user.user?.uid;
            this.usuario = new Cliente();
            this.usuario.uid = uid;
            this.usuario.email = email;
            this.usuario.nombre = nombre;
            this.usuario.apellido = apellido;
            this.usuario.dni = dni;
            this.usuario.fotoURL = foto;
            this.usuario.validacion = ValidacionUsuario.PENDIENTE;
            this.usuario.estado = "inactivo";

            this.servUsuario.saveCliente(this.usuario);
            this.presentToast("Registro", "Usuario creado con exito", "success");

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 3000)
          } else {
            this.presentToast("Registro", "Usuario incorrecto o existente", "warning");
          }
        }
      } else {
        this.presentToast("Registro", "Las contraseñas deben ser iguales", "warning");
      }
    } catch (error) {
      console.log(error);
    }
  }


  activarCamara() {
    this.camera.getPicture(this.options).then((imageData) => {
      let $imagen = 'data:image/jpeg;base64,' + imageData;
      const file = this.base64ToImage($imagen);
      this.subirArchivo(file);
      this.presentLoading();
    }, (err) => {
      console.log(err);
      this.presentToast("Camara", "intentelo más tarde", "warning");
    });

  }

  async subirArchivo(file: any) {
    var res = new Date();
    this.fecha = res.getFullYear() + "-" + (res.getMonth() + 1) + "-" + res.getDate();
    this.hora = res.getHours() + ":" + res.getMinutes() + ":" + res.getSeconds();
    const imagenUnoNombre = this.usuario + this.fecha + '-' + this.hora + '.jpeg';
    const ref = this.storage.ref(imagenUnoNombre);
    this.storage.upload(imagenUnoNombre, file)
      .then((termino) => termino.ref.getDownloadURL().then((URL) => {
        this.foto = URL;
      }))

  }

  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }


  /////// Lectura Qr
  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // the user granted permission
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }

  async ReadQrCode() {

    try {
      const permission = await this.checkPermission();
      if(!permission) {
        return;
      }
      await BarcodeScanner.hideBackground();
      document.querySelector('body').classList.add('scanner-active');
      this.content_visibility = 'hidden';
      const result = await BarcodeScanner.startScan();
      this.setValoresQr(result.content);

      BarcodeScanner.showBackground();
      document.querySelector('body').classList.remove('scanner-active');
      this.content_visibility = '';
      if(result?.hasContent) {
        this.scannedResult = result.content;
        console.log(this.scannedResult);
      }
    } catch(e) {
      console.log(e);
      this.stopScan();
    } 
    
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body').classList.remove('scanner-active');
    this.content_visibility = '';
  }

  ngOnDestroy(): void {
    this.stopScan();
  }

  setValoresQr(value: any) {
    let arr = value.split('@');
    this.nombre = arr[2];
    this.apellido = arr[1];
    this.dni = parseInt(arr[4]);
  }
  ///////

  Logout() {
    localStorage.clear();
    this.authSrv.logout();
    this.router.navigate(["login"]);
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

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'circles',
      message: 'Cargando...',
      duration: 2000,
      translucent: true,

      cssClass: 'my-loading-class'

    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

  }

  validarEmail(email: string) {
    let expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!expr.test(email)) {
      return false;
    } else {
      return true;
    }
  }

  validarContraseña(contraseña: string) {
    if (contraseña.length >= 6) {
      return true;
    } else {
      return false;
    }
  }
}

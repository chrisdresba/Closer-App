import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ValidacionUsuario } from 'src/app/enumerados/validacion-usuario'

declare let window: any;

@Component({
  selector: 'app-register-anonimo',
  templateUrl: './register-anonimo.page.html',
  styleUrls: ['./register-anonimo.page.scss'],
})
export class RegisterAnonimoPage implements OnInit {
  foto: string;
  auxForm: FormGroup;
  nombre:string;
  fecha: string;
  hora: string;
  storageRef = this.storage.storage.ref();

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
  ) { }

  ngOnInit() {
    this.auxForm = this.fromBuilder.group({
      nombre: ["", Validators.compose([Validators.required, Validators.minLength(3)])],
    });
  }


  async guardarUsuario() {
    try {
      let nombre, foto;
     // this.foto = 'foto'; /////VALOR ETAPA DE PRUEBA
      nombre = this.auxForm.value.nombre;
      foto = this.foto;

      if(nombre.length > 0 && foto.length > 0){
      localStorage.setItem('anonimo',nombre);
      localStorage.setItem('anonimoImg',foto);  
      localStorage.setItem('sesionRol', 'cliente')
      this.presentToast("Ingreso", "Usuario creado con exito", "success");
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000)
    }else{
      this.presentToast("Ingreso", "Debe ingresar su nombre y una foto", "warning");
    }

  } catch(error) {
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
  const imagenUnoNombre = this.auxForm.value.nombre; + this.fecha + '-' + this.hora + '.jpeg';
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



}

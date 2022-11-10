import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { uuidv4 } from '@firebase/util';
import { Encuesta } from 'src/app/classes/encuesta';
import { AuthService } from 'src/app/services/auth.service';
import { EncuestaService } from 'src/app/services/encuesta.service';

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
  
  constructor(private router: Router, private authService: AuthService, private encuestaService: EncuestaService,
    private formBuilder: FormBuilder) { 
      this.formEncuesta = this.formBuilder.group({
        // 'comida': ['', Validators.required],
        // 'recomendacion': ['', Validators.required],
        // 'personal': ['', Validators.required]
   
      });
    }

  ngOnInit() {
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

async agregarEncuesta(){

    this.uuid = uuidv4();
    this.encuesta = new Encuesta();
    this.encuesta.uid = this.uuid;
    // this.encuesta.comida = this.formEncuesta.controls['comida'].value;
    // this.encuesta.recomendacion = this.formEncuesta.controls['recomendacion'].value;
    // this.encuesta.personal = this.formEncuesta.controls['personal'].value;

    this.encuesta.recomendacion = this.recomendacion;
    this.encuesta.personal = this.personal;
    this.encuesta.comida = this.comida;

    this.encuestaService.agregarEncuesta(this.encuesta);
  }

  async back(){
    this.router.navigateByUrl('home', { replaceUrl: true });
  }

  async logout(){
    await this.authService.logout();

    this.router.navigateByUrl('/', { replaceUrl: true });
  }  
}

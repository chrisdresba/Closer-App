import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Encuesta } from 'src/app/classes/encuesta';
import { AuthService } from 'src/app/services/auth.service';
import { EncuestaService } from 'src/app/services/encuesta.service';
// import * as Chart from "chart.js";

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  usuario: any;
  usuarioLogin: string;
  listaEncuestas: Encuesta[] = [];

  public excelente: number = 0;
  public normal: number = 0;
  public basura: number = 0;
  public si: number = 0;
  public no: number = 0;
  public cero: number = 0;
  public uno: number = 0;
  public dos: number = 0;
  public tres: number = 0;
  public cuatro: number = 0;
  public cinco: number = 0;
  public seis: number = 0;
  public siete: number = 0;
  public ocho: number = 0;
  public nueve: number = 0;
  public diez: number = 0;

  constructor(private encuestaService: EncuestaService, private authService: AuthService, 
    private afAuth: AngularFireAuth, private router: Router) {
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

    this.encuestaService.getEncuestas().subscribe(item => {
      this.listaEncuestas = item;
      console.log(this.listaEncuestas);

      this.armarGraficos(this.listaEncuestas);
    });

  }

  actualizar(){
    this.encuestaService.getEncuestas().subscribe(item => {
      this.listaEncuestas = item;
      console.log(this.listaEncuestas);

      document.getElementById('comida').remove();
      document.getElementById('personal').remove();
      document.getElementById('recomendacion').remove();

      // document.getElementById('comida'); 
      // document.getElementById('personal');
      // document.getElementById('recomendacion');
      
      this.armarGraficos(this.listaEncuestas);
    });
  }

  armarGraficos(listaEncuesta: Encuesta[]){

    listaEncuesta.forEach(encuesta => {
      switch (encuesta.comida){
        case 'Excelente':
          this.excelente += 1;
          break;
        case 'Normal':
          this.normal += 1;
          break;
        case 'Basura':
          this.basura += 1;
          break;
        }

      switch (encuesta.personal.toString()){
        case '0':
          this.cero += 1;
          break;
        case '1':
          this.uno += 1;
          break;
        case '2':
          this.dos += 1;
          break;
        case '3':
          this.tres += 1;
          break;
        case '4':
          this.cuatro += 1;
          break;
        case '5':
          this.cinco += 1;
          break;
        case '6':
          this.seis += 1;
          break;
        case '7':
          this.siete += 1;
          break;
        case '8':
          this.ocho += 1;
          break;
        case '9':
          this.nueve += 1;
          break;
        case '10':
          this.diez += 1;
          break;

        }
  
      switch (encuesta.recomendacion){
        case 'SI':
          this.si += 1;
          break;
        case 'NO':
          this.no += 1;
          break;
        }

    });
    console.log(this.excelente);
    console.log(this.normal);
    console.log(this.basura);
    console.log(this.si);
    console.log(this.no);
    console.log(this.cero);
    console.log(this.uno);
    console.log(this.dos);
    console.log(this.tres);
    console.log(this.cuatro);
    console.log(this.cinco);
    console.log(this.seis);
    console.log(this.siete);
    console.log(this.ocho);
    console.log(this.nueve);
    console.log(this.diez);

    const dataPie = [
        { year: 'Excelente', count: this.excelente },
        { year: 'Normal', count: this.normal },
        { year: 'Basura', count: this.basura },
      ];
    
      new Chart(
        document.getElementById('comida') as HTMLCanvasElement,
        {
          type: 'pie',
          options: {
            animation: false,
            plugins: {
              legend: {
                display: true
              },
              tooltip: {
                enabled: true
              }
            }
          },
          data: {
            labels: dataPie.map(row => row.year),
            datasets: [
              {
                label: 'Comida',
                data: dataPie.map(row => row.count)
              }
            ]
          }
        }
      );

      const dataLine = [
        { year: 0, count: this.cero },
        { year: 1, count: this.uno },
        { year: 2, count: this.dos },
        { year: 3, count: this.tres },
        { year: 4, count: this.cuatro },
        { year: 5, count: this.cinco },
        { year: 6, count: this.seis },
        { year: 7, count: this.siete },
        { year: 8, count: this.ocho },
        { year: 9, count: this.nueve },
        { year: 10, count: this.diez },
      ];
    
      new Chart(
        document.getElementById('personal') as HTMLCanvasElement,
        {
          type: 'line',
          options: {
            animation: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: true
              }
            }
          },
          data: {
            labels: dataLine.map(row => row.year),
            datasets: [
              {
                label: 'Personal',
                data: dataLine.map(row => row.count)
              }
            ]
          }
        }
      );

      const data = [
        { year: 'SÍ', count: this.si },
        { year: 'NO', count: this.no },
      ];
    
      new Chart(
        document.getElementById('recomendacion') as HTMLCanvasElement,
        {
          type: 'bar',
          options: {
            animation: false,
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: true
              }
            }
          },
          data: {
            labels: data.map(row => row.year),
            datasets: [
              {
                label: 'Recomendacion',
                data: data.map(row => row.count),
                backgroundColor: [
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(255, 99, 132, 0.2)'
                ],
                borderColor: [
                  'rgb(75, 192, 192)',
                  'rgb(255, 99, 132)'
                ],
                borderWidth: 1
            
              }
            ]
          }
        }
      );

      

  }

  async back(){
    this.router.navigateByUrl('home', { replaceUrl: true });
  }

  async logout(){
    await this.authService.logout();

    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}

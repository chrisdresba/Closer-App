import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { AuthService } from 'src/app/services/auth.service';
// import * as Chart from "chart.js";

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
})
export class GraficosPage implements OnInit {

  usuario: any;
  usuarioLogin: string;

  constructor(private authService: AuthService, private afAuth: AngularFireAuth, private router: Router) { }

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

    (async function() {
      const dataPie = [
        { year: 'Excelente', count: 40 },
        { year: 'Normal', count: 20 },
        { year: 'Basura', count: 15 },
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
                enabled: false
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
        { year: 0, count: 5 },
        { year: 1, count: 20 },
        { year: 2, count: 15 },
        { year: 3, count: 25 },
        { year: 4, count: 22 },
        { year: 5, count: 30 },
        { year: 6, count: 28 },
        { year: 7, count: 40 },
        { year: 8, count: 20 },
        { year: 9, count: 35 },
        { year: 10, count: 55 },
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
                enabled: false
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
        { year: 'SÍ', count: 80 },
        { year: 'NO', count: 28 },
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
                enabled: false
              }
            }
          },
          data: {
            labels: data.map(row => row.year),
            datasets: [
              {
                label: 'Recomendacion',
                data: data.map(row => row.count)
              }
            ]
          }
        }
      );

    })();

    // const labels = ['Enero', 'Febrero', 'Marzo', 'Abril']

    // const graph = document.querySelector("#grafica") as HTMLCanvasElement;
        
    // const config= {
    //   type: 'bar',
    //   data: {
    //     labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    //     datasets: {
    //       label:"Ejemplo 1",
    //       data: [1, 2, 3, 4],
    //       backgroundColor: 'rgba(9, 129, 176, 0.2)'
    //             }
    //   }
    //       }
    // new Chart(graph, config);


    
    // var ctx = document.getElementById('graph') as HTMLCanvasElement;
    // this.chart = new Chart({ 
    //     type: 'bar',
    //     data: {
    //            labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    //            datasets: {
    //              label:"Ejemplo 1",
    //              data: [1, 2, 3, 4],
    //              backgroundColor: 'rgba(9, 129, 176, 0.2)'
    //                    }
        
    // };)


  }

  async back(){
    this.router.navigateByUrl('home', { replaceUrl: true });
  }

  async logout(){
    await this.authService.logout();

    this.router.navigateByUrl('/', { replaceUrl: true });
  }

}

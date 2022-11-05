import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(private http: HttpClient) { }

  sendEmail(usuario: any, cuerpo: any, subject: string) {
    this.http.post(`https://us-central1-closer-pps.cloudfunctions.net/mailer`, {
      to: usuario.correo,
      // to: 'TuMailPersonal', //Test
      message: cuerpo,
      subject,
      // html: this.TemplateHtml(cuerpo)
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Neopolitan Confirm Email</title>
          <!-- Designed by https://github.com/kaytcat -->
          <!-- Robot header image designed by Freepik.com -->
      
          <style type="text/css">
            @import url(http://fonts.googleapis.com/css?family=Droid+Sans);
      
            /* Take care of image borders and formatting */
      
            img {
              max-width: 600px;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
            }
      
            a {
              text-decoration: none;
              border: 0;
              outline: none;
              color: #bbbbbb;
            }
      
            a img {
              border: none;
            }
      
            /* General styling */
      
            td,
            h1,
            h2,
            h3 {
              font-family: Helvetica, Arial, sans-serif;
              font-weight: 400;
            }
      
            td {
              text-align: center;
            }
      
            body {
              -webkit-font-smoothing: antialiased;
              -webkit-text-size-adjust: none;
              width: 100%;
              height: 100%;
              color: #37302d;
              background: #ffffff;
              font-size: 16px;
            }
      
            table {
              border-collapse: collapse !important;
            }
      
            .headline {
              color: #ffffff;
              font-size: 36px;
            }
      
            .force-full-width {
              width: 100% !important;
            }
      
            .force-width-80 {
              width: 80% !important;
            }
          </style>
      
          <style type="text/css" media="screen">
            @media screen {
              /*Thanks Outlook 2013! http://goo.gl/XLxpyl*/
              td,
              h1,
              h2,
              h3 {
                font-family: "Droid Sans", "Helvetica Neue", "Arial", "sans-serif" !important;
              }
            }
          </style>
      
          <style type="text/css" media="only screen and (max-width: 480px)">
            /* Mobile styles */
            @media only screen and (max-width: 480px) {
              table[class="w320"] {
                width: 320px !important;
              }
      
              td[class="mobile-block"] {
                width: 100% !important;
                display: block !important;
              }
            }
          </style>
        </head>
        <body
          class="body"
          style="
            padding: 0;
            margin: 0;
            display: block;
            background: #ffffff;
            -webkit-text-size-adjust: none;
          "
          bgcolor="#ffffff"
        >
          <table
            align="center"
            cellpadding="0"
            cellspacing="0"
            class="force-full-width"
            height="100%"
          >
            <tr>
              <td align="center" valign="top" bgcolor="#ffffff" width="100%">
                <center>
                  <table
                    style="margin: 0 auto"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                    class="w320"
                  >
                    <tr>
                      <td align="center" valign="top">
                        <table
                          style="margin: 0 auto"
                          cellpadding="0"
                          cellspacing="0"
                          class="force-full-width"
                          style="margin: 0 auto"
                        >
                          <tr>
                            <td style="font-size: 20px; text-align: center">
                              <br />
                              ${ cuerpo }
                              <br />
                              <br />
                            </td>
                          </tr>
                        </table>
      
                        <table
                          style="margin: 0 auto"
                          cellpadding="0"
                          cellspacing="0"
                          class="force-full-width"
                          bgcolor="#414141"
                          style="margin: 0 auto"
                        >
                          <br />
                          <tr>
                            <td class="headline">Closer Restaurante</td>
                          </tr>
                          <tr>
                            <td>
                              <br />
                              <img
                                src="https://firebasestorage.googleapis.com/v0/b/closer-pps.appspot.com/o/logosEmail%2Flogo2.png?alt=media&token=705d788f-b31b-42d0-861b-7df8d1e8f98a"
                                width="224"
                                height="240"
                                alt="robot picture"
                              />
                              <br />
                              <br />
                              <br />
                            </td>
                          </tr>
      
                          <tr>
                            <table style="table-layout: fixed; width: 100%">
                              <td style="background-color: #414141">
                                <a>
                                  <img
                                    src="https://firebasestorage.googleapis.com/v0/b/closer-pps.appspot.com/o/logosEmail%2FubicacionBlanco.png?alt=media&token=eba589fb-4949-4252-9651-03747d965e15"
                                    width="50"
                                    height="50"
                                  />
                                </a>
                                <br />
                                <p style="color: #bbbbbb; font-size: 12px">
                                  Av. Corrientes 6632
                                </p>
                              </td>
      
                              <td style="background-color: #414141">
                                <a>
                                  <img
                                    src="https://firebasestorage.googleapis.com/v0/b/closer-pps.appspot.com/o/logosEmail%2FemailBlanco.png?alt=media&token=c0667e8f-27de-4ec6-a12f-34acea2d265a"
                                    width="50"
                                    height="50"
                                  />
                                </a>
                                <br />
                                <p style="color: #bbbbbb; font-size: 12px">
                                  closerpps@gmail.com
                                </p>
                              </td>
      
                              <td style="background-color: #414141">
                                <a>
                                  <img
                                    src="https://firebasestorage.googleapis.com/v0/b/closer-pps.appspot.com/o/logosEmail%2FwhatsappBlanco.png?alt=media&token=dbfdd2b9-2f15-4db2-8252-314569a0841a"
                                    width="50"
                                    height="50"
                                  />
                                </a>
                                <br />
                                <p style="color: #bbbbbb; font-size: 12px">
                                  (+54) 1128739647
                                </p>
                              </td>
                            </table>
                          </tr>
      
                          <tr>
                            <td style="color: #bbbbbb; font-size: 12px">
                              <br />
                              <br />
                              © 2022 Todos los derechos reservados
                              <br />
                              <br />
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>
        </body>
      </html>`
    }).subscribe(res => {
      console.log(res);
    });
  }
}

import { Injectable } from '@angular/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';
// import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { LocalNotifications } from '@capacitor/local-notifications';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Staff } from 'src/app/classes/staff'
import { PushUserRolToken } from 'src/app/classes/push-user-rol-token'
import { UsrPushRolTokenService } from 'src/app/services/usr-push-rol-token.service';


@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private user;
  public listUserToken: PushUserRolToken[];

  constructor(
    private platform: Platform,
    // private firestore: Firestore,
    private http: HttpClient,
    private usrPushRolTokenService: UsrPushRolTokenService
  ) {

    this.usrPushRolTokenService.getUsersRolToken().subscribe(usuariosPushRolToken => {

      console.log('usuariosPushRolToken: ', usuariosPushRolToken);

      this.listUserToken = usuariosPushRolToken;

    }, error => console.log(error));
  }

  async inicializar(usuarioStaff: Staff): Promise<void> {
    this.addListeners(usuarioStaff);

    // Verificamos que este en un dispositivo y no en una PC y tambien que el usuario no tegna seteado el token
    // if (this.platform.is('capacitor') && this.user.token === '') {
    if (this.platform.is('capacitor')) {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  getUser(): void {
    // const aux = doc(this.firestore, 'personas/4hjcn6LXY1qVfxBDYub3');
    // docData(aux, { idField: 'id' }).subscribe(async (user) => {
    //   this.user = user;
    // this.inicializar();
    // });
  }

  sendPushNotification(req): Observable<any> {
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `key=${environment.fcmServerKey}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }

  private async addListeners(usuarioStaff: Staff): Promise<void> {
    //Ocurre cuando el registro de las push notifications finaliza sin errores
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        let isUsuarioEncontrado = false;
        let objetoUsuarioPush: PushUserRolToken = new PushUserRolToken();
        //Acá deberiamos asociar el token a nuestro usario en nuestra bd
        console.log('Registration token: ', token.value);

        for (let i = 0; i < this.listUserToken.length; i++) {
          if (this.listUserToken[i].email === usuarioStaff.email) {
            isUsuarioEncontrado = true;
            objetoUsuarioPush = this.listUserToken[i];
          }
        }

        if (isUsuarioEncontrado) {
          objetoUsuarioPush.token = token.value;

          this.usrPushRolTokenService.actualizarUserPushToken(objetoUsuarioPush).then((resultado) => {

          },
            (err) => {
              console.log(err);
            });
        } else {
          objetoUsuarioPush.email = usuarioStaff.email;
          objetoUsuarioPush.perfil = usuarioStaff.perfil;
          objetoUsuarioPush.token = token.value;

          this.usrPushRolTokenService.saveUserPushToken(objetoUsuarioPush).then((resultado) => {

          },
            (err) => {
              console.log(err);
            });
        }
      }
    );

    //Ocurre cuando el registro de las push notifications finaliza con errores
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    //Ocurre cuando el dispositivo recive una notificacion push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        //Esto se hace en el caso de que querramos que nos aparezca la notificacion en la task bar del celular ya que por
        //defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion push
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //Este evento solo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificacion
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion local
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
      }
    );
  }
}

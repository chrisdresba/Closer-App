import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Mensaje } from '../classes/mensaje';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public chat: Mensaje[] = [];

  constructor(private firestore: AngularFirestore) {
    this.getMensajes().subscribe(item => {
      this.chat = item;
    })
   }

   async guardarMensaje(usuario: any,mesa:any,mensaje: any) {
    let fecha = new Date();
    const dia = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
    const hora = fecha.getHours() + ':' + this.revision(fecha.getMinutes()) + ':' + this.revision(fecha.getSeconds());
    let referencia = (fecha.getHours() * 3600) + (fecha.getMinutes() * 60) + fecha.getSeconds();
    let texto = { 'usuario': usuario, 'fecha': dia, 'hora': hora, 'mensaje': mensaje, 'referencia': referencia,'mesa':mesa }
    return await this.firestore.collection('mensajes').add(texto);
  }

  getMensajes = (): Observable<any[]> => {
    return this.firestore.collection('mensajes').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as Mensaje[];
      })
    );
  }

  revision(dato: any) {
    if (dato < 10) {
      return ('0' + dato);
    }
    return dato;
  }

}

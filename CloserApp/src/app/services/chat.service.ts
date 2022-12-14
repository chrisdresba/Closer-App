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
  public chats01: Observable<any[]>;
  public chats02: Observable<any[]>;
  public chats03: Observable<any[]>;
  public chats04: Observable<any[]>;

  constructor(private firestore: AngularFirestore) {
    this.chats01 = this.firestore.collection('mensajes-mesa01').valueChanges();
    this.chats02 = this.firestore.collection('mensajes-mesa02').valueChanges();
    this.chats03 = this.firestore.collection('mensajes-mesa03').valueChanges();
    this.chats04 = this.firestore.collection('mensajes-mesa04').valueChanges();
  }


  async guardarMensaje(usuario: any, mesa: any, mensaje: any) {
    let fecha = new Date();
    const dia = fecha.getFullYear() + '-' + (fecha.getMonth() + 1) + '-' + fecha.getDate();
    const hora = fecha.getHours() + ':' + this.revision(fecha.getMinutes()) + ':' + this.revision(fecha.getSeconds());
    let referencia = (fecha.getHours() * 3600) + (fecha.getMinutes() * 60) + fecha.getSeconds();
    let texto = { 'usuario': usuario, 'fecha': dia, 'hora': hora, 'mensaje': mensaje, 'referencia': referencia, 'mesa': mesa }
    return await this.firestore.collection('mensajes-mesa' + mesa).add(texto);
  }

  eliminarSala(mesa: any) {
    return this.firestore.collection('mensajes-mesa' + mesa).ref.where( 'mesa', '==', mesa ).get().then( data => data.forEach( doc => doc.ref.delete() ) );
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

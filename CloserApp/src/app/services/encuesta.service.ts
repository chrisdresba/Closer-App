import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Encuesta } from '../classes/encuesta';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  constructor(private firestore: AngularFirestore) { }

  async agregarEncuesta(item: Encuesta) {
    let encuesta = { 'uid': item.uid, 'usuario': item.usuario, 'comida': item.comida, 'personal': item.personal, 
    'recomendacion': item.recomendacion };
    console.log('serv', encuesta);
    return await this.firestore.collection('encuestas').doc(item.uid).set(encuesta);
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Encuesta } from '../classes/encuesta';

@Injectable({
  providedIn: 'root'
})
export class EncuestaService {

  listadoEncuestas: any[] = [];

  constructor(private firestore: AngularFirestore) {    
    this.getEncuestas().subscribe(aux => {
    this.listadoEncuestas = aux;
  })
 }

  getEncuestas = (): Observable<any[]> => {
    return this.firestore.collection('encuestas').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as Encuesta[];
      })
    );
  }

  async agregarEncuesta(item: Encuesta) {
    let encuesta = { 'uid': item.uid, 'usuario': item.usuario, 'comida': item.comida, 'personal': item.personal, 
    'recomendacion': item.recomendacion };
    console.log('serv', encuesta);
    return await this.firestore.collection('encuestas').doc(item.uid).set(encuesta);
  }
}

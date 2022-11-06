import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Producto } from 'src/app/classes/producto';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  constructor(private firestore: AngularFirestore) { }

  getProductos = (): Observable<any[]> => {
    return this.firestore.collection('productos').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as Producto[];
      })
    );
  }
}

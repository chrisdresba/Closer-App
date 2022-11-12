import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ItemPedido } from 'src/app/classes/item-pedido';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ItemPedidoService {

  constructor(private firestore: AngularFirestore) { }

  getItemsPedido = (): Observable<any[]> => {
    return this.firestore.collection('itemPedido').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as ItemPedido[];
      })
    );
  }
}

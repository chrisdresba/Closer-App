import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../classes/pedido';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ItemPedido } from '../classes/item-pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  listado: any[] = [];
  listadoItems: any[] = [];

  constructor(private firestore: AngularFirestore) 
  {
    this.getPedidos().subscribe(aux => {
      this.listado = aux;
    })

    this.getItemPedido().subscribe(aux => {
      this.listadoItems = aux;
    })
   }

  getPedidos = (): Observable<any[]> => {
    return this.firestore.collection('pedidos').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as Pedido[];
      })
    );
  }

  getItemPedido = (): Observable<any[]> => {
    return this.firestore.collection('itemPedido').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as ItemPedido[];
      })
    );
  }

  async actualizarEstadoPedido(res: Pedido) {
    return this.firestore.collection('pedidos').doc(res.uid).update({ ...res });
  }

  async actualizarEstadoItemPedido(res: ItemPedido) {
    return this.firestore.collection('itemPedido').doc(res.uid).update({ ...res });
  }
  



}

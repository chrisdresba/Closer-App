import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../classes/pedido';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ItemPedido } from '../classes/item-pedido';
import { EstadoPedido } from 'src/app/enumerados/estado-pedido';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  listado: any[] = [];
  listadoItems: any[] = [];

  constructor(private firestore: AngularFirestore) {
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


  comprobarPedido(usuario: string) {
    for (let i = 0; i < this.listado.length; i++) {
      if (this.listado[i].usuario == usuario) {
        localStorage.setItem('pedidoExistente','OK')
        return this.listado[i].mesa;
      }
    }
  }

  comprobarPedidoEntregado(usuario: string) {
    for (let i = 0; i < this.listado.length; i++) {
      if (this.listado[i].usuario == usuario && this.listado[i].estado == EstadoPedido.CONFIRMADO ) {
        return this.listado[i].estado;
      }
    }
  }

  async actualizarEstadoPedido(res: Pedido) {
    return this.firestore.collection('pedidos').doc(res.uid).update({ ...res });
  }

  async actualizarEstadoItemPedido(res: ItemPedido) {
    return this.firestore.collection('itemPedido').doc(res.uid).update({ ...res });
  }

  async eliminarPedido(id: string) {
    return this.firestore.collection('pedidos')
      .doc(id).delete()
      .then(() => console.log('Pedido Borrado'))
      .catch(e => console.log('error', e));
  }

  async eliminarItemPedido(id: string) {
    return this.firestore.collection('itemPedido')
      .doc(id).delete()
      .then(() => console.log('Pedido Borrado'))
      .catch(e => console.log('error', e));
  }



}

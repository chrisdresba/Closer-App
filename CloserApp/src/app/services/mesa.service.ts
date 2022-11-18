import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListaEspera } from '../classes/lista-espera';
import { Mesa } from '../classes/mesa';
import { ItemPedido } from '../classes/item-pedido';
import { Pedido } from '../classes/pedido';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  listadoEspera: any[] = [];
  listadoMesas: any[] = [];
  listadoItemsPedidos: any[] = [];

  constructor(private firestore: AngularFirestore) {
    this.getListaEspera().subscribe(lista => {
      this.listadoEspera = lista;
    })
    this.getListaMesa().subscribe(lista => {
      this.listadoMesas = lista;
    })
  }

  getListaEspera = (): Observable<any[]> => {
    return this.firestore.collection('listaEspera').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as ListaEspera[];
      })
    );
  }

  getListaMesa = (): Observable<any[]> => {
    return this.firestore.collection('mesas').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as Mesa[];
      })
    );
  }

  getListaItemsPedidos = (): Observable<any[]> => {
    return this.firestore.collection('itemPedido').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as ItemPedido[];
      })
    );
  }

  async agregarUsuarioListaEspera(usuario: string) {
    if (this.comprobarListaEspera(usuario)) {
      var res = new Date();
      const fecha = res.getFullYear() + "-" + (res.getMonth() + 1) + "-" + res.getDate();
      const hora = res.getHours() + ":" + res.getMinutes() + ":" + res.getSeconds();
      let entidad = { 'usuario': usuario, 'fecha': fecha, 'hora': hora, 'estado': false };
      return await this.firestore.collection('listaEspera').doc(usuario).set(entidad);
    }
  }

  actualizarClienteListaEspera(res: ListaEspera) {
    return this.firestore.collection('listaEspera').doc(res.usuario).update({ ...res });
  }

  actualizarMesa(res: Mesa) {
    return this.firestore.collection('mesas').doc(res.uid).update({ ...res });
  }

  actualizarEstadoPedido(res: Pedido) {
    return this.firestore.collection('pedidos').doc(res.uid).update({ ...res });
  }

  actualizarItemsPedido(res: Pedido) {
    return this.firestore.collection('pedidos').doc(res.uid).update({ ...res });
  }

  comprobarListaEspera(usuario: string) {
    for (let i = 0; i < this.listadoEspera.length; i++) {
      if (this.listadoEspera[i].usuario == usuario) {
        return false;
      }
    }
    return true;
  }

  comprobarMesaAsignada(usuario: string) {
    for (let i = 0; i < this.listadoMesas.length; i++) {
      if (this.listadoMesas[i].usuario == usuario) {
     
        return this.listadoMesas[i].numero;
      }
    }
  }

  devolverMesaAsignada(mesa: string) {
    for (let i = 0; i < this.listadoMesas.length; i++) {
      if (this.listadoMesas[i].numero == mesa) {
        return this.listadoMesas[i];
      }
    }
  }

  async agregarPedido(item: Pedido) {
    // this.itemsCollection.add(JSON.parse(JSON.stringify(especialidad)));

    let pedido = { 'uid': item.uid, 'usuario': item.usuario, 'mesa': item.mesa, 'productos': item.productos, 
    'precioAcumulado': item.precioAcumulado, 'estado': item.estado, 'descuento': item.descuento,'propina': item.propina, 'uidEncuesta': item.uidEncuesta };
    console.log('serv', pedido);
    return await this.firestore.collection('pedidos').doc(item.uid).set(pedido);
  }

  async agregarItemPedido(item: ItemPedido) {
    let itemPedido = { 'uid': item.uid, 'usuario': item.usuario, 'mesa': item.mesa, 'producto': item.producto, 
    'cantidad': item.cantidad, 'estado': item.estado };
    console.log('servPEDIDO', itemPedido);
      return await this.firestore.collection('itemPedido').doc(item.uid).set(itemPedido);
  }
}

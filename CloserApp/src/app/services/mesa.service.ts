import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ListaEspera } from '../classes/lista-espera';
import { Mesa } from '../classes/mesa';

@Injectable({
  providedIn: 'root'
})
export class MesaService {

  listadoEspera: any[] = [];
  listadoMesas: any[] = [];

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
    return this.firestore.collection('mesa').doc(String(res.numero)).update({ ...res });
  }

  comprobarListaEspera(usuario: string) {
    for (let i = 0; i < this.listadoEspera.length; i++) {
      if (this.listadoEspera[i].usuario == usuario) {
        return false;
      }
    }
    return true;
  }

}


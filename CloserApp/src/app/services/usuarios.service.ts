import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../classes/cliente';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  listado: any[] = [];

  constructor(private firestore: AngularFirestore) { 

  }

  getClientes = (): Observable<any[]> => {
    return this.firestore.collection('clientes').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as Cliente[];
      })
    );
  }

  async saveCliente(res: Cliente) {
    let entidad = { 'uid': res.uid, 'nombre': res.nombre, 'apellido': res.apellido, 'email': res.email, 'dni': res.dni, 'perfil': res.perfil, 'validacion': res.validacion, 'fotoURL': res.fotoURL, 'estado': res.estado }
    return await this.firestore.collection('clientes').doc(res.uid).set(entidad);
  }


}

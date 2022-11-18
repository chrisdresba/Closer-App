import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../classes/cliente';
import { Staff } from '../classes/staff';
import { PushNotificationService } from 'src/app/services/push-notification.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  listado: any[] = [];
  listadoStaff: any[] = [];
  nombre: string = '';

  constructor(private firestore: AngularFirestore, private pnService: PushNotificationService) {
    this.getClientes().subscribe(usuario => {
      this.listado = usuario;
    })

    this.getStaff().subscribe(staff => {
      this.listadoStaff = staff;
    })

  }

  getClientes = (): Observable<any[]> => {
    return this.firestore.collection('clientes').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as Cliente[];
      })
    );
  }

  getStaff = (): Observable<any[]> => {
    return this.firestore.collection('staff').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as Staff[];
      })
    );
  }

  async saveCliente(res: Cliente) {
    let entidad = { 'uid': res.uid, 'nombre': res.nombre, 'apellido': res.apellido, 'email': res.email, 'dni': res.dni, 'perfil': res.perfil, 'validacion': res.validacion, 'fotoURL': res.fotoURL, 'estado': res.estado }
    return await this.firestore.collection('clientes').doc(res.uid).set(entidad);
  }

  async saveStaff(res: Staff) {
    let entidad = { 'uid': res.uid, 'nombre': res.nombre, 'apellido': res.apellido, 'email': res.email, 'dni': res.dni, 'perfil': res.perfil, 'fotoURL': res.fotoURL, 'cuil': res.cuil }
    return await this.firestore.collection('staff').doc(res.uid).set(entidad);
  }

  async actualizarCliente(res: Cliente) {
    return await this.firestore.collection('clientes').doc(res.uid).update({ ...res });
  }

  rolUsuario(email: string) {
    for (let i = 0; i < this.listado.length; i++) {
      if (this.listado[i].email == email) {
        this.nombre = this.listado[i].nombre;
        // concatenar nombre y apellido 
        // localStorage.setItem('sesionRol', 'cliente', this.nombre)        
        localStorage.setItem('sesionRol', 'cliente')
        break;
      }
    }

    for (let i = 0; i < this.listadoStaff.length; i++) {
      if (this.listadoStaff[i].email == email) {
        localStorage.setItem('sesionRol', this.listadoStaff[i].perfil);

        this.pnService.inicializar(this.listadoStaff[i]);

        break;
      }
    }
  }
}

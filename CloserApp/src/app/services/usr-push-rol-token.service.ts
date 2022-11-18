import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PushUserRolToken } from 'src/app/classes/push-user-rol-token'

@Injectable({
  providedIn: 'root'
})
export class UsrPushRolTokenService {

  constructor(private firestore: AngularFirestore) { }

  getUsersRolToken = (): Observable<any[]> => {
    return this.firestore.collection('push-user-rol-token').snapshotChanges().pipe(
      map(docs => {
        return docs.map(d => d.payload.doc.data()) as PushUserRolToken[];
      })
    );
  }

  async saveUserPushToken(res: PushUserRolToken) {
    let entidad = { 'email': res.email, 'perfil': res.perfil, 'token': res.token }
    return await this.firestore.collection('push-user-rol-token').doc(res.email).set(entidad);
  }

  async actualizarUserPushToken(res: PushUserRolToken) {
    return await this.firestore.collection('push-user-rol-token').doc(res.email).update({ ...res });
  }
}

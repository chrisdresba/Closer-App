import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { environment } from 'src/environments/environment';
import { initializeApp } from '@firebase/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [  ReactiveFormsModule,FormsModule, BrowserModule, IonicModule.forRoot(), AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    AngularFireAuthModule,
    AngularFirestoreModule
],
  providers: [Camera,{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}

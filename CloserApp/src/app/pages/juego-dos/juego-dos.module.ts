import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JuegoDosPageRoutingModule } from './juego-dos-routing.module';

import { JuegoDosPage } from './juego-dos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JuegoDosPageRoutingModule
  ],
  declarations: [JuegoDosPage]
})
export class JuegoDosPageModule {}

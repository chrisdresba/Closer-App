import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MenuJuegosPageRoutingModule } from './menu-juegos-routing.module';

import { MenuJuegosPage } from './menu-juegos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuJuegosPageRoutingModule
  ],
  declarations: [MenuJuegosPage]
})
export class MenuJuegosPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JuegoUnoPageRoutingModule } from './juego-uno-routing.module';

import { JuegoUnoPage } from './juego-uno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JuegoUnoPageRoutingModule
  ],
  declarations: [JuegoUnoPage]
})
export class JuegoUnoPageModule {}

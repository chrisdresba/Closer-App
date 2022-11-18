import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarCuentaPageRoutingModule } from './solicitar-cuenta-routing.module';

import { SolicitarCuentaPage } from './solicitar-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarCuentaPageRoutingModule
  ],
  declarations: [SolicitarCuentaPage]
})
export class SolicitarCuentaPageModule {}

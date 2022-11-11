import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PedidosStaffPageRoutingModule } from './pedidos-staff-routing.module';

import { PedidosStaffPage } from './pedidos-staff.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PedidosStaffPageRoutingModule
  ],
  declarations: [PedidosStaffPage]
})
export class PedidosStaffPageModule {}

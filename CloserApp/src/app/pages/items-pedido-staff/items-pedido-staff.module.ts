import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ItemsPedidoStaffPageRoutingModule } from './items-pedido-staff-routing.module';

import { ItemsPedidoStaffPage } from './items-pedido-staff.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ItemsPedidoStaffPageRoutingModule
  ],
  declarations: [ItemsPedidoStaffPage]
})
export class ItemsPedidoStaffPageModule {}

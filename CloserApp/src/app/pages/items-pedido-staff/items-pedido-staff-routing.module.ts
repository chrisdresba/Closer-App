import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ItemsPedidoStaffPage } from './items-pedido-staff.page';

const routes: Routes = [
  {
    path: '',
    component: ItemsPedidoStaffPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsPedidoStaffPageRoutingModule {}

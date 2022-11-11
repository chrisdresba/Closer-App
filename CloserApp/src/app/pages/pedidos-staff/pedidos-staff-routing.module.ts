import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PedidosStaffPage } from './pedidos-staff.page';

const routes: Routes = [
  {
    path: '',
    component: PedidosStaffPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PedidosStaffPageRoutingModule {}

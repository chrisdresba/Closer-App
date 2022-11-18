import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitarCuentaPage } from './solicitar-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarCuentaPageRoutingModule {}

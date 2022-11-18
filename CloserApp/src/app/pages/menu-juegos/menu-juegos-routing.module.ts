import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuJuegosPage } from './menu-juegos.page';

const routes: Routes = [
  {
    path: '',
    component: MenuJuegosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuJuegosPageRoutingModule {}

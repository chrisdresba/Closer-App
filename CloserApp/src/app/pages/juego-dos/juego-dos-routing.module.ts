import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JuegoDosPage } from './juego-dos.page';

const routes: Routes = [
  {
    path: '',
    component: JuegoDosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuegoDosPageRoutingModule {}

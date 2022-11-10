import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterAnonimoPage } from './register-anonimo.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterAnonimoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAnonimoPageRoutingModule {}

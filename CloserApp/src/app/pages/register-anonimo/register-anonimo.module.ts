import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RegisterAnonimoPageRoutingModule } from './register-anonimo-routing.module';

import { RegisterAnonimoPage } from './register-anonimo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RegisterAnonimoPageRoutingModule
  ],
  declarations: [RegisterAnonimoPage]
})
export class RegisterAnonimoPageModule {}

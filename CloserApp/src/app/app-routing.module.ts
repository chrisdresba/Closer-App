import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
 
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'splash',
    loadChildren: () => import('./pages/splash/splash.module').then( m => m.SplashPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'espera',
    loadChildren: () => import('./pages/espera/espera.module').then( m => m.EsperaPageModule)
  },
  {
    path: 'pedido',
    loadChildren: () => import('./pages/pedido/pedido.module').then( m => m.PedidoPageModule)
  },
  {
    path: 'encuesta',
    loadChildren: () => import('./pages/encuesta/encuesta.module').then( m => m.EncuestaPageModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('./pages/chat/chat.module').then( m => m.ChatPageModule)
  },
  {
    path: 'chat-mozo',
    loadChildren: () => import('./pages/chat-mozo/chat-mozo.module').then( m => m.ChatMozoPageModule)
  },
  {
    path: 'juego-uno',
    loadChildren: () => import('./pages/juego-uno/juego-uno.module').then( m => m.JuegoUnoPageModule)
  },
  {
    path: 'register-anonimo',
    loadChildren: () => import('./pages/register-anonimo/register-anonimo.module').then( m => m.RegisterAnonimoPageModule)
  },
  {
    path: 'pedidos-staff',
    loadChildren: () => import('./pages/pedidos-staff/pedidos-staff.module').then( m => m.PedidosStaffPageModule)
  },
  {
    path: 'items-pedido-staff',
    loadChildren: () => import('./pages/items-pedido-staff/items-pedido-staff.module').then( m => m.ItemsPedidoStaffPageModule)
  },
  {
    path: 'graficos',
    loadChildren: () => import('./pages/graficos/graficos.module').then( m => m.GraficosPageModule)
  },
  {    
    path: 'estado-pedido',
    loadChildren: () => import('./pages/estado-pedido/estado-pedido.module').then( m => m.EstadoPedidoPageModule)
  },
  {
    path: 'solicitar-cuenta',
    loadChildren: () => import('./pages/solicitar-cuenta/solicitar-cuenta.module').then( m => m.SolicitarCuentaPageModule)
  },  {
    path: 'juego-dos',
    loadChildren: () => import('./pages/juego-dos/juego-dos.module').then( m => m.JuegoDosPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules , relativeLinkResolution: 'legacy' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

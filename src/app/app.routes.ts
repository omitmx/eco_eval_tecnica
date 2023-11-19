import { Routes } from '@angular/router';

export const routes: Routes = [
    //{ path: '', component: UserComponent} ,    
    {
        path: '',
        loadChildren: () => import('./modules/user/user.module').then((m) => m.UserModule)
      },
    { path: '**', redirectTo: 'error/404' },
];

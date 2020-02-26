import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PLApprovalComponent } from './PLApproval/PLApproval.component';
import { ConfigResolver } from './resolver/config.resolver';
import { AuthGuard } from './resolver/auth.guard.ts';
import { NavigationComponent } from './navigation/navigation.component';
import { HomeComponent } from './home/home.component';
import { DeskResolver } from './resolver/desk.resolver';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: { desks: DeskResolver },
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'plapproval',
        component: PLApprovalComponent,
        resolve: { desks: ConfigResolver },
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

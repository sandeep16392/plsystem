import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { PLApprovalComponent } from './PLApproval/PLApproval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { ConfigurationService } from './services/configuration.service';
import { PlApprovalService } from './services/plApproval.service';
import { AlertifyService } from './services/alertify.service';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './resolver/auth.guard.ts';
import { ConfigResolver } from './resolver/config.resolver';
import { HomeComponent } from './home/home.component';


export function tokenGetter() {
   return localStorage.getItem('token');
}


@NgModule({
   declarations: [
      AppComponent,
      NavigationComponent,
      LoginComponent,
      PLApprovalComponent,
      HomeComponent
   ],
   imports: [
      BrowserModule,
      FormsModule,
      AppRoutingModule,
      HttpClientModule,
      ReactiveFormsModule,
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: environment.whiteListedDomain,
            blacklistedRoutes: environment.blacklistDomain
         }
      })
   ],
   providers: [
      PreventUnsavedChangesGuard,
      ConfigurationService,
      PlApprovalService,
      AlertifyService,
      AuthGuard,
      ConfigResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

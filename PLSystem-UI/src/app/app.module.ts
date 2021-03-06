import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { LoginComponent } from './login/login.component';
import { PLApprovalComponent } from './PLApproval/PLApproval.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PreventUnsavedChangesGuard } from './guards/prevent-unsaved-changes.guard';
import { ConfigurationService } from './services/configuration.service';
import { PlApprovalService } from './services/plApproval.service';
import { AlertifyService } from './services/alertify.service';
import { environment } from 'src/environments/environment';
import { AuthGuard } from './resolver/auth.guard.ts';
import { ConfigResolver } from './resolver/config.resolver';
import { HomeComponent } from './home/home.component';
import { CustomHttpInterceptor } from './resolver/CustomHttpInterceptor';
import { DeskResolver } from './resolver/desk.resolver';


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
            tokenGetter: tokenGetter
         }
      })
   ],
   providers: [
      PreventUnsavedChangesGuard,
      ConfigurationService,
      PlApprovalService,
      AlertifyService,
      AuthGuard,
      ConfigResolver,
      {  provide: HTTP_INTERCEPTORS,
         useClass: CustomHttpInterceptor,
         multi: true
      },
      DeskResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }

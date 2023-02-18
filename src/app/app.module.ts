import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MapsModule } from './maps/maps.module';
import { RegisterComponent } from './register/register.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_helpers/auth.interceptor';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AdminModule } from './admin/admin.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserModule } from './user/user.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { ToastsContainerComponent } from './toasts-container/toasts-container.component';
import { getFrenchPaginatorIntl } from './french-paginator-intl';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatchPasswordDirective } from './directives/match-password.directive';
import { PasswordDirectiveModule } from './shared/password-directive/password-directive.module';
import { ProspectionModule } from './prospection/prospection.module';

registerLocaleData(localeFr);

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    ToastsContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MapsModule,
    FormsModule,
    HttpClientModule,
    AdminModule,
    LeafletModule,
    UserModule,
    PasswordDirectiveModule,
    ProspectionModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    { 
      provide: MatPaginatorIntl, 
      useValue: getFrenchPaginatorIntl()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

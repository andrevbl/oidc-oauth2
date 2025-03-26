import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.sso.serverURL,
        realm: environment.sso.realm,
        clientId: environment.sso.clientID
      },
      initOptions: {
        checkLoginIframe: false,
        redirectUri: environment.sso.baseUrl
      }
    });
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    KeycloakAngularModule,
    OAuthModule.forRoot()
  ],

  exports: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

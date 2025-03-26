import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { OAuthService } from 'angular-oauth2-oidc';
import { authCodeFlowConfig } from './shared/auth.config';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  versao = '';

  constructor( 
    private router: Router,
    private readonly keycloak: KeycloakService,
    private oauthService: OAuthService
  )
    {
      environment.sso.loginComponent == 1 ? this.keycloakAngular() : this.angularOauth2Oidc();
    }

  async keycloakAngular() {
    if (environment.sso.log) console.log("(KC) Verifying that is logged in...");
    if (await this.keycloak.isLoggedIn()) {
      if (environment.sso.log) console.log("(KC) Redirecting to callback page...");
      this.router.navigateByUrl("login-callback");
    }
    else {
      let url = new URL(window.location.href);
      if (url.searchParams.has('state') && url.searchParams.has('session_state') && url.searchParams.has('code')) {
        if (environment.sso.log) console.log("(KC) Error while obtaining access token!");
      }
      else {
        if (environment.sso.log) console.log("(KC) Calling login page...");
        this.keycloak.login( { scope: environment.sso.scope } );
      }
    }
  }

  async angularOauth2Oidc() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.events
    .pipe(filter((e) => e.type === 'token_received'))
    .subscribe((_) => this.oauthService.loadUserProfile());

    if (environment.sso.log) console.log("(OA) Verifying that is logged in...");
    if (this.oauthService.hasValidAccessToken()) {
      if (environment.sso.log) console.log("(OA) Redirecting to callback page...");
      this.router.navigateByUrl("login-callback");
    }
    else {
      let url = new URL(window.location.href);
      if (url.searchParams.has('state') && url.searchParams.has('session_state') && url.searchParams.has('code')) {
        if (environment.sso.log) console.log("(OA) Error while obtaining access token!");
      }
      else {
        if (environment.sso.log) console.log("(OA) Calling login page...");
        this.oauthService.loadDiscoveryDocumentAndLogin()
      }
    }
  }
      
  ngOnInit(): void {
  }
}

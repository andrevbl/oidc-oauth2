import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { environment } from 'src/environments/environment';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login-callback',
  templateUrl: './login-callback.component.html',
  styleUrls: ['./login-callback.component.css']
})
export class LoginCallbackComponent implements OnInit {

  public userProfileKC: KeycloakProfile | null = null;
  public userProfileOA: object | null = null;

  public countVerify = 0;

  constructor(private readonly keycloak: KeycloakService,
              private oauthService: OAuthService) {
  }

  ngOnInit(): void {
    environment.sso.loginComponent == 1 ? this.loadKeycloakProfile() : this.loadOAuth2OIDCProfile();
  }

  async loadKeycloakProfile() {
    if (environment.sso.log) console.log("(KC) Verifying for current access...");
    if (await this.keycloak.isLoggedIn()) {

      if (environment.sso.log) console.log("(KC) Token obtained! Loading user profile...");
      this.userProfileKC = await this.keycloak.loadUserProfile();

      if (this.userProfileKC && this.userProfileKC.username) {
        if (environment.sso.log) console.log("(KC) Profile loaded!");
        //Do stuff here
      }
    }
    else {
      if (environment.sso.log) console.log("(KC) No token found... Awaiting for the next verification...");
      this.countVerify++;
      if (this.countVerify >= 3) this.keycloak.login();
      else setTimeout(() => this.loadKeycloakProfile(), 3000);
    }
  }

  loadOAuth2OIDCProfile() {
    if (environment.sso.log) console.log("(OA) Verifying for current access...");
    if (this.oauthService.hasValidAccessToken()) {

      if (environment.sso.log) console.log("(OA) Token obtained! Loading user profile...");
      this.userProfileOA = this.oauthService.getIdentityClaims();

      if (this.userProfileOA && (this.userProfileOA as any).given_name) {
        if (environment.sso.log) console.log("(OA) Profile loaded!");
        //Do stuff here
      }
    }
    else {
      if (environment.sso.log) console.log("(OA) No token found... Awaiting for the next verification...");
      this.countVerify++;
      if (this.countVerify >= 3) this.oauthService.initLoginFlow();
      else setTimeout(() => this.loadOAuth2OIDCProfile(), 3000);
    }
  }
}

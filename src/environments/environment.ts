export const environment = {
  production: false,
  version: '1.0.1 | 26/03/2025-08:00 | Development',
  sso: {
    loginComponent: 1,//1: Keycloak (remove "/realms/test" from "serverURL") // 2: OAuth2/OIDC (add "/realms/test" at "serverURL")

    //clientID: 'spa', //IdentityServer4 tests
    clientID: 'real.clientid.test', //Production and local tests

    //serverURL: 'http://localhost:8080/auth', //Local tests
    //serverURL: 'https://idsvr4.azurewebsites.net', //IdentityServer4 tests
    serverURL: 'https://sso.testing.com/auth', //Production

    //baseUrl: 'http://localhost:4200', //Local testes //If testing on IdentityServer4 add "/#/login-callback" at the end of this URL
    baseUrl: 'http://www.mywebsite.com/publicservice/', //Production

    realm: 'test',
    scope: 'openid profile email phone',
    log: true
  }
};

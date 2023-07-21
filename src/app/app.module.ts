import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MSAL_INSTANCE, MsalModule, MsalService } from '@azure/msal-angular';
import { IPublicClientApplication, PublicClientApplication } from '@azure/msal-browser';
import { PublicPageComponent } from './public-page/public-page.component';
import { PrivatePageComponent } from './private-page/private-page.component';
import { HttpClientModule } from '@angular/common/http';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth:{
      clientId: '551d9948-d485-4115-87b4-102fc7a0108e',
      authority: 'https://login.microsoftonline.com/e6cedbb8-5e31-4901-bdff-c9574d58620b',
      redirectUri:'http://localhost:4200'
  
    },
    cache:{
      cacheLocation: 'localStorage'
    }
  })
}

@NgModule({
  declarations: [
    AppComponent,
    PublicPageComponent,
    PrivatePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsalModule,
    HttpClientModule

  ],
  providers: [
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    MsalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
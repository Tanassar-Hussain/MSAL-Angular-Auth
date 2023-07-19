import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'msal-app-angular';
  activeUser: string | undefined = "Unknown User";
  access_token: string | undefined = 'null';

  constructor(private msalService: MsalService){
  }
  ngOnInit(): void {
    let activeAccount = this.msalService.instance.getActiveAccount();
    this.activeUser = activeAccount?.name;
    console.log(this.activeUser);
    this.msalService.instance.handleRedirectPromise().then(
      res => {
        if (res!=null && res.account != null) {
          this.access_token = res.accessToken;
          this.msalService.instance.setActiveAccount(res.account);
        }
      }
    )
  }

  isLoggedIn(): boolean
  { 
    console.log(this.access_token);
    return this.msalService.instance.getActiveAccount() != null;
  }

  login()
  {
    this.msalService.loginRedirect({
      scopes: ['user.read']
    });
    // this.msalService.loginPopup().subscribe((respnse: AuthenticationResult)=>{
    //   this.msalService.instance.setActiveAccount(respnse.account);
    // })
  }

  logout()
  {
    this.msalService.logout();
  }
}

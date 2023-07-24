import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
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
  userProfile: Object | undefined;

  // New Way To Inject Dependencies instead of using the Construtor
  private msalService = inject(MsalService);
  private http = inject(HttpClient);
  userProfilePicture: string | undefined;

  
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

  async getUserProfile() {
    const activeAccount = this.msalService.instance.getActiveAccount();
  
    if (activeAccount) {
      try {
        const tokenResponse = await this.msalService.instance.acquireTokenSilent({
          account: activeAccount,
          scopes: ['user.read', 'User.ReadBasic.All'] // Add 'User.ReadBasic.All' scope to access the profile picture
        });
  
        const headers = new HttpHeaders({
          Authorization: `Bearer ${tokenResponse.accessToken}`
        });
  
        // Call Microsoft Graph API to get user profile
        this.http.get('https://graph.microsoft.com/v1.0/me', { headers }).subscribe(
          (response) => {
            this.userProfile = response;
            console.log('User Profile:', this.userProfile);
  
            // Now fetch the profile picture
            this.http.get('https://graph.microsoft.com/v1.0/me/photo/$value', {
              headers: headers,
              responseType: 'blob' // Set the response type to 'blob' to handle binary data
            }).subscribe(
              (pictureBlob) => {
                // Convert the blob data to a URL for displaying in the UI
                const reader = new FileReader();
                reader.onloadend = () => {
                  this.userProfilePicture = reader.result as string;
                };
                reader.readAsDataURL(pictureBlob);
              },
              (error) => {
                console.log('Error fetching user profile picture:', error);
              }
            );
          },
          (error) => {
            console.log('Error fetching user profile:', error);
          }
        );
      } catch (error) {
        // Handle errors
        console.log('Error:', error);
      }
    }
  }
  

}


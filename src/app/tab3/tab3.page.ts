import { Component, ViewChild, ElementRef } from '@angular/core';
import '@pwabuilder/pwaAuth';
import { User } from '../models/user';
import { Role } from '../models/role';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild('pwaAuthElement', { static: false }) pwaAuthElement: ElementRef;

  get user() {
    const userJson = sessionStorage.getItem('user');
    return userJson ? JSON.parse(userJson) as User : undefined;
  }
  set user(value: User) {
    if (value) {
      sessionStorage.setItem('user', JSON.stringify(value));
    } else {
      sessionStorage.removeItem('user');
    }
  }

  get role() {
    const roleJson = sessionStorage.getItem('role');
    return roleJson ? JSON.parse(roleJson) as Role : undefined;
  }
  set role(value: Role) {
    if (value) {
      sessionStorage.setItem('role', JSON.stringify(value));
    } else {
      sessionStorage.removeItem('role');
    }
  }

  constructor(private navControlor: NavController) { }

  ionViewDidEnter() {
    this.pwaAuthElement.nativeElement.addEventListener("signin-completed", async (e: CustomEvent) => {
      // if(!e.detail.error) { //this doesn't work for MicroSoft login
      if (e.detail.providerData) {
        const signIn = e.detail;

        // console.log("Email: ", signIn.email);
        console.log("Name: ", signIn.name);
        console.log("Picture: ", signIn.imageUrl);
        console.log("Access token", signIn.accessToken);
        console.log("Access token expiration date", signIn.accessTokenExpiration);
        console.log("Provider (MS, Google, FB): ", signIn.provider);
        console.log("Raw data from provider: ", signIn.providerData);
        // Sign-in successful!
        switch (signIn.provider) {
          case "Facebook":
            await this.login("Facebook", signIn.providerData.auth["userID"], signIn.name);
            break;
          case "Google":
            await this.login("Google", signIn.providerData.EA, signIn.name);
            break;
          case "Microsoft":
            await this.login("Microsoft", signIn.providerData.uniqueId, signIn.name);
            break;
          default:
            console.log("Third party log in error: Not in the list");
            break;
        }
      } else {
        // An error occurred
        document.body.append("An error occurred: " + JSON.stringify(e.detail.error));
      }
    });
  }

  goToSettingsPage() {
    this.navControlor.navigateForward('/settings'); 
  }

  async login(loginType: string, loginId: string, loginName: string) {
    const response = await fetch(
      localStorage.getItem('serverApiBaseUrl') + '/user/login',
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: loginType,
          message: loginId
        })
      }
    );
    const result = await response.text();
    if (response.status === 200 && result === "") {
      const response2 = await fetch(
        localStorage.getItem('serverApiBaseUrl') + '/user/addThirdPartyUser' + 
        '?name=' + loginName +
        '&provider=' + loginType +
        '&id=' + loginId,
        {
          method: 'POST'
        }
      );
      if (response2) {
        const response3 = await fetch(
          localStorage.getItem('serverApiBaseUrl') + '/user/login',
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: loginType,
              message: loginId
            })
          }
        );
      }
    }
    await this.fetchUserAndRole();
  }

  public async logout() {
    const response = await fetch(
      localStorage.getItem('serverApiBaseUrl') + '/user/logout',
      {
        method: 'POST',
        credentials: 'include',
      }
    );
    await this.fetchUserAndRole();
  }

  private async fetchUserAndRole() {
    await this.fetchUser();
    await this.fetchRole();
  }

  private async fetchUser() {
    const response = await fetch(
      localStorage.getItem('serverApiBaseUrl') + '/user/self',
      {
        method: 'GET',
        credentials: 'include'
      }
    );
    if (response.status === 200) {
      try {
        this.user = await response.json();
        console.log("user: " + this.user);
        return;
      } catch { }
    }
    this.user = undefined;
  }

  private async fetchRole() {
    if (this.user) {
      const response = await fetch(
        localStorage.getItem('serverApiBaseUrl') + '/user/role/self',
        {
          method: 'GET',
          credentials: 'include'
        }
      );
      if (response.status === 200) {
        try {
          this.role = (await response.json())[0];
          console.log("role" + this.role);
          return;
        } catch { }
      }
    }
    this.role = undefined;
  }


}

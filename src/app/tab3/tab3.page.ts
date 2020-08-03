import { Component, ViewChild, ElementRef } from '@angular/core';
import '@pwabuilder/pwaAuth';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild('pwaAuthElement', {static: false}) pwaAuthElement: ElementRef;
  
  ionViewDidEnter() {
    this.pwaAuthElement.nativeElement.addEventListener("signin-completed", (e: CustomEvent) => {
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
        const email = e.detail.email;
        const name = e.detail.name;
        const imageUrl = e.detail.imageUrl;

        // Hide the sign-in button
        this.pwaAuthElement.nativeElement.style.display = "none";

        // Tell the user they're signed in
        const messageElement = document.createElement("h1");
        messageElement.textContent = "You're signed-in 😎";
        document.body.appendChild(messageElement);

        // Show their profile picture
        if (imageUrl) {
          const imageElement = document.createElement("img");
          imageElement.src = imageUrl;
          document.body.append(imageElement);
        }

        // Show their name
        const nameElement = document.createElement("h3");
        nameElement.textContent = name;
        document.body.append(nameElement);

        // Show their email
        const emailElement = document.createElement("h3");
        emailElement.textContent = email;
        document.body.append(emailElement);

        // Show how they signed in
        const providerElement = document.createElement("p");
        providerElement.textContent = `Signed in through ${e.detail.provider}`;
        document.body.append(providerElement);
      } else {
        // An error occurred
        document.body.append("An error occurred: " + JSON.stringify(e.detail.error));
      }
    });
  }

  constructor() {}

}

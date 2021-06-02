import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import Webex from 'webex';
@Injectable({
  providedIn: 'root'
})

export  class loginService{
webex: any;
status:string
statusChanged = new Subject<String>();


intialSetup(){

  if (localStorage.getItem('webex_token')) {
    this.status = 'Log Out';
  } else {
    this.status = 'Log In';
    this.webex = Webex.init({
      config: {
        credentials: {
          client_id: 'Cd8ff0c31af03900c8d6e8611217e4793917cd6d591b30c2e61c1caac301254cc',
          redirect_uri: 'https://preptask-58a9c.web.app/createSpace',
          scope: 'spark:all spark:kms',
          refreshCallback(webex, token) {
            webex.authorization.initiateLogin();
          }
        }
      }
    });
    this.listenForWebex();
  }
  this.statusChanged.next(this.status);

  //return this.status;
}
onLogin(){

  if (!this.webex){
    this.intialSetup();
  }
  this.webex.authorization.initiateImplicitGrant();
}
onLogout() {
  localStorage.removeItem('webex_token');
  this.status = 'Log In';
  this.statusChanged.next(this.status);
  //this.webex.authorization.logout(false)

  //add actual log out fn
}

async listenForWebex() {
  this.webex.once(`ready`, () => {
    console.log('READY', this.webex.credentials.supertoken);
    if (this.webex.credentials.supertoken){
      localStorage.setItem('webex_token', this.webex.credentials.supertoken.access_token);
      this.status = 'Log Out'
      this.statusChanged.next(this.status);
    }
  });
}
}

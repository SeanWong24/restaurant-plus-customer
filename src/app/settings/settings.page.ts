import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  get serverApiBaseUrl() {
    return localStorage.getItem('serverApiBaseUrl');
  }
  set serverApiBaseUrl(value: string) {
    localStorage.setItem('serverApiBaseUrl', value);
  }
  
  constructor() { }

  ngOnInit() {
  }

}

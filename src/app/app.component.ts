import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>
    <a routerLink="/page1">page1</a>
    <a routerLink="/page2">page2</a>
    <router-outlet></router-outlet>
  `
})
export default class AppComponent {
  private title = 'start!';
}

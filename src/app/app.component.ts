import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  template: `
    <my-header>李续铖</my-header>
    <router-outlet></router-outlet>
    <a routerLink="/page1">page1</a>
    <a routerLink="/page2">page2</a>
    <a routerLink="/log">log</a>
  `
})
export default class AppComponent {
}

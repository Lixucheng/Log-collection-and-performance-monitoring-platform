import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import Page1 from 'app/page1/app.component';
import Page2 from 'app/page2/app.component';
import AppComponent from 'app/app.component';


@NgModule({
  declarations: [
    Page1, Page2, AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/page1',
        pathMatch: 'full'
      },
      {
        path: 'page1',
        component: Page1
      },
      {
        path: 'page2',
        component: Page2
      }
    ])
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

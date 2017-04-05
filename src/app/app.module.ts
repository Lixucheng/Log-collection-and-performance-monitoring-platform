import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';

import Page1 from 'src/app/page1/app.component';
import Page2 from 'src/app/page2/app.component';
import AppComponent from 'src/app/app.component';

require ('../styles.scss');

@NgModule({
  declarations: [
    Page1, Page2, AppComponent
  ],
  imports: [
    MaterialModule,
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

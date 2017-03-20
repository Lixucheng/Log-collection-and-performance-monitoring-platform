import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from 'app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);


// function greeter(person: string) {
//     return "Hello, " + person;
// }

// var user = "Jane User";

// document.body.innerHTML = greeter(user);  
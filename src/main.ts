import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouteReuseStrategy } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';
import { NoReuseStrategy } from './app/reuse-strategy';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    provideHttpClient(),
    {
      provide: RouteReuseStrategy,
      useClass: NoReuseStrategy
    }
  ]
}).catch(err => console.error(err));

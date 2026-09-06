import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideEchartsCore } from 'ngx-echarts';

import { routes } from './app.routes';

import { authInterceptor } from './core/interceptors/auth-interceptor';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    /*
          |--------------------------------------------------------------------------
          | Errores globales
          |--------------------------------------------------------------------------
          */

    provideBrowserGlobalErrorListeners(),

    /*
          |--------------------------------------------------------------------------
          | Router
          |--------------------------------------------------------------------------
          */

    provideRouter(
      routes,

      withViewTransitions({
        skipInitialTransition: true,
      }),

      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),

    /*
          |--------------------------------------------------------------------------
          | HTTP
          |--------------------------------------------------------------------------
          */

    provideHttpClient(withInterceptors([authInterceptor])),

    /*
          |--------------------------------------------------------------------------
          | ECharts
          |--------------------------------------------------------------------------
          */

    provideEchartsCore({
      echarts: () => import('echarts'),
    }),
    provideClientHydration(withEventReplay()),
  ],
};

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptors
} from '@angular/common/http';

import {
  provideEchartsCore
} from 'ngx-echarts';

import {
  routes
} from './app.routes';

import {
  authInterceptor
} from './core/interceptors/auth-interceptor';


export const appConfig:
  ApplicationConfig = {

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
              routes
          ),


          /*
          |--------------------------------------------------------------------------
          | HTTP
          |--------------------------------------------------------------------------
          */

          provideHttpClient(

              withInterceptors([

                  authInterceptor

              ])

          ),


          /*
          |--------------------------------------------------------------------------
          | ECharts
          |--------------------------------------------------------------------------
          */

          provideEchartsCore({

              echarts:
                  () =>
                      import(
                          'echarts'
                      )

          })

      ]

  };
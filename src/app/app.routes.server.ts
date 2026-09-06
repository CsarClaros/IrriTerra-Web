import {

  RenderMode,
  ServerRoute

} from '@angular/ssr';


export const serverRoutes:
  ServerRoute[] = [

    /*
    |--------------------------------------------------------------------------
    | Home
    |--------------------------------------------------------------------------
    |
    | Contenido corporativo principalmente estable.
    | Se genera como HTML durante el build.
    |
    */

    {
      path:
        '',

      renderMode:
        RenderMode.Prerender
    },


    /*
    |--------------------------------------------------------------------------
    | Catálogo
    |--------------------------------------------------------------------------
    |
    | El catálogo cambia desde el ERP.
    |
    */

    {
      path:
        'productos',

      renderMode:
        RenderMode.Server
    },


    /*
    |--------------------------------------------------------------------------
    | Detalle de producto
    |--------------------------------------------------------------------------
    |
    | Dinámico según la base de datos.
    |
    */

    {
      path:
        'productos/:id',

      renderMode:
        RenderMode.Server
    },


    /*
    |--------------------------------------------------------------------------
    | Empresa
    |--------------------------------------------------------------------------
    |
    | Sucursales e información provenientes de Laravel.
    |
    */

    {
      path:
        'empresa',

      renderMode:
        RenderMode.Server
    },


    /*
    |--------------------------------------------------------------------------
    | Contacto
    |--------------------------------------------------------------------------
    */

    {
      path:
        'contactos',

      renderMode:
        RenderMode.Server
    },


    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    |
    | No necesita SEO.
    |
    */

    {
      path:
        'login',

      renderMode:
        RenderMode.Client,

      headers: {
        'X-Robots-Tag':
          'noindex, nofollow'
      }
    },


    /*
    |--------------------------------------------------------------------------
    | ERP
    |--------------------------------------------------------------------------
    |
    | Área privada.
    |
    */

    {
      path:
        'dashboard/**',

      renderMode:
        RenderMode.Client,

      headers: {
        'X-Robots-Tag':
          'noindex, nofollow'
      }
    },

    {
      path:
        'eventos',

      renderMode:
        RenderMode.Client,

      headers: {
        'X-Robots-Tag':
          'noindex, nofollow'
      }
    },


    /*
    |--------------------------------------------------------------------------
    | Resto
    |--------------------------------------------------------------------------
    */

    {
      path:
          '**',
  
      renderMode:
          RenderMode.Server,
  
      status:
          404,
  
      headers: {
          'X-Robots-Tag':
              'noindex, nofollow'
      }
  }

  ];
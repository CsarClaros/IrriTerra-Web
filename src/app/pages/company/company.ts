import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize,
  forkJoin
} from 'rxjs';

import {
  Building2,
  ExternalLink,
  Globe2,
  LucideAngularModule,
  Mail,
  MapPin,
  Phone
} from 'lucide-angular';

import {
  LanguageService
} from '../../core/services/language.service';

import {
  EmpresaPublicaService
} from '../../core/services/publico/empresa-publica.service';

import {
  SucursalPublicaService
} from '../../core/services/publico/sucursal-publica.service';

import {
  EmpresaPublica
} from '../../shared/models/empresa-publica.model';

import {
  SucursalPublica
} from '../../shared/models/sucursal-publica.model';

import {
  SeoService
} from '../../core/services/seo.service';

import {
  StructuredDataService,
  JsonLdNode
} from '../../core/services/structured-data.service';

import {
  environment
} from '../../../environments/environment';


@Component({
  selector:
    'app-company',

  standalone:
    true,

  imports: [
    CommonModule,
    LucideAngularModule
  ],

  templateUrl:
    './company.html',

  styleUrl:
    './company.css'
})
export class Company
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly languageService =
    inject(
      LanguageService
    );


  private readonly empresaService =
    inject(
      EmpresaPublicaService
    );


  private readonly sucursalService =
    inject(
      SucursalPublicaService
    );


  private readonly sanitizer =
    inject(
      DomSanitizer
    );

  private readonly seoService =
    inject(
      SeoService
    );

  private readonly structuredDataService =
    inject(
      StructuredDataService
    );



  /**
   * 
   * 
   * 
   */

  private readonly siteUrl =
    environment
      .siteUrl
      .replace(
        /\/+$/,
        ''
      );

  /*
  |--------------------------------------------------------------------------
  | Empresa
  |--------------------------------------------------------------------------
  */

  readonly empresa =
    signal<
      EmpresaPublica | null
    >(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Sucursales
  |--------------------------------------------------------------------------
  */

  readonly sucursales =
    signal<
      SucursalPublica[]
    >(
      []
    );


  readonly sucursalSeleccionada =
    signal<
      SucursalPublica | null
    >(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly cargando =
    signal(
      false
    );


  readonly errorMensaje =
    signal(
      ''
    );


  /*
  |--------------------------------------------------------------------------
  | Mapa seguro
  |--------------------------------------------------------------------------
  */

  readonly mapaSeguro =
    computed<
      SafeResourceUrl | null
    >(
      () => {

        const sucursal =
          this.sucursalSeleccionada();


        const url =
          sucursal
            ?.url_maps_embed;


        if (
          !url
          ||
          !this.esUrlMapsEmbedValida(
            url
          )
        ) {

          return null;

        }


        return this.sanitizer
          .bypassSecurityTrustResourceUrl(
            url
          );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly Building2 =
    Building2;

  readonly ExternalLink =
    ExternalLink;

  readonly Globe2 =
    Globe2;

  readonly Mail =
    Mail;

  readonly MapPin =
    MapPin;

  readonly Phone =
    Phone;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.configurarSeo();

    this.cargarDatos();

  }

  /*
  |--------------------------------------------------------------------------
  | SEO
  |--------------------------------------------------------------------------
  */

  private configurarSeo(): void {

    this.seoService.configurar({

      title:
        'Empresa y sucursales | Irriterra S.R.L.',

      description:
        'Conoce Irriterra S.R.L., nuestras sucursales, información de contacto y soluciones para riego, agricultura y maquinaria en Bolivia.',

      path:
        '/empresa'

    });

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar datos
  |--------------------------------------------------------------------------
  */

  private cargarDatos(): void {

    if (
      this.cargando()
    ) {

      return;

    }


    this.cargando.set(
      true
    );


    this.errorMensaje.set(
      ''
    );


    forkJoin({

      empresa:
        this.empresaService
          .obtener(),

      sucursales:
        this.sucursalService
          .listar()

    })
      .pipe(

        finalize(
          () => {

            this.cargando.set(
              false
            );

          }
        )

      )
      .subscribe({

        next:
          response => {

            /*
            |--------------------------------------------------------------------------
            | Empresa
            |--------------------------------------------------------------------------
            */

            this.empresa.set(
              response
                .empresa
                .data
            );


            /*
            |--------------------------------------------------------------------------
            | Sucursales
            |--------------------------------------------------------------------------
            */

            const sucursales =
              response
                .sucursales
                .data
              ?? [];


            this.sucursales.set(
              sucursales
            );

            this.configurarDatosEstructurados(
              sucursales
            );


            /*
            |--------------------------------------------------------------------------
            | Selección inicial
            |--------------------------------------------------------------------------
            */

            this.sucursalSeleccionada.set(

              sucursales.length
                > 0

                ? sucursales[0]

                : null

            );

          },


        error:
          (
            error:
              HttpErrorResponse
          ) => {



            this.errorMensaje.set(

              this.t(
                'No fue posible cargar la información de la empresa.',
                'Unable to load company information.'
              )

            );

          }

      });

  }


  private configurarDatosEstructurados(
    sucursales:
      SucursalPublica[]
  ): void {

    const negocios:
      JsonLdNode[] =
      sucursales
        .filter(
          sucursal => {

            const direccion =
              sucursal
                .direccion
                ?.trim();

            return (
              !!direccion
              &&
              !direccion
                .toLowerCase()
                .includes(
                  'pendiente'
                )
            );

          }
        )
        .map(
          sucursal => {

            const negocio:
              JsonLdNode = {

              '@type':
                'Store',

              '@id':
                `${this.siteUrl}/empresa#sucursal-${sucursal.id_sucursal}`,

              name:
                `Irriterra S.R.L. - ${sucursal.nombre}`,

              url:
                `${this.siteUrl}/empresa`,

              parentOrganization: {
                '@id':
                  `${this.siteUrl}/#organization`
              },

              address: {

                '@type':
                  'PostalAddress',

                streetAddress:
                  sucursal.direccion,

                addressLocality:
                  sucursal.ciudad,

                addressRegion:
                  sucursal.departamento,

                addressCountry:
                  'BO'

              }

            };


            if (
              sucursal.telefono
            ) {

              negocio['telephone'] =
                sucursal.telefono;

            }


            if (
              sucursal.correo
            ) {

              negocio['email'] =
                sucursal.correo;

            }


            if (
              sucursal.url_maps
            ) {

              negocio['hasMap'] =
                sucursal.url_maps;

            }


            return negocio;

          }
        );


    /*
     * No generamos LocalBusiness
     * con datos incompletos.
     */

    if (
      negocios.length === 0
    ) {

      return;

    }


    this.structuredDataService
      .configurarGraph(
        negocios
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Seleccionar sucursal
  |--------------------------------------------------------------------------
  */

  seleccionarSucursal(
    sucursal:
      SucursalPublica
  ): void {

    this.sucursalSeleccionada.set(
      sucursal
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Verificar sucursal seleccionada
  |--------------------------------------------------------------------------
  */

  esSucursalSeleccionada(
    sucursal:
      SucursalPublica
  ): boolean {

    return this
      .sucursalSeleccionada()
      ?.id_sucursal
      ===
      sucursal.id_sucursal;

  }


  /*
  |--------------------------------------------------------------------------
  | Validar URL Google Maps Embed
  |--------------------------------------------------------------------------
  */

  private esUrlMapsEmbedValida(
    valor:
      string
  ): boolean {

    try {

      const url =
        new URL(
          valor
        );


      /*
       * Solo HTTPS.
       */

      if (
        url.protocol
        !== 'https:'
      ) {

        return false;

      }


      const host =
        url.hostname
          .toLowerCase();


      /*
       * Google Maps Embed estándar.
       *
       * https://www.google.com/maps/embed?...
       */

      if (
        (
          host
          === 'www.google.com'
          ||
          host
          === 'google.com'
        )
        &&
        url.pathname
          .startsWith(
            '/maps/embed'
          )
      ) {

        return true;

      }


      /*
       * Formato alternativo:
       *
       * https://maps.google.com/maps?...
       */

      if (
        host
        === 'maps.google.com'
        &&
        url.pathname
          .startsWith(
            '/maps'
          )
      ) {

        return true;

      }


      return false;

    } catch {

      return false;

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Traducciones
  |--------------------------------------------------------------------------
  */

  t(
    es: string,
    en: string
  ): string {

    return this.languageService
      .t(
        es,
        en
      );

  }

}
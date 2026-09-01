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
  RouterLink
} from '@angular/router';

import {
  DomSanitizer,
  SafeResourceUrl
} from '@angular/platform-browser';

import {
  LucideAngularModule,
  Mail,
  MapPin,
  Phone
} from 'lucide-angular';

import {
  LanguageService
} from '../../../core/services/language.service';

import {
  EmpresaPublicaService
} from '../../../core/services/publico/empresa-publica.service';

import {
  SucursalPublicaService
} from '../../../core/services/publico/sucursal-publica.service';

import {
  EmpresaPublica
} from '../../../shared/models/empresa-publica.model';

import {
  SucursalPublica
} from '../../../shared/models/sucursal-publica.model';


@Component({
  selector:
    'app-footer',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './footer.html',

  styleUrl:
    './footer.css'
})
export class Footer
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


  /*
  |--------------------------------------------------------------------------
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly empresa =
    signal<
      EmpresaPublica | null
    >(
      null
    );


  readonly sucursalPrincipal =
    signal<
      SucursalPublica | null
    >(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Contacto
  |--------------------------------------------------------------------------
  */

  readonly telefono =
    computed(
      () =>
        this.empresa()
          ?.telefono
        ??
        this.sucursalPrincipal()
          ?.telefono
        ??
        null
    );


  readonly correo =
    computed(
      () =>
        this.empresa()
          ?.correo
        ??
        this.sucursalPrincipal()
          ?.correo
        ??
        null
    );


  readonly direccion =
    computed(
      () =>
        this.empresa()
          ?.direccion
        ??
        this.sucursalPrincipal()
          ?.direccion
        ??
        null
    );


  /*
  |--------------------------------------------------------------------------
  | Mapa
  |--------------------------------------------------------------------------
  */

  readonly mapaSeguro =
    computed<
      SafeResourceUrl | null
    >(
      () => {

        const url =
          this.sucursalPrincipal()
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
  | Otros
  |--------------------------------------------------------------------------
  */

  readonly anioActual =
    new Date()
      .getFullYear();


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

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

    this.cargarEmpresa();

    this.cargarSucursales();

  }


  /*
  |--------------------------------------------------------------------------
  | Empresa
  |--------------------------------------------------------------------------
  */

  private cargarEmpresa(): void {

    this.empresaService
      .obtener()
      .subscribe({

        next:
          response => {

            this.empresa.set(
              response.data
            );

          },


        error:
          error => {

            console.error(
              'No fue posible cargar Empresa en Footer:',
              error
            );

          }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Sucursales
  |--------------------------------------------------------------------------
  */

  private cargarSucursales(): void {

    this.sucursalService
      .listar()
      .subscribe({

        next:
          response => {

            const sucursales =
              response.data
              ?? [];


            /*
             * Preferimos una sucursal que
             * tenga mapa configurado.
             */

            const principal =
              sucursales.find(
                sucursal =>
                  !!sucursal
                    .url_maps_embed
              )
              ??
              sucursales[0]
              ??
              null;


            this.sucursalPrincipal
              .set(
                principal
              );

          },


        error:
          error => {

            console.error(
              'No fue posible cargar Sucursales en Footer:',
              error
            );

          }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Nombre
  |--------------------------------------------------------------------------
  */

  nombreEmpresa(): string {

    return this.empresa()
      ?.nombre
      ??
      'IRRITERRA';

  }


  /*
  |--------------------------------------------------------------------------
  | Google Maps
  |--------------------------------------------------------------------------
  */

  private esUrlMapsEmbedValida(
    valor: string
  ): boolean {

    try {

      const url =
        new URL(
          valor
        );


      if (
        url.protocol
        !== 'https:'
      ) {

        return false;

      }


      const host =
        url.hostname
          .toLowerCase();


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
  | Idioma
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
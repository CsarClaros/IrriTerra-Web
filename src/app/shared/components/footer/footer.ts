import {

  Component,
  OnInit,
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

  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  LucideAngularModule

} from 'lucide-angular';

import {

  forkJoin

} from 'rxjs';

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

} from '../../models/empresa-publica.model';

import {

  SucursalPublica

} from '../../models/sucursal-publica.model';

import {

  ImageWithFallback

} from '../image-with-fallback/image-with-fallback';


@Component({

  selector:
    'app-footer',

  standalone:
    true,

  imports: [

    CommonModule,
    RouterLink,
    LucideAngularModule,
    ImageWithFallback

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
  | Marca
  |--------------------------------------------------------------------------
  */

  readonly logo =
    '/images/brand/irriterra-logo.webp';

  readonly year =
    new Date()
      .getFullYear();


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly MailIcon =
    Mail;

  readonly PhoneIcon =
    Phone;

  readonly MapPinIcon =
    MapPin;

  readonly ArrowUpRightIcon =
    ArrowUpRight;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarDatos();

  }


  /*
  |--------------------------------------------------------------------------
  | Datos públicos
  |--------------------------------------------------------------------------
  */

  private cargarDatos(): void {

    forkJoin({

      empresa:
        this.empresaService
          .obtener(),

      sucursales:
        this.sucursalService
          .listar()

    })
      .subscribe({

        next:
          response => {

            this.empresa.set(
              response
                .empresa
                .data
            );


            const sucursales =
              response
                .sucursales
                .data
              ?? [];


            this.sucursalPrincipal
              .set(
                sucursales[0]
                ?? null
              );

          },

        error:
          () => {

            /*
             * El footer continúa siendo
             * funcional aunque la API
             * pública no responda.
             */

            this.empresa.set(
              null
            );

            this.sucursalPrincipal
              .set(
                null
              );

          }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Información visible
  |--------------------------------------------------------------------------
  */

  correo(): string {

    return (
      this.empresa()
        ?.correo
      ??
      this.sucursalPrincipal()
        ?.correo
      ??
      'info@irriterrasrl.com'
    );

  }


  telefono(): string | null {

    return (
      this.sucursalPrincipal()
        ?.telefono
      ??
      this.empresa()
        ?.telefono
      ??
      null
    );

  }


  direccion(): string | null {

    const sucursal =
      this.sucursalPrincipal();


    if (
      sucursal
        ?.direccion
    ) {

      return [
        sucursal.direccion,
        sucursal.ciudad,
        sucursal.departamento
      ]
        .filter(
          Boolean
        )
        .join(
          ', '
        );

    }


    return (
      this.empresa()
        ?.direccion
      ??
      null
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Idioma
  |--------------------------------------------------------------------------
  */

  t(
    es:
      string,

    en:
      string
  ): string {

    return this.languageService
      .t(
        es,
        en
      );

  }

}
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
  Router,
  RouterLink
} from '@angular/router';

import {
  ChevronDown,
  LucideAngularModule,
  Menu,
  X
} from 'lucide-angular';

import {
  LanguageService
} from '../../../core/services/language.service';

import {
  EmpresaPublicaService
} from '../../../core/services/publico/empresa-publica.service';

import {
  EmpresaPublica
} from '../../../shared/models/empresa-publica.model';


@Component({
  selector:
    'app-navbar',

  standalone:
    true,

  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './navbar.html',

  styleUrl:
    './navbar.css'
})
export class Navbar
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly router =
    inject(
      Router
    );


  private readonly languageService =
    inject(
      LanguageService
    );


  private readonly empresaService =
    inject(
      EmpresaPublicaService
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
  | Estado visual
  |--------------------------------------------------------------------------
  */

  isMenuOpen =
    false;


  isProductsOpen =
    false;


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly MenuIcon =
    Menu;

  readonly XIcon =
    X;

  readonly ChevronDownIcon =
    ChevronDown;


  /*
  |--------------------------------------------------------------------------
  | Productos
  |--------------------------------------------------------------------------
  */

  readonly products = [

    {
      es:
        'Riego por goteo',

      en:
        'Drip Irrigation'
    },

    {
      es:
        'Aspersores',

      en:
        'Sprinklers'
    },

    {
      es:
        'Filtros',

      en:
        'Filters'
    },

    {
      es:
        'Controladores',

      en:
        'Controllers'
    },

    {
      es:
        'Válvulas',

      en:
        'Valves'
    },

    {
      es:
        'Sensores',

      en:
        'Sensors'
    },

    {
      es:
        'Accesorios',

      en:
        'Accessories'
    }

  ];


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    this.cargarEmpresa();

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar empresa
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

            /*
             * El Navbar puede seguir funcionando
             * aunque la información corporativa
             * no esté disponible.
             */

            console.error(
              'No fue posible cargar la empresa en Navbar:',
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
  | Idioma
  |--------------------------------------------------------------------------
  */

  get language() {

    return this.languageService
      .language();

  }


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


  toggleLanguage(): void {

    this.languageService
      .toggleLanguage();

  }


  /*
  |--------------------------------------------------------------------------
  | Navegación
  |--------------------------------------------------------------------------
  */

  isActive(
    path: string
  ): boolean {

    return this.router.url
      === path;

  }


  closeMobileMenu(): void {

    this.isMenuOpen =
      false;

    this.isProductsOpen =
      false;

  }

}
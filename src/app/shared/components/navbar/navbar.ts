import {

  Component,
  HostListener,
  inject,
  signal,
  OnInit

} from '@angular/core';

import {

  CommonModule

} from '@angular/common';

import {

  RouterLink,
  RouterLinkActive

} from '@angular/router';

import {

  ChevronDown,
  Languages,
  LockKeyhole,
  LucideAngularModule,
  Menu,
  X

} from 'lucide-angular';

import {

  LanguageService

} from '../../../core/services/language.service';

import {

  ImageWithFallback

} from '../image-with-fallback/image-with-fallback';

import {

  CatalogoPublicoService

} from '../../../core/services/publico/catalogo-publico.service';

import {

  CategoriaPublica

} from '../../models/catalogo-publico.model';


@Component({

  selector:
    'app-navbar',

  standalone:
    true,

  imports: [

    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    ImageWithFallback

  ],

  templateUrl:
    './navbar.html',

  styleUrl:
    './navbar.css'

})
export class Navbar implements OnInit{


  /*
|--------------------------------------------------------------------------
| Inicio
|--------------------------------------------------------------------------
*/

ngOnInit(): void {

  this.cargarCategorias();

}

/*
|--------------------------------------------------------------------------
| Categorías
|--------------------------------------------------------------------------
*/

private cargarCategorias(): void {

  this.catalogoService
      .listar()
      .subscribe({

          next:
              response => {

                  this.categorias.set(

                      response
                          .data
                          .categorias
                      ?? []

                  );

              },


          error:
              () => {

                  /*
                   * El Navbar debe seguir funcionando
                   * aunque el catálogo no esté disponible.
                   */

                  this.categorias.set(
                      []
                  );

              }

      });

}

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  readonly languageService =
    inject(
      LanguageService
    );

    private readonly catalogoService =
    inject(
        CatalogoPublicoService
    );


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly menuOpen =
    signal(
      false
    );

  readonly productsOpen =
    signal(
      false
    );

  readonly scrolled =
    signal(
      false
    );

    /*
|--------------------------------------------------------------------------
| Categorías
|--------------------------------------------------------------------------
*/

readonly categorias =
signal<
    CategoriaPublica[]
>([]);

  /*
  |--------------------------------------------------------------------------
  | Logo
  |--------------------------------------------------------------------------
  */

  readonly logo =
    '/images/brand/irriterra-logo.webp';


  
  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly MenuIcon =
    Menu;

  readonly XIcon =
    X;

  readonly LanguagesIcon =
    Languages;

  readonly LockIcon =
    LockKeyhole;

  readonly ChevronDownIcon =
    ChevronDown;


  /*
  |--------------------------------------------------------------------------
  | Scroll
  |--------------------------------------------------------------------------
  */

  @HostListener(
    'window:scroll'
  )
  onWindowScroll(): void {

    this.scrolled.set(
      window.scrollY
      > 16
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Idioma
  |--------------------------------------------------------------------------
  */

  get language():
    'es'
    | 'en' {

    return this
      .languageService
      .language();

  }


  toggleLanguage(): void {

    this.languageService
      .toggleLanguage();

  }


  /*
  |--------------------------------------------------------------------------
  | Productos
  |--------------------------------------------------------------------------
  */

  openProducts(): void {

    this.productsOpen.set(
      true
    );

  }


  closeProducts(): void {

    this.productsOpen.set(
      false
    );

  }


  toggleProducts(): void {

    this.productsOpen.update(
      current =>
        !current
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Mobile
  |--------------------------------------------------------------------------
  */

  toggleMenu(): void {

    this.menuOpen.update(
      current =>
        !current
    );

  }


  closeMenu(): void {

    this.menuOpen.set(
      false
    );

    this.productsOpen.set(
      false
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Traducción
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
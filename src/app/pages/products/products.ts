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
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize
} from 'rxjs';

import {
  CircleAlert,
  FileText,
  ImageOff,
  Package,
  RefreshCw,
  Search,
  X,
  LucideAngularModule
} from 'lucide-angular';

import {
  CatalogoPublicoService
} from '../../core/services/publico/catalogo-publico.service';

import {
  LanguageService
} from '../../core/services/language.service';

import {
  CategoriaPublica,
  ImagenProductoPublica,
  ProductoPublico
} from '../../shared/models/catalogo-publico.model';

import {
  environment
} from '../../../environments/environment';


@Component({
  selector: 'app-products',

  imports: [
      CommonModule,
      RouterLink,
      LucideAngularModule
  ],

  templateUrl:
      './products.html',

  styleUrl:
      './products.css'
})
export class Products
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly catalogoService =
      inject(
          CatalogoPublicoService
      );


  private readonly languageService =
      inject(
          LanguageService
      );


  /*
  |--------------------------------------------------------------------------
  | Backend
  |--------------------------------------------------------------------------
  */

  private readonly backendUrl =
      environment.apiUrl
          .replace(
              /\/api\/?$/,
              ''
          );


  /*
  |--------------------------------------------------------------------------
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly productos =
      signal<
          ProductoPublico[]
      >([]);


  readonly categorias =
      signal<
          CategoriaPublica[]
      >([]);


  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  readonly busqueda =
      signal('');


  readonly idCategoria =
      signal<number | null>(
          null
      );


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly cargando =
      signal(false);


  readonly errorMensaje =
      signal('');


  readonly productoSeleccionado =
      signal<
          ProductoPublico | null
      >(
          null
      );


  readonly erroresImagen =
      signal<
          Record<number, boolean>
      >({});


  /*
  |--------------------------------------------------------------------------
  | Filtrado
  |--------------------------------------------------------------------------
  */

  readonly productosFiltrados =
      computed(
          () => {

              const texto =
                  this.busqueda()
                      .trim()
                      .toLowerCase();


              const categoria =
                  this.idCategoria();


              return this.productos()
                  .filter(
                      producto => {

                          if (
                              categoria !== null
                              &&
                              producto.id_categoria
                              !== categoria
                          ) {

                              return false;

                          }


                          if (
                              ! texto
                          ) {

                              return true;

                          }


                          return [

                              producto.nombre,

                              producto.marca,

                              producto.modelo,

                              producto
                                  .categoria
                                  ?.nombre

                          ]
                              .some(
                                  value =>
                                      value
                                          ?.toLowerCase()
                                          .includes(
                                              texto
                                          )
                              );

                      }
                  );

          }
      );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly CircleAlert =
      CircleAlert;

  readonly FileText =
      FileText;

  readonly ImageOff =
      ImageOff;

  readonly Package =
      Package;

  readonly RefreshCw =
      RefreshCw;

  readonly Search =
      Search;

  readonly X =
      X;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

      this.cargarCatalogo();

  }


  /*
  |--------------------------------------------------------------------------
  | Traducción
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


  /*
  |--------------------------------------------------------------------------
  | API
  |--------------------------------------------------------------------------
  */

  cargarCatalogo(): void {

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


      this.catalogoService
          .listar()
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

              next: response => {

                  this.productos.set(
                      response
                          .data
                          .productos
                      ?? []
                  );


                  this.categorias.set(
                      response
                          .data
                          .categorias
                      ?? []
                  );

              },


              error: (
                  error:
                      HttpErrorResponse
              ) => {

                  this.errorMensaje.set(

                      error.status === 0

                          ? this.t(
                              'No se pudo conectar con el servidor.',
                              'Could not connect to the server.'
                          )

                          : this.t(
                              'No fue posible cargar el catálogo.',
                              'The catalog could not be loaded.'
                          )

                  );

              }

          });

  }


  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  actualizarBusqueda(
      event: Event
  ): void {

      const input =
          event.target as HTMLInputElement;


      this.busqueda.set(
          input.value
      );

  }


  seleccionarCategoria(
      id:
          number | null
  ): void {

      this.idCategoria.set(
          id
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Detalle
  |--------------------------------------------------------------------------
  */

  abrirDetalle(
      producto:
          ProductoPublico
  ): void {

      this.productoSeleccionado
          .set(
              producto
          );

  }


  cerrarDetalle(): void {

      this.productoSeleccionado
          .set(
              null
          );

  }


  /*
  |--------------------------------------------------------------------------
  | Precio desde
  |--------------------------------------------------------------------------
  */

  precioDesde(
      producto:
          ProductoPublico
  ): number | null {

      const precios =
          producto
              .variantes
              .map(
                  variante =>
                      variante
                          .precio_venta
              )
              .filter(
                  (
                      precio
                  ): precio is number =>
                      precio !== null
                      &&
                      Number.isFinite(
                          precio
                      )
              );


      if (
          precios.length === 0
      ) {

          return null;

      }


      return Math.min(
          ...precios
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Imagen principal
  |--------------------------------------------------------------------------
  */

  imagenPrincipal(
      producto:
          ProductoPublico
  ):
      ImagenProductoPublica | null {

      return (
          producto
              .imagenes
              .find(
                  imagen =>
                      imagen
                          .es_principal
              )
          ??
          producto
              .imagenes[0]
          ??
          null
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Resolver imagen
  |--------------------------------------------------------------------------
  */

  rutaImagen(
      imagen:
          ImagenProductoPublica | null
  ): string | null {

      const ruta =
          imagen
              ?.ruta_imagen
              ?.trim();


      if (
          ! ruta
      ) {

          return null;

      }


      if (
          /^https?:\/\//i
              .test(
                  ruta
              )
      ) {

          return ruta;

      }


      if (
          ruta.startsWith(
              '/assets/'
          )
      ) {

          return ruta;

      }


      if (
          ruta.startsWith(
              'assets/'
          )
      ) {

          return `/${ruta}`;

      }


      return (
          `${this.backendUrl}/${
              ruta.replace(
                  /^\/+/,
                  ''
              )
          }`
      );

  }


  /*
  |--------------------------------------------------------------------------
  | PDF / archivos
  |--------------------------------------------------------------------------
  */

  rutaArchivo(
      ruta:
          string | null
  ): string | null {

      const value =
          ruta
              ?.trim();


      if (
          ! value
      ) {

          return null;

      }


      if (
          /^https?:\/\//i
              .test(
                  value
              )
      ) {

          return value;

      }


      if (
          value.startsWith(
              '/assets/'
          )
      ) {

          return value;

      }


      return (
          `${this.backendUrl}/${
              value.replace(
                  /^\/+/,
                  ''
              )
          }`
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Error imagen
  |--------------------------------------------------------------------------
  */

  registrarErrorImagen(
      imagen:
          ImagenProductoPublica
  ): void {

      this.erroresImagen.update(
          errores => ({

              ...errores,

              [
                  imagen
                      .id_producto_imagen
              ]:
                  true

          })
      );

  }


  imagenConError(
      imagen:
          ImagenProductoPublica
  ): boolean {

      return Boolean(
          this.erroresImagen()[
              imagen
                  .id_producto_imagen
          ]
      );

  }

}
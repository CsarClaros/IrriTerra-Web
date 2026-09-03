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
  ActivatedRoute,
  RouterLink
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  finalize
} from 'rxjs';

import {
  ArrowLeft,
  CircleAlert,
  FileText,
  ImageOff,
  RefreshCw,
  LucideAngularModule
} from 'lucide-angular';

import {
  CatalogoPublicoService
} from '../../core/services/publico/catalogo-publico.service';

import {
  LanguageService
} from '../../core/services/language.service';

import {
  ImagenProductoPublica,
  ProductoPublico,
  VarianteProductoPublica
} from '../../shared/models/catalogo-publico.model';

import {
  environment
} from '../../../environments/environment';

import {
  SeoService
} from '../../core/services/seo.service';


@Component({
  selector:
    'app-product-detail',

  imports: [
    CommonModule,
    RouterLink,
    LucideAngularModule
  ],

  templateUrl:
    './product-detail.html',

  styleUrl:
    './product-detail.css'
})
export class ProductDetail
  implements OnInit {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly route =
    inject(
      ActivatedRoute
    );


  private readonly catalogoService =
    inject(
      CatalogoPublicoService
    );


  private readonly languageService =
    inject(
      LanguageService
    );

  private readonly seoService =
    inject(
      SeoService
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
  | Producto
  |--------------------------------------------------------------------------
  */

  readonly producto =
    signal<
      ProductoPublico | null
    >(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Variante
  |--------------------------------------------------------------------------
  */

  readonly varianteSeleccionada =
    signal<
      VarianteProductoPublica | null
    >(
      null
    );


  /*
  |--------------------------------------------------------------------------
  | Imagen seleccionada
  |--------------------------------------------------------------------------
  */

  readonly imagenSeleccionada =
    signal<
      ImagenProductoPublica | null
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


  readonly erroresImagen =
    signal<
      Record<
        number,
        boolean
      >
    >({});


  /*
  |--------------------------------------------------------------------------
  | Imágenes visibles
  |--------------------------------------------------------------------------
  */

  readonly imagenesVisibles =
    computed(
      () => {

        const producto =
          this.producto();


        if (
          !producto
        ) {

          return [];

        }


        const variante =
          this
            .varianteSeleccionada();


        /*
         * Si la variante tiene
         * imágenes propias,
         * utilizarlas.
         */

        if (
          variante
          &&
          variante
            .imagenes
            .length > 0
        ) {

          return this
            .ordenarImagenes(
              variante
                .imagenes
            );

        }


        /*
         * Fallback:
         * imágenes generales.
         */

        return this
          .ordenarImagenes(
            producto
              .imagenes
          );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | Precio visible
  |--------------------------------------------------------------------------
  */

  readonly precioVisible =
    computed(
      () => {

        const variante =
          this
            .varianteSeleccionada();


        if (
          variante
        ) {

          return variante
            .precio_venta;

        }


        const producto =
          this.producto();


        if (
          !producto
        ) {

          return null;

        }


        const precios =
          producto
            .variantes
            .map(
              item =>
                item
                  .precio_venta
            )
            .filter(
              (
                precio
              ): precio is number =>
                precio
                !== null
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
    );


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly ArrowLeft =
    ArrowLeft;

  readonly CircleAlert =
    CircleAlert;

  readonly FileText =
    FileText;

  readonly ImageOff =
    ImageOff;

  readonly RefreshCw =
    RefreshCw;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

    const id =
      Number(
        this.route
          .snapshot
          .paramMap
          .get(
            'id'
          )
      );


    if (
      !Number.isInteger(
        id
      )
      ||
      id < 1
    ) {

      this.configurarSeoNoDisponible();

      this.errorMensaje.set(
        this.t(
          'El producto solicitado no es válido.',
          'The requested product is invalid.'
        )
      );

      return;

    }


    this.configurarSeoCarga(
      id
    );

    this.cargarProducto(
      id
    );

  }


  /*
  |--------------------------------------------------------------------------
  | SEO inicial
  |--------------------------------------------------------------------------
  */

  private configurarSeoCarga(
    id: number
  ): void {

    this.seoService.configurar({

      title:
        'Producto | Irriterra S.R.L.',

      description:
        'Consulta productos, características, variantes y soluciones para riego y agricultura disponibles en Irriterra S.R.L.',

      path:
        `/productos/${id}`

    });

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

    return this
      .languageService
      .t(
        es,
        en
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Cargar producto
  |--------------------------------------------------------------------------
  */

  cargarProducto(
    id: number
  ): void {

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
      .obtenerProducto(
        id
      )
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

            const producto =
              response.data;


            this.producto.set(
              producto
            );


            /*
            |--------------------------------------------------------------------------
            | Primera variante
            |--------------------------------------------------------------------------
            */

            const primeraVariante =
              producto
                .variantes[0]
              ?? null;


            this
              .varianteSeleccionada
              .set(
                primeraVariante
              );


            /*
            |--------------------------------------------------------------------------
            | Primera imagen
            |--------------------------------------------------------------------------
            */

            this
              .seleccionarPrimeraImagen();


            /*
            |--------------------------------------------------------------------------
            | SEO
            |--------------------------------------------------------------------------
            */

            this.configurarSeoProducto(
              producto
            );

          },


        error:
          (
            error:
              HttpErrorResponse
          ) => {

            if (
              error.status === 404
            ) {

              this.configurarSeoNoDisponible();

              this
                .errorMensaje
                .set(
                  this.t(
                    'El producto solicitado no existe o ya no se encuentra disponible.',
                    'The requested product does not exist or is no longer available.'
                  )
                );

              return;

            }


            this
              .errorMensaje
              .set(
                error.status === 0

                  ? this.t(
                    'No se pudo conectar con el servidor.',
                    'Could not connect to the server.'
                  )

                  : this.t(
                    'No fue posible cargar el producto.',
                    'The product could not be loaded.'
                  )
              );

          }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Seleccionar variante
  |--------------------------------------------------------------------------
  */

  seleccionarVariante(
    variante:
      VarianteProductoPublica
  ): void {

    this
      .varianteSeleccionada
      .set(
        variante
      );


    this
      .seleccionarPrimeraImagen();

  }


  /*
  |--------------------------------------------------------------------------
  | Seleccionar imagen
  |--------------------------------------------------------------------------
  */

  seleccionarImagen(
    imagen:
      ImagenProductoPublica
  ): void {

    this
      .imagenSeleccionada
      .set(
        imagen
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Primera imagen
  |--------------------------------------------------------------------------
  */

  private seleccionarPrimeraImagen():
    void {

    const imagenes =
      this.imagenesVisibles();


    const principal =
      imagenes
        .find(
          imagen =>
            imagen
              .es_principal
        )
      ??
      imagenes[0]
      ??
      null;


    this
      .imagenSeleccionada
      .set(
        principal
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Ordenar imágenes
  |--------------------------------------------------------------------------
  */

  private ordenarImagenes(
    imagenes:
      ImagenProductoPublica[]
  ): ImagenProductoPublica[] {

    return [
      ...imagenes
    ]
      .sort(
        (
          a,
          b
        ) => {

          if (
            a.es_principal
            !==
            b.es_principal
          ) {

            return a.es_principal
              ? -1
              : 1;

          }


          return (
            Number(
              a.orden
            )
            -
            Number(
              b.orden
            )
          );

        }
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Ruta imagen
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
      !ruta
    ) {

      return null;

    }


    /*
     * URL absoluta.
     */

    if (
      /^https?:\/\//i
        .test(
          ruta
        )
    ) {

      return ruta;

    }


    /*
     * Assets antiguos.
     */

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


    /*
     * Storage Laravel.
     */

    if (
      ruta.startsWith(
        '/storage/'
      )
    ) {

      return (
        `${this.backendUrl}${ruta}`
      );

    }


    if (
      ruta.startsWith(
        'storage/'
      )
    ) {

      return (
        `${this.backendUrl}/${ruta}`
      );

    }


    /*
     * Rutas almacenadas por
     * ProductoImagenService.
     */

    if (
      ruta.startsWith(
        'productos/'
      )
    ) {

      return (
        `${this.backendUrl}/storage/${ruta}`
      );

    }


    /*
     * Compatibilidad.
     */

    return (
      `${this.backendUrl}/${ruta.replace(
        /^\/+/,
        ''
      )
      }`
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Archivo PDF
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
      !value
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


    if (
      value.startsWith(
        'assets/'
      )
    ) {

      return (
        `/${value}`
      );

    }


    if (
      value.startsWith(
        '/storage/'
      )
    ) {

      return (
        `${this.backendUrl}${value}`
      );

    }


    if (
      value.startsWith(
        'storage/'
      )
    ) {

      return (
        `${this.backendUrl}/${value}`
      );

    }


    return (
      `${this.backendUrl}/${value.replace(
        /^\/+/,
        ''
      )
      }`
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Error de imagen
  |--------------------------------------------------------------------------
  */

  registrarErrorImagen(
    imagen:
      ImagenProductoPublica
  ): void {

    this
      .erroresImagen
      .update(
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

  /*
|--------------------------------------------------------------------------
| SEO producto
|--------------------------------------------------------------------------
*/

  private configurarSeoProducto(
    producto:
      ProductoPublico
  ): void {

    const descripcion =
      this.construirDescripcionSeo(
        producto
      );


    const imagen =
      this.rutaImagen(
        this.imagenSeleccionada()
      );


    this.seoService.configurar({

      title:
        `${producto.nombre} | Irriterra S.R.L.`,

      description:
        descripcion,

      path:
        `/productos/${producto.id_producto}`,

      type:
        'product',

      ...(
        imagen
          ? {
            image:
              imagen
          }
          : {}
      )

    });


  }

  /*
|--------------------------------------------------------------------------
| Descripción SEO
|--------------------------------------------------------------------------
*/

  private construirDescripcionSeo(
    producto:
      ProductoPublico
  ): string {

    const descripcion =
      producto
        .descripcion
        ?.replace(
          /<[^>]*>/g,
          ' '
        )
        .replace(
          /\s+/g,
          ' '
        )
        .trim();


    if (
      descripcion
    ) {

      return this.limitarTextoSeo(
        descripcion
      );

    }


    /*
    |--------------------------------------------------------------------------
    | Fallback
    |--------------------------------------------------------------------------
    */

    const detalles:
      string[] = [];


    if (
      producto.marca
    ) {

      detalles.push(
        `marca ${producto.marca}`
      );

    }


    if (
      producto.modelo
    ) {

      detalles.push(
        `modelo ${producto.modelo}`
      );

    }


    if (
      producto.categoria
        ?.nombre
    ) {

      detalles.push(
        `categoría ${producto.categoria.nombre}`
      );

    }


    const complemento =
      detalles.length > 0

        ? `: ${detalles.join(', ')}`

        : '';


    return this.limitarTextoSeo(

      `Conoce ${producto.nombre}${complemento}. Consulta características y variantes en Irriterra S.R.L., Bolivia.`

    );

  }

  /*
  |--------------------------------------------------------------------------
  | Limitar descripción SEO
  |--------------------------------------------------------------------------
  */

  private limitarTextoSeo(
    texto: string,
    maximo:
      number = 160
  ): string {

    const limpio =
      texto
        .replace(
          /\s+/g,
          ' '
        )
        .trim();


    if (
      limpio.length <= maximo
    ) {

      return limpio;

    }


    const recortado =
      limpio
        .slice(
          0,
          maximo - 1
        )
        .replace(
          /\s+\S*$/,
          ''
        );


    return `${recortado}…`;

  }

  /*
  |--------------------------------------------------------------------------
  | SEO producto inexistente
  |--------------------------------------------------------------------------
  */

  private configurarSeoNoDisponible(): void {

    this.seoService.configurar({

      title:
        'Producto no disponible | Irriterra S.R.L.',

      description:
        'El producto solicitado no se encuentra disponible. Consulta el catálogo de productos de Irriterra S.R.L.',

      path:
        '/productos',

      robots:
        'noindex, nofollow'

    });

  }

}
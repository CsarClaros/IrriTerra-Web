import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  RouterLink
} from '@angular/router';

import {
  finalize,
  forkJoin
} from 'rxjs';

import {
  AlertTriangle,
  ArrowLeft,
  Banknote,
  Boxes,
  History,
  LucideAngularModule,
  RefreshCcw,
  RotateCcw
} from 'lucide-angular';

import {
  ReporteInventarioService
} from '../../../core/services/reportes/reporte-inventario.service';

import {
  SucursalService
} from '../../../core/services/organizacion/sucursal.service';

import {
  ProductoVarianteService
} from '../../../core/services/inventario/producto-variante.service';

import {
  Sucursal
} from '../../../shared/models/sucursal.model';

import {
  ProductoVariante
} from '../../../shared/models/producto-variante.model';

import {
  ReporteKardexFiltros,
  ReporteStockInventarioFiltros
} from '../../../shared/models/reportes/reporte-filtros.model';

import {
  ReporteKardexResumen,
  ReporteMovimientoInventario,
  ReporteStockBajoResumen,
  ReporteStockInventario,
  ReporteStockResumen,
  ReporteValoracionResumen
} from '../../../shared/models/reportes/reporte-inventario.model';


type VistaInventario =
  | 'STOCK'
  | 'CRITICO'
  | 'VALORACION'
  | 'KARDEX';


interface CategoriaFiltro {

  id_categoria:
      number;

  nombre:
      string;

}


@Component({
  selector:
      'app-inventory-report',

  standalone:
      true,

  imports: [
      FormsModule,
      RouterLink,
      LucideAngularModule
  ],

  templateUrl:
      './inventory-report.html',

  styleUrl:
      './inventory-report.css'
})
export class InventoryReport {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly reporteService =
      inject(
          ReporteInventarioService
      );


  private readonly sucursalService =
      inject(
          SucursalService
      );


  private readonly varianteService =
      inject(
          ProductoVarianteService
      );


  /*
  |--------------------------------------------------------------------------
  | Vista
  |--------------------------------------------------------------------------
  */

  readonly vista =
      signal<VistaInventario>(
          'STOCK'
      );


  /*
  |--------------------------------------------------------------------------
  | Catálogos
  |--------------------------------------------------------------------------
  */

  readonly sucursales =
      signal<Sucursal[]>([]);


  readonly variantes =
      signal<ProductoVariante[]>([]);


  readonly categorias =
      signal<CategoriaFiltro[]>([]);


  /*
  |--------------------------------------------------------------------------
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly registrosStock =
      signal<
          ReporteStockInventario[]
      >([]);


  readonly movimientos =
      signal<
          ReporteMovimientoInventario[]
      >([]);


  /*
  |--------------------------------------------------------------------------
  | Resúmenes
  |--------------------------------------------------------------------------
  */

  readonly resumenStock =
      signal<
          ReporteStockResumen | null
      >(null);


  readonly resumenCritico =
      signal<
          ReporteStockBajoResumen | null
      >(null);


  readonly resumenValoracion =
      signal<
          ReporteValoracionResumen | null
      >(null);


  readonly resumenKardex =
      signal<
          ReporteKardexResumen | null
      >(null);


  /*
  |--------------------------------------------------------------------------
  | Estado
  |--------------------------------------------------------------------------
  */

  readonly cargando =
      signal(false);


  readonly errorMensaje =
      signal('');


  /*
  |--------------------------------------------------------------------------
  | Filtros de stock
  |--------------------------------------------------------------------------
  */

  filtrosStock:
      ReporteStockInventarioFiltros = {

          id_sucursal:
              null,

          id_producto_variante:
              null,

          id_categoria:
              null,

          estado_stock:
              'TODOS'

      };


  /*
  |--------------------------------------------------------------------------
  | Filtros de Kardex
  |--------------------------------------------------------------------------
  */

  filtrosKardex:
      ReporteKardexFiltros = {

          id_sucursal:
              null,

          id_producto_variante:
              null,

          tipo_movimiento:
              null,

          tipo_referencia:
              null,

          fecha_desde:
              null,

          fecha_hasta:
              null

      };


  /*
  |--------------------------------------------------------------------------
  | Tipos disponibles
  |--------------------------------------------------------------------------
  */

  readonly tiposMovimiento = [

      {
          valor:
              'ENTRADA',

          nombre:
              'Entrada'
      },

      {
          valor:
              'SALIDA',

          nombre:
              'Salida'
      },

      {
          valor:
              'AJUSTE_ENTRADA',

          nombre:
              'Ajuste de entrada'
      },

      {
          valor:
              'AJUSTE_SALIDA',

          nombre:
              'Ajuste de salida'
      }

  ];


  readonly tiposReferencia = [

      {
          valor:
              'VENTA',

          nombre:
              'Venta'
      },

      {
          valor:
              'COMPRA',

          nombre:
              'Compra'
      },

      {
          valor:
              'TRANSFERENCIA',

          nombre:
              'Transferencia'
      },

      {
          valor:
              'AJUSTE_INICIAL',

          nombre:
              'Ajuste inicial'
      },

      {
          valor:
              'AJUSTE_PRUEBA',

          nombre:
              'Ajuste de prueba'
      },

      {
          valor:
              'AJUSTE_MANUAL',

          nombre:
              'Ajuste manual'
      }

  ];


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly ArrowLeft =
      ArrowLeft;

  readonly Boxes =
      Boxes;

  readonly AlertTriangle =
      AlertTriangle;

  readonly Banknote =
      Banknote;

  readonly History =
      History;

  readonly RefreshCcw =
      RefreshCcw;

  readonly RotateCcw =
      RotateCcw;


  /*
  |--------------------------------------------------------------------------
  | Inicio
  |--------------------------------------------------------------------------
  */

  ngOnInit(): void {

      this.cargarCatalogos();

  }


  /*
  |--------------------------------------------------------------------------
  | Catálogos
  |--------------------------------------------------------------------------
  */

  private cargarCatalogos(): void {

      this.cargando.set(
          true
      );


      this.errorMensaje.set(
          ''
      );


      forkJoin({

          sucursales:
              this.sucursalService
                  .listar(),

          variantes:
              this.varianteService
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

              next: response => {

                  this.sucursales.set(

                      (
                          response
                              .sucursales
                              .data
                          ?? []
                      )
                          .filter(
                              sucursal =>
                                  sucursal.estado_registro
                                  === 'A'
                          )

                  );


                  this.variantes.set(

                      (
                          response
                              .variantes
                              .data
                          ?? []
                      )
                          .filter(
                              variante =>
                                  variante.estado_registro
                                  === 'A'
                          )

                  );


                  this.cargarReporte();

              },


              error: (
                  error:
                      HttpErrorResponse
              ) => {

                  this.errorMensaje.set(
                      this.mensajeError(
                          error
                      )
                  );

              }

          });

  }


  /*
  |--------------------------------------------------------------------------
  | Cambio de vista
  |--------------------------------------------------------------------------
  */

  seleccionarVista(
      vista:
          VistaInventario
  ): void {

      if (
          this.vista()
          === vista
      ) {

          return;

      }


      this.vista.set(
          vista
      );


      this.errorMensaje.set(
          ''
      );


      this.cargarReporte();

  }


  /*
  |--------------------------------------------------------------------------
  | Carga del reporte actual
  |--------------------------------------------------------------------------
  */

  cargarReporte(): void {

      switch (
          this.vista()
      ) {

          case 'STOCK':

              this.cargarStock();

              break;


          case 'CRITICO':

              this.cargarStockCritico();

              break;


          case 'VALORACION':

              this.cargarValoracion();

              break;


          case 'KARDEX':

              this.cargarKardex();

              break;

      }

  }


  /*
  |--------------------------------------------------------------------------
  | Stock
  |--------------------------------------------------------------------------
  */

  private cargarStock(): void {

      this.iniciarCarga();


      this.reporteService
          .stock(
              this.filtrosStock
          )
          .pipe(

              finalize(
                  () =>
                      this.finalizarCarga()
              )

          )
          .subscribe({

              next: response => {

                  this.resumenStock.set(
                      response.resumen
                  );


                  this.registrosStock.set(
                      response.data
                      ?? []
                  );


                  this.actualizarCategorias(
                      response.data
                      ?? []
                  );

              },


              error: error =>
                  this.procesarError(
                      error
                  )

          });

  }


  /*
  |--------------------------------------------------------------------------
  | Stock crítico
  |--------------------------------------------------------------------------
  */

  private cargarStockCritico(): void {

      this.iniciarCarga();


      this.reporteService
          .stockBajoMinimo(
              this.filtrosStock
          )
          .pipe(

              finalize(
                  () =>
                      this.finalizarCarga()
              )

          )
          .subscribe({

              next: response => {

                  this.resumenCritico.set(
                      response.resumen
                  );


                  this.registrosStock.set(
                      response.data
                      ?? []
                  );


                  this.actualizarCategorias(
                      response.data
                      ?? []
                  );

              },


              error: error =>
                  this.procesarError(
                      error
                  )

          });

  }


  /*
  |--------------------------------------------------------------------------
  | Valoración
  |--------------------------------------------------------------------------
  */

  private cargarValoracion(): void {

      this.iniciarCarga();


      this.reporteService
          .valoracion(
              this.filtrosStock
          )
          .pipe(

              finalize(
                  () =>
                      this.finalizarCarga()
              )

          )
          .subscribe({

              next: response => {

                  this.resumenValoracion.set(
                      response.resumen
                  );


                  this.registrosStock.set(
                      response.data
                      ?? []
                  );


                  this.actualizarCategorias(
                      response.data
                      ?? []
                  );

              },


              error: error =>
                  this.procesarError(
                      error
                  )

          });

  }


  /*
  |--------------------------------------------------------------------------
  | Kardex
  |--------------------------------------------------------------------------
  */

  private cargarKardex(): void {

      if (
          this.filtrosKardex.fecha_desde
          &&
          this.filtrosKardex.fecha_hasta
          &&
          this.filtrosKardex.fecha_desde
          >
          this.filtrosKardex.fecha_hasta
      ) {

          this.errorMensaje.set(
              'La fecha final debe ser igual o posterior a la fecha inicial.'
          );

          return;

      }


      this.iniciarCarga();


      this.reporteService
          .kardex(
              this.filtrosKardex
          )
          .pipe(

              finalize(
                  () =>
                      this.finalizarCarga()
              )

          )
          .subscribe({

              next: response => {

                  this.resumenKardex.set(
                      response.resumen
                  );


                  this.movimientos.set(
                      response.data
                      ?? []
                  );

              },


              error: error =>
                  this.procesarError(
                      error
                  )

          });

  }


  /*
  |--------------------------------------------------------------------------
  | Filtros
  |--------------------------------------------------------------------------
  */

  aplicarFiltros(): void {

      this.cargarReporte();

  }


  limpiarFiltros(): void {

      if (
          this.vista()
          === 'KARDEX'
      ) {

          this.filtrosKardex = {

              id_sucursal:
                  null,

              id_producto_variante:
                  null,

              tipo_movimiento:
                  null,

              tipo_referencia:
                  null,

              fecha_desde:
                  null,

              fecha_hasta:
                  null

          };

      } else {

          this.filtrosStock = {

              id_sucursal:
                  null,

              id_producto_variante:
                  null,

              id_categoria:
                  null,

              estado_stock:
                  'TODOS'

          };

      }


      this.cargarReporte();

  }


  /*
  |--------------------------------------------------------------------------
  | Categorías
  |--------------------------------------------------------------------------
  */

  private actualizarCategorias(
      registros:
          ReporteStockInventario[]
  ): void {

      const mapa =
          new Map<
              number,
              string
          >();


      for (
          const categoria
          of this.categorias()
      ) {

          mapa.set(
              categoria.id_categoria,
              categoria.nombre
          );

      }


      for (
          const registro
          of registros
      ) {

          const categoria =
              registro
                  .producto_variante
                  ?.producto
                  ?.categoria;


          if (
              ! categoria
          ) {

              continue;

          }


          mapa.set(
              categoria.id_categoria,
              categoria.nombre
          );

      }


      this.categorias.set(

          Array.from(
              mapa.entries()
          )
              .map(
                  (
                      [
                          id_categoria,
                          nombre
                      ]
                  ) => ({

                      id_categoria,
                      nombre

                  })
              )
              .sort(
                  (
                      a,
                      b
                  ) =>
                      a.nombre.localeCompare(
                          b.nombre
                      )
              )

      );

  }


  /*
  |--------------------------------------------------------------------------
  | Estado de carga
  |--------------------------------------------------------------------------
  */

  private iniciarCarga(): void {

      this.cargando.set(
          true
      );


      this.errorMensaje.set(
          ''
      );

  }


  private finalizarCarga(): void {

      this.cargando.set(
          false
      );

  }


  private procesarError(
      error:
          HttpErrorResponse
  ): void {

      this.errorMensaje.set(
          this.mensajeError(
              error
          )
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Presentación
  |--------------------------------------------------------------------------
  */

  nombreProducto(
      variante:
          ProductoVariante | null | undefined
  ): string {

      if (
          ! variante
      ) {

          return 'Producto no disponible';

      }


      const producto =
          variante.producto
              ?.nombre
          ?? 'Producto';


      return (
          `${producto} - ${variante.nombre}`
      );

  }


  nombreSucursal(
      sucursal:
          Sucursal | null | undefined
  ): string {

      return (
          sucursal?.nombre
          ?? 'Sin sucursal'
      );

  }


  claseEstadoStock(
      estado:
          string | null
  ): string {

      switch (
          estado
      ) {

          case 'AGOTADO':

              return (
                  'bg-red-100 text-red-700'
              );


          case 'BAJO':

              return (
                  'bg-amber-100 text-amber-700'
              );


          case 'NORMAL':

              return (
                  'bg-emerald-100 text-emerald-700'
              );


          default:

              return (
                  'bg-gray-100 text-gray-700'
              );

      }

  }


  nombreEstadoStock(
      estado:
          string | null
  ): string {

      switch (
          estado
      ) {

          case 'AGOTADO':

              return 'Agotado';

          case 'BAJO':

              return 'Bajo mínimo';

          case 'NORMAL':

              return 'Normal';

          default:

              return '-';

      }

  }


  claseMovimiento(
      tipo:
          string
  ): string {

      if (
          tipo === 'ENTRADA'
          ||
          tipo === 'AJUSTE_ENTRADA'
      ) {

          return (
              'bg-emerald-100 text-emerald-700'
          );

      }


      if (
          tipo === 'SALIDA'
          ||
          tipo === 'AJUSTE_SALIDA'
      ) {

          return (
              'bg-red-100 text-red-700'
          );

      }


      return (
          'bg-gray-100 text-gray-700'
      );

  }


  nombreMovimiento(
      tipo:
          string
  ): string {

      switch (
          tipo
      ) {

          case 'ENTRADA':

              return 'Entrada';

          case 'SALIDA':

              return 'Salida';

          case 'AJUSTE_ENTRADA':

              return 'Ajuste entrada';

          case 'AJUSTE_SALIDA':

              return 'Ajuste salida';

          default:

              return tipo;

      }

  }


  nombreReferencia(
      referencia:
          string | null
  ): string {

      if (
          ! referencia
      ) {

          return '-';

      }


      return referencia
          .replaceAll(
              '_',
              ' '
          );

  }


  cantidad(
      valor:
          number | string | null | undefined
  ): string {

      const numero =
          Number(
              valor ?? 0
          );


      return new Intl
          .NumberFormat(
              'es-BO',
              {
                  minimumFractionDigits:
                      0,

                  maximumFractionDigits:
                      3
              }
          )
          .format(
              Number.isFinite(
                  numero
              )
                  ? numero
                  : 0
          );

  }


  moneda(
      valor:
          number | string | null | undefined
  ): string {

      const numero =
          Number(
              valor ?? 0
          );


      return new Intl
          .NumberFormat(
              'es-BO',
              {
                  style:
                      'currency',

                  currency:
                      'BOB',

                  minimumFractionDigits:
                      2
              }
          )
          .format(
              Number.isFinite(
                  numero
              )
                  ? numero
                  : 0
          );

  }


  formatearFecha(
      fecha:
          string | null | undefined
  ): string {

      if (
          ! fecha
      ) {

          return '-';

      }


      const date =
          new Date(
              fecha
          );


      if (
          Number.isNaN(
              date.getTime()
          )
      ) {

          return fecha;

      }


      return new Intl
          .DateTimeFormat(
              'es-BO',
              {
                  dateStyle:
                      'short',

                  timeStyle:
                      'short'
              }
          )
          .format(
              date
          );

  }


  /*
  |--------------------------------------------------------------------------
  | Errores
  |--------------------------------------------------------------------------
  */

  private mensajeError(
      error:
          HttpErrorResponse
  ): string {

      if (
          error.status === 422
          &&
          error.error
              ?.errors
      ) {

          const errores =
              Object.values(
                  error.error.errors
              );


          for (
              const valor
              of errores
          ) {

              if (
                  Array.isArray(
                      valor
                  )
                  &&
                  valor.length > 0
              ) {

                  return String(
                      valor[0]
                  );

              }

          }

      }


      if (
          typeof error.error
              ?.message
          === 'string'
      ) {

          return (
              error.error.message
          );

      }


      if (
          error.status === 403
      ) {

          return (
              'No tiene permiso para consultar este reporte.'
          );

      }


      if (
          error.status === 0
      ) {

          return (
              'No fue posible conectar con el servidor.'
          );

      }


      return (
          'No fue posible cargar el reporte.'
      );

  }

}
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
  finalize
} from 'rxjs';

import {
  EChartsOption
} from 'echarts';

import {
  NgxEchartsDirective
} from 'ngx-echarts';

import {
  ArrowLeft,
  ArrowLeftRight,
  BarChart3,
  List,
  LucideAngularModule,
  Package,
  RefreshCcw,
  RotateCcw
} from 'lucide-angular';

import {
  ReporteTransferenciasService
} from '../../../core/services/reportes/reporte-transferencias.service';

import {
  ReporteTransferenciasFiltros
} from '../../../shared/models/reportes/reporte-filtros.model';

import {
  ReporteTransferenciasResumen
} from '../../../shared/models/reportes/reporte-transferencias.model';

import {
  ReporteProductoOperacion,
  ReporteProductoOperacionResumen
} from '../../../shared/models/reportes/reporte-producto-operacion.model';

import {
  TransferenciaInventario
} from '../../../shared/models/transferencia-inventario.model';


type VistaTransferencias =
  | 'RESUMEN'
  | 'PRODUCTOS';


interface OpcionFiltro {

  id:
  number;

  nombre:
  string;

}


@Component({
  selector:
    'app-transfers-report',

  standalone:
    true,

  imports: [
    FormsModule,
    RouterLink,
    LucideAngularModule,
    NgxEchartsDirective
  ],

  templateUrl:
    './transfers-report.html',

  styleUrl:
    './transfers-report.css'
})
export class TransfersReport {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly reporteService =
    inject(
      ReporteTransferenciasService
    );


  /*
  |--------------------------------------------------------------------------
  | Vista
  |--------------------------------------------------------------------------
  */

  readonly vista =
    signal<VistaTransferencias>(
      'RESUMEN'
    );


  /*
  |--------------------------------------------------------------------------
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly transferencias =
    signal<
      TransferenciaInventario[]
    >([]);


  readonly productos =
    signal<
      ReporteProductoOperacion[]
    >([]);


  /*
  |--------------------------------------------------------------------------
  | Resúmenes
  |--------------------------------------------------------------------------
  */

  readonly resumen =
    signal<
      ReporteTransferenciasResumen | null
    >(null);


  readonly resumenProductos =
    signal<
      ReporteProductoOperacionResumen | null
    >(null);


  /*
  |--------------------------------------------------------------------------
  | ECharts
  |--------------------------------------------------------------------------
  */

  readonly graficoEstados =
    signal<EChartsOption>(
      {}
    );


  readonly graficoProductos =
    signal<EChartsOption>(
      {}
    );


  /*
  |--------------------------------------------------------------------------
  | Catálogos
  |--------------------------------------------------------------------------
  */

  readonly sucursalesOrigen =
    signal<OpcionFiltro[]>([]);


  readonly sucursalesDestino =
    signal<OpcionFiltro[]>([]);


  readonly variantes =
    signal<OpcionFiltro[]>([]);


  private catalogosInicializados =
    false;


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
  | Filtros
  |--------------------------------------------------------------------------
  */

  filtros:
    ReporteTransferenciasFiltros = {

      id_sucursal_origen:
        null,

      id_sucursal_destino:
        null,

      id_producto_variante:
        null,

      estado_transferencia:
        null,

      fecha_desde:
        null,

      fecha_hasta:
        null,

      limite:
        10

    };


  readonly limites = [
    5,
    10,
    20,
    50,
    100
  ];


  /*
  |--------------------------------------------------------------------------
  | Iconos
  |--------------------------------------------------------------------------
  */

  readonly ArrowLeft =
    ArrowLeft;

  readonly ArrowLeftRight =
    ArrowLeftRight;

  readonly BarChart3 =
    BarChart3;

  readonly List =
    List;

  readonly Package =
    Package;

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

    this.cargarResumen();

  }


  /*
  |--------------------------------------------------------------------------
  | Cambio de vista
  |--------------------------------------------------------------------------
  */

  seleccionarVista(
    vista:
      VistaTransferencias
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
  | Reporte actual
  |--------------------------------------------------------------------------
  */

  cargarReporte(): void {

    if (
      !this.validarFechas()
    ) {

      return;

    }


    if (
      this.vista()
      === 'RESUMEN'
    ) {

      this.cargarResumen();

      return;

    }


    this.cargarProductos();

  }


  /*
  |--------------------------------------------------------------------------
  | Resumen
  |--------------------------------------------------------------------------
  */

  private cargarResumen(): void {

    if (
      !this.validarFechas()
    ) {

      return;

    }


    this.iniciarCarga();


    this.reporteService
      .resumen(
        this.filtros
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

        next: response => {

          this.resumen.set(
            response.resumen
          );


          this.transferencias.set(
            response.data
            ?? []
          );


          this.actualizarGraficoEstados(
            response.resumen
          );


          if (
            !this.catalogosInicializados
          ) {

            this.construirCatalogos(
              response.data
              ?? []
            );


            this.catalogosInicializados =
              true;

          }

        },


        error: (
          error:
            HttpErrorResponse
        ) => {

          this.procesarError(
            error
          );

        }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | Productos
  |--------------------------------------------------------------------------
  */

  private cargarProductos(): void {

    if (
      !this.validarFechas()
    ) {

      return;

    }


    this.iniciarCarga();


    this.reporteService
      .productos(
        this.filtros
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

        next: response => {

          this.resumenProductos.set(
            response.resumen
          );


          this.productos.set(
            response.data
            ?? []
          );


          this.actualizarGraficoProductos(
            response.data
            ?? []
          );

        },


        error: (
          error:
            HttpErrorResponse
        ) => {

          this.procesarError(
            error
          );

        }

      });

  }


  /*
  |--------------------------------------------------------------------------
  | ECharts: estados
  |--------------------------------------------------------------------------
  */

  private actualizarGraficoEstados(
    resumen:
      ReporteTransferenciasResumen
  ): void {

    this.graficoEstados.set({

      tooltip: {
        trigger:
          'item',

        formatter:
          '{b}: {c} ({d}%)'
      },

      legend: {
        bottom:
          0
      },

      series: [
        {

          name:
            'Transferencias',

          type:
            'pie',

          radius: [
            '45%',
            '70%'
          ],

          center: [
            '50%',
            '45%'
          ],

          itemStyle: {
            borderRadius:
              6,

            borderWidth:
              2
          },

          label: {
            show:
              true,

            formatter:
              '{b}\n{c}'
          },

          data: [

            {
              value:
                resumen.pendientes,

              name:
                'Pendiente'
            },

            {
              value:
                resumen.en_transito,

              name:
                'En tránsito'
            },

            {
              value:
                resumen.completadas,

              name:
                'Completada'
            },

            {
              value:
                resumen.rechazadas,

              name:
                'Rechazada'
            }

          ]

        }
      ]

    });

  }


  /*
  |--------------------------------------------------------------------------
  | ECharts: ranking
  |--------------------------------------------------------------------------
  */

  private actualizarGraficoProductos(
    productos:
      ReporteProductoOperacion[]
  ): void {

    this.graficoProductos.set({

      tooltip: {
        trigger:
          'axis',

        axisPointer: {
          type:
            'shadow'
        }
      },

      grid: {
        left:
          20,

        right:
          30,

        top:
          20,

        bottom:
          20,

        containLabel:
          true
      },

      xAxis: {
        type:
          'value',

        name:
          'Cantidad'
      },

      yAxis: {
        type:
          'category',

        inverse:
          true,

        data:
          productos.map(
            producto =>
              this.nombreProducto(
                producto
              )
          ),

        axisLabel: {
          width:
            180,

          overflow:
            'truncate'
        }
      },

      series: [
        {

          name:
            'Cantidad transferida',

          type:
            'bar',

          data:
            productos.map(
              producto =>
                Number(
                  producto.cantidad
                )
            ),

          barMaxWidth:
            32

        }
      ]

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

    this.filtros = {

      id_sucursal_origen:
        null,

      id_sucursal_destino:
        null,

      id_producto_variante:
        null,

      estado_transferencia:
        null,

      fecha_desde:
        null,

      fecha_hasta:
        null,

      limite:
        10

    };


    this.cargarReporte();

  }


  private validarFechas(): boolean {

    if (
      this.filtros.fecha_desde
      &&
      this.filtros.fecha_hasta
      &&
      this.filtros.fecha_desde
      >
      this.filtros.fecha_hasta
    ) {

      this.errorMensaje.set(
        'La fecha final debe ser igual o posterior a la fecha inicial.'
      );


      return false;

    }


    return true;

  }


  /*
  |--------------------------------------------------------------------------
  | Catálogos
  |--------------------------------------------------------------------------
  */

  private construirCatalogos(
    transferencias:
      TransferenciaInventario[]
  ): void {

    const origenes =
      new Map<
        number,
        string
      >();


    const destinos =
      new Map<
        number,
        string
      >();


    const variantes =
      new Map<
        number,
        string
      >();


    for (
      const transferencia
      of transferencias
    ) {

      if (
        transferencia
          .sucursal_origen
      ) {

        origenes.set(

          transferencia
            .sucursal_origen
            .id_sucursal,

          transferencia
            .sucursal_origen
            .nombre

        );

      }


      if (
        transferencia
          .sucursal_destino
      ) {

        destinos.set(

          transferencia
            .sucursal_destino
            .id_sucursal,

          transferencia
            .sucursal_destino
            .nombre

        );

      }


      for (
        const detalle
        of transferencia.detalles
        ?? []
      ) {

        const variante =
          detalle
            .producto_variante;


        if (
          !variante
        ) {

          continue;

        }


        const producto =
          variante.producto
            ?.nombre
          ?? 'Producto';


        variantes.set(

          variante
            .id_producto_variante,

          `${producto} - ${variante.nombre}`

        );

      }

    }


    this.sucursalesOrigen.set(
      this.convertirMapa(
        origenes
      )
    );


    this.sucursalesDestino.set(
      this.convertirMapa(
        destinos
      )
    );


    this.variantes.set(
      this.convertirMapa(
        variantes
      )
    );

  }


  private convertirMapa(
    mapa:
      Map<
        number,
        string
      >
  ): OpcionFiltro[] {

    return Array
      .from(
        mapa.entries()
      )
      .map(
        (
          [
            id,
            nombre
          ]
        ) => ({

          id,
          nombre

        })
      )
      .sort(
        (
          a,
          b
        ) =>
          a.nombre
            .localeCompare(
              b.nombre
            )
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Cantidad por transferencia
  |--------------------------------------------------------------------------
  */

  cantidadTransferencia(
    transferencia:
      TransferenciaInventario
  ): number {

    return (
      transferencia
        .detalles
      ?? []
    )
      .reduce(
        (
          total,
          detalle
        ) =>
          total
          +
          Number(
            detalle.cantidad
            ?? 0
          ),

        0
      );

  }


  /*
  |--------------------------------------------------------------------------
  | Producto
  |--------------------------------------------------------------------------
  */

  nombreProducto(
    registro:
      ReporteProductoOperacion
  ): string {

    const variante =
      registro
        .producto_variante;


    if (
      !variante
    ) {

      return (
        'Producto no disponible'
      );

    }


    const producto =
      variante.producto
        ?.nombre
      ?? 'Producto';


    return (
      `${producto} - ${variante.nombre}`
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Estados
  |--------------------------------------------------------------------------
  */

  nombreEstado(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'PENDIENTE':

        return 'Pendiente';


      case 'EN_TRANSITO':

        return 'En tránsito';


      case 'COMPLETADA':

        return 'Completada';


      case 'RECHAZADA':

        return 'Rechazada';


      default:

        return estado;

    }

  }


  claseEstado(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'PENDIENTE':

        return (
          'bg-amber-100 text-amber-700'
        );


      case 'EN_TRANSITO':

        return (
          'bg-blue-100 text-blue-700'
        );


      case 'COMPLETADA':

        return (
          'bg-emerald-100 text-emerald-700'
        );


      case 'RECHAZADA':

        return (
          'bg-red-100 text-red-700'
        );


      default:

        return (
          'bg-gray-100 text-gray-700'
        );

    }

  }


  /*
  |--------------------------------------------------------------------------
  | Formato
  |--------------------------------------------------------------------------
  */

  cantidad(
    valor:
      number | string | null | undefined
  ): string {

    const numero =
      Number(
        valor
        ?? 0
      );


    return new Intl
      .NumberFormat(
        'es-BO',
        {
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


  formatearFecha(
    fecha:
      string | null | undefined
  ): string {

    if (
      !fecha
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
  | Carga
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


  /*
  |--------------------------------------------------------------------------
  | Errores
  |--------------------------------------------------------------------------
  */

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
        'No tiene permiso para consultar reportes de transferencias.'
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
      'No fue posible cargar el reporte de transferencias.'
    );

  }

}
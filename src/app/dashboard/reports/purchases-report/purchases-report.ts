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
  BarChart3,
  List,
  LucideAngularModule,
  Package,
  RefreshCcw,
  RotateCcw,
  ShoppingCart
} from 'lucide-angular';

import {
  ReporteComprasService
} from '../../../core/services/reportes/reporte-compras.service';

import {
  ReporteComprasFiltros
} from '../../../shared/models/reportes/reporte-filtros.model';

import {
  ReporteComprasResumen
} from '../../../shared/models/reportes/reporte-compras.model';

import {
  ReporteProductoOperacion,
  ReporteProductoOperacionResumen
} from '../../../shared/models/reportes/reporte-producto-operacion.model';

import {
  Compra
} from '../../../shared/models/compra.model';


type VistaCompras =
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
    'app-purchases-report',

  standalone:
    true,

  imports: [
    FormsModule,
    RouterLink,
    LucideAngularModule,
    NgxEchartsDirective
  ],

  templateUrl:
    './purchases-report.html',

  styleUrl:
    './purchases-report.css'
})
export class PurchasesReport {

  /*
  |--------------------------------------------------------------------------
  | Dependencias
  |--------------------------------------------------------------------------
  */

  private readonly reporteService =
    inject(
      ReporteComprasService
    );


  /*
  |--------------------------------------------------------------------------
  | Vista
  |--------------------------------------------------------------------------
  */

  readonly vista =
    signal<VistaCompras>(
      'RESUMEN'
    );


  /*
  |--------------------------------------------------------------------------
  | Datos
  |--------------------------------------------------------------------------
  */

  readonly compras =
    signal<Compra[]>([]);


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
      ReporteComprasResumen | null
    >(null);


  readonly resumenProductos =
    signal<
      ReporteProductoOperacionResumen | null
    >(null);


  /*
  |--------------------------------------------------------------------------
  | Gráficos ECharts
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

  readonly sucursales =
    signal<OpcionFiltro[]>([]);


  readonly proveedores =
    signal<OpcionFiltro[]>([]);


  readonly compradores =
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
    ReporteComprasFiltros = {

      id_sucursal:
        null,

      id_proveedor:
        null,

      id_usuario_comprador:
        null,

      id_producto_variante:
        null,

      estado_compra:
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

  readonly ShoppingCart =
    ShoppingCart;


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
  | Vista
  |--------------------------------------------------------------------------
  */

  seleccionarVista(
    vista:
      VistaCompras
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
  | Carga
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
          () =>
            this.cargando.set(
              false
            )
        )

      )
      .subscribe({

        next: response => {

          this.resumen.set(
            response.resumen
          );


          this.compras.set(
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
          () =>
            this.cargando.set(
              false
            )
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
  | Gráfico: estados
  |--------------------------------------------------------------------------
  */

  private actualizarGraficoEstados(
    resumen:
      ReporteComprasResumen
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
            'Compras',

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

          avoidLabelOverlap:
            true,

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
                resumen.borradores,

              name:
                'Borrador'
            },

            {
              value:
                resumen.confirmadas,

              name:
                'Confirmada'
            },

            {
              value:
                resumen.recibidas,

              name:
                'Recibida'
            },

            {
              value:
                resumen.anuladas,

              name:
                'Anulada'
            }

          ]

        }
      ]

    });

  }


  /*
  |--------------------------------------------------------------------------
  | Gráfico: productos
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
            'Cantidad comprada',

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

      id_sucursal:
        null,

      id_proveedor:
        null,

      id_usuario_comprador:
        null,

      id_producto_variante:
        null,

      estado_compra:
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
    compras:
      Compra[]
  ): void {

    const sucursales =
      new Map<number, string>();


    const proveedores =
      new Map<number, string>();


    const compradores =
      new Map<number, string>();


    const variantes =
      new Map<number, string>();


    for (
      const compra
      of compras
    ) {

      /*
      |--------------------------------------------------------------------------
      | Sucursal
      |--------------------------------------------------------------------------
      */

      if (
        compra.sucursal
      ) {

        sucursales.set(
          compra.sucursal.id_sucursal,
          compra.sucursal.nombre
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Proveedor
      |--------------------------------------------------------------------------
      */

      if (
        compra.proveedor
      ) {

        proveedores.set(
          compra.proveedor.id_proveedor,
          compra.proveedor.nombre_razon_social
        );

      }


      /*
      |--------------------------------------------------------------------------
      | Comprador
      |--------------------------------------------------------------------------
      */

      if (
        compra.comprador
      ) {

        compradores.set(

          compra.comprador.id_usuario,

          this.nombreUsuario(
            compra.comprador
          )

        );

      }


      /*
      |--------------------------------------------------------------------------
      | Productos
      |--------------------------------------------------------------------------
      */

      for (
        const detalle
        of compra.detalles
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

          variante.id_producto_variante,

          `${producto} - ${variante.nombre}`

        );

      }

    }


    this.sucursales.set(
      this.convertirMapa(
        sucursales
      )
    );


    this.proveedores.set(
      this.convertirMapa(
        proveedores
      )
    );


    this.compradores.set(
      this.convertirMapa(
        compradores
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
      Map<number, string>
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
  | Presentación
  |--------------------------------------------------------------------------
  */

  nombreUsuario(
    usuario: {
      nombre:
      string;

      apellido_paterno?:
      string | null;

      apellido_materno?:
      string | null;
    }
  ): string {

    return [

      usuario.nombre,

      usuario.apellido_paterno,

      usuario.apellido_materno

    ]
      .filter(
        Boolean
      )
      .join(
        ' '
      );

  }


  nombreProducto(
    registro:
      ReporteProductoOperacion
  ): string {

    const variante =
      registro.producto_variante;


    const producto =
      variante.producto
        ?.nombre
      ?? 'Producto';


    return (
      `${producto} - ${variante.nombre}`
    );

  }


  nombreEstado(
    estado:
      string
  ): string {

    switch (
    estado
    ) {

      case 'BORRADOR':

        return 'Borrador';

      case 'CONFIRMADA':

        return 'Confirmada';

      case 'RECIBIDA':

        return 'Recibida';

      case 'ANULADA':

        return 'Anulada';

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

      case 'BORRADOR':

        return (
          'bg-gray-100 text-gray-700'
        );

      case 'CONFIRMADA':

        return (
          'bg-blue-100 text-blue-700'
        );

      case 'RECIBIDA':

        return (
          'bg-emerald-100 text-emerald-700'
        );

      case 'ANULADA':

        return (
          'bg-red-100 text-red-700'
        );

      default:

        return (
          'bg-gray-100 text-gray-700'
        );

    }

  }


  moneda(
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
  | Carga / errores
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
      error.error?.errors
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
        'No tiene permiso para consultar reportes de compras.'
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
      'No fue posible cargar el reporte de compras.'
    );

  }

}
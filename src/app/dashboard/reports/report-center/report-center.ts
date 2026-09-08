import {
    Component,
    computed,
    inject
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    RouterLink
} from '@angular/router';

import {
    ArrowLeftRight,
    BarChart3,
    Boxes,
    ChevronRight,
    LucideAngularModule,
    ShoppingCart
} from 'lucide-angular';

import {
    SessionService
} from '../../../core/services/session.service';


@Component({
    selector:
        'app-report-center',

    standalone:
        true,

    imports: [
        CommonModule,
        RouterLink,
        LucideAngularModule
    ],

    templateUrl:
        './report-center.html',

    styleUrl:
        './report-center.css'
})
export class ReportCenter {

    private readonly sessionService =
        inject(
            SessionService
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly BarChart3 =
        BarChart3;


    /*
    |--------------------------------------------------------------------------
    | Reportes disponibles
    |--------------------------------------------------------------------------
    */

    readonly reportesDisponibles =
        computed(
            () => {

                /*
                |--------------------------------------------------------------------------
                | Fuerza dependencia reactiva con la sesión
                |--------------------------------------------------------------------------
                */

                this.sessionService
                    .usuario();


                return [

                    {
                        titulo:
                            'Inventario',

                        descripcion:
                            'Stock, productos críticos, valoración y movimientos de inventario.',

                        ruta:
                            '/dashboard/reports/inventory',

                        permiso:
                            'reporte_inventario.ver',

                        icono:
                            Boxes
                    },

                    // {
                    //     titulo:
                    //         'Ventas',

                    //     descripcion:
                    //         'Resumen de ventas, importes, ticket promedio y productos más vendidos.',

                    //     ruta:
                    //         '/dashboard/reports/sales',

                    //     permiso:
                    //         'reporte_ventas.ver',

                    //     icono:
                    //         BarChart3
                    // },

                    // {
                    //     titulo:
                    //         'Compras',

                    //     descripcion:
                    //         'Compras realizadas, importes y productos con mayor volumen de compra.',

                    //     ruta:
                    //         '/dashboard/reports/purchases',

                    //     permiso:
                    //         'reporte_compras.ver',

                    //     icono:
                    //         ShoppingCart
                    // },

                    // {
                    //     titulo:
                    //         'Transferencias',

                    //     descripcion:
                    //         'Movimientos entre sucursales, estados y productos más transferidos.',

                    //     ruta:
                    //         '/dashboard/reports/transfers',

                    //     permiso:
                    //         'reporte_transferencias.ver',

                    //     icono:
                    //         ArrowLeftRight
                    // }

                ]
                    .filter(
                        reporte =>
                            this.sessionService
                                .tienePermiso(
                                    reporte.permiso
                                )
                    );

            }
        );


    readonly ChevronRight =
        ChevronRight;

}
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
    ArrowRight,
    BarChart3,
    Boxes,
    LucideAngularModule
} from 'lucide-angular';

import {
    SessionService
} from '../../core/services/session.service';


interface ReporteDisponible {

    titulo:
    string;

    descripcion:
    string;

    path:
    string;

    permiso:
    string;

    icono:
    typeof BarChart3;

}


@Component({
    selector:
        'app-reportes',

    standalone:
        true,

    imports: [
        CommonModule,
        RouterLink,
        LucideAngularModule
    ],

    templateUrl:
        './reports.html',

    styleUrl:
        './reports.css'
})
export class Reports {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly sessionService =
        inject(
            SessionService
        );


    /*
    |--------------------------------------------------------------------------
    | Iconos
    |--------------------------------------------------------------------------
    */

    readonly ArrowRight =
        ArrowRight;


    /*
    |--------------------------------------------------------------------------
    | Reportes actualmente implementados
    |--------------------------------------------------------------------------
    */

    private readonly reportes:
        ReporteDisponible[] = [

            {

                titulo:
                    'Reporte de ventas',

                descripcion:
                    'Consulte ventas, ingresos, descuentos, productos vendidos y rendimiento por período.',

                path:
                    '/dashboard/reports/sales',

                permiso:
                    'reporte_ventas.ver',

                icono:
                    BarChart3

            },

            // {

            //     titulo:
            //         'Inventario y stock',

            //     descripcion:
            //         'Consulte existencias, stock mínimo y situación actual del inventario.',

            //     path:
            //         '/dashboard/reports/inventory',

            //     permiso:
            //         'reporte_inventario.ver',

            //     icono:
            //         Boxes

            // }

        ];


    /*
    |--------------------------------------------------------------------------
    | Reportes visibles
    |--------------------------------------------------------------------------
    */

    readonly reportesVisibles =
        computed(
            () =>
                this.reportes
                    .filter(
                        reporte =>
                            this.sessionService
                                .tienePermiso(
                                    reporte.permiso
                                )
                    )
        );

}
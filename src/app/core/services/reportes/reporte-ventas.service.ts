import {
    inject,
    Injectable
} from '@angular/core';

import {
    Observable
} from 'rxjs';

import {
    ApiService
} from '../api.service';

import {
    ReporteProductosVentasResponse,
    ReporteVentasFiltros,
    ReporteVentasResponse
} from '../../../shared/models/reporte-ventas.model';


@Injectable({
    providedIn: 'root'
})
export class ReporteVentasService {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly api =
        inject(
            ApiService
        );


    /*
    |--------------------------------------------------------------------------
    | Resumen de ventas
    |--------------------------------------------------------------------------
    */

    resumen(
        filtros:
            ReporteVentasFiltros = {}
    ): Observable<
        ReporteVentasResponse
    > {

        const query =
            this.construirQuery(
                filtros,
                true
            );


        return this.api
            .get<
                ReporteVentasResponse
            >(
                `reportes/ventas/resumen${query}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Productos más vendidos
    |--------------------------------------------------------------------------
    */

    productos(
        filtros:
            ReporteVentasFiltros = {}
    ): Observable<
        ReporteProductosVentasResponse
    > {

        /*
         * El reporte de productos considera
         * exclusivamente ventas COMPLETADAS.
         *
         * Por ese motivo no enviamos estado_venta
         * a este endpoint.
         */

        const query =
            this.construirQuery(
                filtros,
                false
            );


        return this.api
            .get<
                ReporteProductosVentasResponse
            >(
                `reportes/ventas/productos${query}`
            );

    }


    /*
    |--------------------------------------------------------------------------
    | Construcción de parámetros GET
    |--------------------------------------------------------------------------
    */

    private construirQuery(
        filtros:
            ReporteVentasFiltros,

        incluirEstado:
            boolean
    ): string {

        const parametros =
            new URLSearchParams();


        /*
        |--------------------------------------------------------------------------
        | Sucursal
        |--------------------------------------------------------------------------
        */

        if (
            filtros.id_sucursal
            !== null
            &&
            filtros.id_sucursal
            !== undefined
        ) {

            parametros.set(
                'id_sucursal',
                String(
                    filtros.id_sucursal
                )
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Cliente
        |--------------------------------------------------------------------------
        */

        if (
            filtros.id_cliente
            !== null
            &&
            filtros.id_cliente
            !== undefined
        ) {

            parametros.set(
                'id_cliente',
                String(
                    filtros.id_cliente
                )
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Vendedor
        |--------------------------------------------------------------------------
        */

        if (
            filtros.id_usuario_vendedor
            !== null
            &&
            filtros.id_usuario_vendedor
            !== undefined
        ) {

            parametros.set(
                'id_usuario_vendedor',
                String(
                    filtros.id_usuario_vendedor
                )
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Producto / variante
        |--------------------------------------------------------------------------
        */

        if (
            filtros.id_producto_variante
            !== null
            &&
            filtros.id_producto_variante
            !== undefined
        ) {

            parametros.set(
                'id_producto_variante',
                String(
                    filtros.id_producto_variante
                )
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Estado
        |--------------------------------------------------------------------------
        */

        if (
            incluirEstado
            &&
            filtros.estado_venta
        ) {

            parametros.set(
                'estado_venta',
                filtros.estado_venta
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Fecha inicial
        |--------------------------------------------------------------------------
        */

        if (
            filtros.fecha_desde
        ) {

            parametros.set(
                'fecha_desde',
                filtros.fecha_desde
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Fecha final
        |--------------------------------------------------------------------------
        */

        if (
            filtros.fecha_hasta
        ) {

            parametros.set(
                'fecha_hasta',
                filtros.fecha_hasta
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Límite
        |--------------------------------------------------------------------------
        */

        if (
            filtros.limite
            !== null
            &&
            filtros.limite
            !== undefined
        ) {

            parametros.set(
                'limite',
                String(
                    filtros.limite
                )
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Resultado
        |--------------------------------------------------------------------------
        */

        const query =
            parametros.toString();


        return query
            ? `?${query}`
            : '';

    }

}
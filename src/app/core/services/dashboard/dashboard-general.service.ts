import {
    inject,
    Injectable
} from '@angular/core';

import {
    catchError,
    forkJoin,
    map,
    Observable,
    of
} from 'rxjs';

import {
    SessionService
} from '../session.service';

import {
    ReporteVentasService
} from '../reportes/reporte-ventas.service';

import {
    ReporteInventarioService
} from '../reportes/reporte-inventario.service';

import {
    ReporteComprasService
} from '../reportes/reporte-compras.service';

import {
    ReporteTransferenciasService
} from '../reportes/reporte-transferencias.service';

import {
    DashboardCompras,
    DashboardGeneral,
    DashboardInventario,
    DashboardModulo,
    DashboardTransferencias,
    DashboardVentas
} from '../../../shared/models/dashboard-general.model';


interface ResultadoModulo<T> {

    data:
    T | null;

    error:
    boolean;

}


@Injectable({
    providedIn:
        'root'
})
export class DashboardGeneralService {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly sessionService =
        inject(
            SessionService
        );


    private readonly ventasService =
        inject(
            ReporteVentasService
        );


    private readonly inventarioService =
        inject(
            ReporteInventarioService
        );


    private readonly comprasService =
        inject(
            ReporteComprasService
        );


    private readonly transferenciasService =
        inject(
            ReporteTransferenciasService
        );


    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    cargar():
        Observable<
            DashboardGeneral
        > {

        return forkJoin({

            ventas:
                this.protegerModulo(
                    this.cargarVentas()
                ),

            inventario:
                this.protegerModulo(
                    this.cargarInventario()
                ),

            compras:
                this.protegerModulo(
                    this.cargarCompras()
                ),

            transferencias:
                this.protegerModulo(
                    this.cargarTransferencias()
                )

        })
            .pipe(

                map(
                    response => {

                        const errores:
                            DashboardModulo[] = [];


                        if (
                            response.ventas.error
                        ) {

                            errores.push(
                                'VENTAS'
                            );

                        }


                        if (
                            response.inventario.error
                        ) {

                            errores.push(
                                'INVENTARIO'
                            );

                        }


                        if (
                            response.compras.error
                        ) {

                            errores.push(
                                'COMPRAS'
                            );

                        }


                        if (
                            response.transferencias.error
                        ) {

                            errores.push(
                                'TRANSFERENCIAS'
                            );

                        }


                        return {

                            ventas:
                                response
                                    .ventas
                                    .data,

                            inventario:
                                response
                                    .inventario
                                    .data,

                            compras:
                                response
                                    .compras
                                    .data,

                            transferencias:
                                response
                                    .transferencias
                                    .data,

                            errores

                        };

                    }
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Protección individual
    |--------------------------------------------------------------------------
    */

    private protegerModulo<T>(
        source:
            Observable<T>
    ): Observable<
        ResultadoModulo<T>
    > {

        return source
            .pipe(

                map(
                    data => ({

                        data,

                        error:
                            false

                    })
                ),

                catchError(
                    () =>
                        of({

                            data:
                                null,

                            error:
                                true

                        })
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Ventas
    |--------------------------------------------------------------------------
    */

    private cargarVentas():
        Observable<
            DashboardVentas | null
        > {

        if (
            !this.sessionService
                .tienePermiso(
                    'reporte_ventas.ver'
                )
        ) {

            return of(
                null
            );

        }


        return forkJoin({

            resumen:
                this.ventasService
                    .resumen(),

            productos:
                this.ventasService
                    .productos({
                        limite:
                            5
                    })

        })
            .pipe(

                map(
                    response => ({

                        resumen:
                            response
                                .resumen
                                .resumen,

                        ventas:
                            response
                                .resumen
                                .data
                                .slice(
                                    0,
                                    5
                                ),

                        productos:
                            response
                                .productos
                                .data

                    })
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Inventario
    |--------------------------------------------------------------------------
    */

    private cargarInventario():
        Observable<
            DashboardInventario | null
        > {

        if (
            !this.sessionService
                .tienePermiso(
                    'reporte_inventario.ver'
                )
        ) {

            return of(
                null
            );

        }


        return this.inventarioService
            .stockBajoMinimo()
            .pipe(

                map(
                    response => ({

                        resumenCritico:
                            response.resumen,

                        stockCritico:
                            response.data
                                .slice(
                                    0,
                                    5
                                )

                    })
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Compras
    |--------------------------------------------------------------------------
    */

    private cargarCompras():
        Observable<
            DashboardCompras | null
        > {

        if (
            !this.sessionService
                .tienePermiso(
                    'reporte_compras.ver'
                )
        ) {

            return of(
                null
            );

        }


        return this.comprasService
            .resumen()
            .pipe(

                map(
                    response => ({

                        resumen:
                            response.resumen,

                        compras:
                            response.data
                                .slice(
                                    0,
                                    5
                                )

                    })
                )

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Transferencias
    |--------------------------------------------------------------------------
    */

    private cargarTransferencias():
        Observable<
            DashboardTransferencias | null
        > {

        if (
            !this.sessionService
                .tienePermiso(
                    'reporte_transferencias.ver'
                )
        ) {

            return of(
                null
            );

        }


        return this.transferenciasService
            .resumen()
            .pipe(

                map(
                    response => ({

                        resumen:
                            response.resumen,

                        transferencias:
                            response.data
                                .slice(
                                    0,
                                    5
                                )

                    })
                )

            );

    }

}
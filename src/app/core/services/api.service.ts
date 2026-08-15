import {
    inject,
    Injectable
} from '@angular/core';

import {
    HttpClient,
    HttpHeaders
} from '@angular/common/http';

import {
    Observable
} from 'rxjs';

import {
    environment
} from '../../../environments/environment';


export type ApiParams =
    Record<
        string,
        string |
        number |
        boolean |
        readonly (
            string |
            number |
            boolean
        )[]
    >;


@Injectable({
    providedIn: 'root'
})
export class ApiService {

    /*
    |--------------------------------------------------------------------------
    | Dependencias
    |--------------------------------------------------------------------------
    */

    private readonly http =
        inject(HttpClient);


    /*
    |--------------------------------------------------------------------------
    | Configuración
    |--------------------------------------------------------------------------
    */

    private readonly baseUrl =
        environment.apiUrl
            .replace(
                /\/+$/,
                ''
            );


    private readonly headers =
        new HttpHeaders({

            Accept:
                'application/json'

        });


    /*
    |--------------------------------------------------------------------------
    | GET
    |--------------------------------------------------------------------------
    */

    get<T>(
        endpoint: string,
        params?: ApiParams
    ): Observable<T> {

        return this.http.get<T>(

            this.buildUrl(
                endpoint
            ),

            {
                headers:
                    this.headers,

                params
            }

        );
    }


    /*
    |--------------------------------------------------------------------------
    | POST
    |--------------------------------------------------------------------------
    */

    post<T>(
        endpoint: string,
        body: unknown
    ): Observable<T> {

        return this.http.post<T>(

            this.buildUrl(
                endpoint
            ),

            body,

            {
                headers:
                    this.headers
            }

        );
    }


    /*
    |--------------------------------------------------------------------------
    | PUT
    |--------------------------------------------------------------------------
    */

    put<T>(
        endpoint: string,
        body: unknown
    ): Observable<T> {

        return this.http.put<T>(

            this.buildUrl(
                endpoint
            ),

            body,

            {
                headers:
                    this.headers
            }

        );
    }


    /*
    |--------------------------------------------------------------------------
    | PATCH
    |--------------------------------------------------------------------------
    */

    patch<T>(
        endpoint: string,
        body: unknown
    ): Observable<T> {

        return this.http.patch<T>(

            this.buildUrl(
                endpoint
            ),

            body,

            {
                headers:
                    this.headers
            }

        );
    }


    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    delete<T>(
        endpoint: string
    ): Observable<T> {

        return this.http.delete<T>(

            this.buildUrl(
                endpoint
            ),

            {
                headers:
                    this.headers
            }

        );
    }


    /*
    |--------------------------------------------------------------------------
    | Construcción de URL
    |--------------------------------------------------------------------------
    */

    private buildUrl(
        endpoint: string
    ): string {

        const cleanEndpoint =
            endpoint.replace(
                /^\/+/,
                ''
            );

        return (
            `${this.baseUrl}/${cleanEndpoint}`
        );
    }

}
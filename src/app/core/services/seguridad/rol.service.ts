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
    RolResumen
} from '../../../shared/models/user.model';

import {
    ApiCollectionResponse,
    ApiResourceResponse
} from '../../../shared/models/api-response.model';


@Injectable({
    providedIn:
        'root'
})
export class RolService {

    private readonly api =
        inject(
            ApiService
        );


    listar():
        Observable<
            ApiCollectionResponse<
                RolResumen
            >
        > {

        return this.api
            .get<
                ApiCollectionResponse<
                    RolResumen
                >
            >(
                'rol'
            );

    }


    obtener(
        id:
            number
    ): Observable<
        ApiResourceResponse<
            RolResumen
        >
    > {

        return this.api
            .get<
                ApiResourceResponse<
                    RolResumen
                >
            >(
                `rol/${id}`
            );

    }

}
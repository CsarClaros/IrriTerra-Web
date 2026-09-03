import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';


interface TurnstileApi {

    render(
        element:
            HTMLElement,
        options: {
            sitekey:
                string;

            action?:
                string;

            callback?:
                (
                    token:
                        string
                ) => void;

            'expired-callback'?:
                () => void;

            'error-callback'?:
                () => void;
        }
    ): string;

    reset(
        widgetId:
            string
    ): void;

    remove(
        widgetId:
            string
    ): void;

}


declare global {

    interface Window {

        turnstile?:
            TurnstileApi;

    }

}


@Component({
    selector:
        'app-turnstile',

    standalone:
        true,

    template:
        `
            <div #container></div>
        `
})
export class TurnstileComponent
    implements
        AfterViewInit,
        OnDestroy {

    /*
    |--------------------------------------------------------------------------
    | Inputs
    |--------------------------------------------------------------------------
    */

    @Input({
        required:
            true
    })
    siteKey =
        '';


    @Input()
    action =
        'contacto';


    /*
    |--------------------------------------------------------------------------
    | Outputs
    |--------------------------------------------------------------------------
    */

    @Output()
    tokenChange =
        new EventEmitter<
            string
        >();


    /*
    |--------------------------------------------------------------------------
    | Elemento
    |--------------------------------------------------------------------------
    */

    @ViewChild(
        'container',
        {
            static:
                true
        }
    )
    private container!:
        ElementRef<
            HTMLDivElement
        >;


    /*
    |--------------------------------------------------------------------------
    | Estado
    |--------------------------------------------------------------------------
    */

    private widgetId:
        string | null =
        null;


    private static scriptPromise:
        Promise<
            TurnstileApi
        >
        | null =
        null;


    constructor(
        private readonly zone:
            NgZone
    ) {}


    /*
    |--------------------------------------------------------------------------
    | Inicio
    |--------------------------------------------------------------------------
    */

    async ngAfterViewInit():
        Promise<void> {

        const turnstile =
            await this
                .cargarScript();


        this.widgetId =
            turnstile.render(

                this
                    .container
                    .nativeElement,

                {

                    sitekey:
                        this.siteKey,

                    action:
                        this.action,

                    callback:
                        (
                            token:
                                string
                        ) => {

                            this.zone.run(
                                () =>
                                    this.tokenChange
                                        .emit(
                                            token
                                        )
                            );

                        },

                    'expired-callback':
                        () => {

                            this.zone.run(
                                () =>
                                    this.tokenChange
                                        .emit(
                                            ''
                                        )
                            );

                        },

                    'error-callback':
                        () => {

                            this.zone.run(
                                () =>
                                    this.tokenChange
                                        .emit(
                                            ''
                                        )
                            );

                        }

                }

            );

    }


    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */

    reset(): void {

        if (
            this.widgetId
            &&
            window.turnstile
        ) {

            window.turnstile
                .reset(
                    this.widgetId
                );


            this.tokenChange
                .emit(
                    ''
                );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Destruir
    |--------------------------------------------------------------------------
    */

    ngOnDestroy(): void {

        if (
            this.widgetId
            &&
            window.turnstile
        ) {

            window.turnstile
                .remove(
                    this.widgetId
                );

        }

    }


    /*
    |--------------------------------------------------------------------------
    | Script
    |--------------------------------------------------------------------------
    */

    private cargarScript():
        Promise<
            TurnstileApi
        > {

        if (
            window.turnstile
        ) {

            return Promise.resolve(
                window.turnstile
            );

        }


        if (
            TurnstileComponent
                .scriptPromise
        ) {

            return TurnstileComponent
                .scriptPromise;

        }


        TurnstileComponent
            .scriptPromise =
            new Promise(
                (
                    resolve,
                    reject
                ) => {

                    const script =
                        document
                            .createElement(
                                'script'
                            );


                    script.src =
                        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';


                    script.async =
                        true;

                    script.defer =
                        true;


                    script.onload =
                        () => {

                            if (
                                window.turnstile
                            ) {

                                resolve(
                                    window.turnstile
                                );

                                return;

                            }


                            reject(
                                new Error(
                                    'Cloudflare Turnstile no está disponible.'
                                )
                            );

                        };


                    script.onerror =
                        () =>
                            reject(
                                new Error(
                                    'No fue posible cargar Cloudflare Turnstile.'
                                )
                            );


                    document.head
                        .appendChild(
                            script
                        );

                }
            );


        return TurnstileComponent
            .scriptPromise;

    }

}
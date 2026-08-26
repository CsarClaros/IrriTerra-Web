export function construirQueryReporte<
    T extends object
>(
    filtros:
        T
): string {

    const params =
        new URLSearchParams();


    Object
        .entries(
            filtros
        )
        .forEach(
            (
                [
                    clave,
                    valor
                ]
            ) => {

                if (
                    valor === undefined
                    ||
                    valor === null
                    ||
                    valor === ''
                ) {

                    return;

                }


                params.set(
                    clave,
                    String(
                        valor
                    )
                );

            }
        );


    const query =
        params.toString();


    return query
        ? `?${query}`
        : '';

}
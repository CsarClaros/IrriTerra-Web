import {
    Routes
} from '@angular/router';


/*
|--------------------------------------------------------------------------
| Layout público
|--------------------------------------------------------------------------
*/

import {
    MainLayout
} from './layouts/main-layout/main-layout';


/*
|--------------------------------------------------------------------------
| Página principal
|--------------------------------------------------------------------------
*/

import {
    Home
} from './pages/home/home';


/*
|--------------------------------------------------------------------------
| Guards
|--------------------------------------------------------------------------
*/

import {
    authGuard
} from './core/guards/auth.guard';

import {
    anyPermissionGuard,
    permissionGuard
} from './core/guards/permission-guard';

import {
    NotFound
} from './pages/not-found/not-found';


/*
|--------------------------------------------------------------------------
| Rutas
|--------------------------------------------------------------------------
*/

export const routes: Routes = [

    /*
    |--------------------------------------------------------------------------
    | Sitio público
    |--------------------------------------------------------------------------
    */

    {
        path: '',

        component:
            MainLayout,

        children: [

            /*
            |--------------------------------------------------------------------------
            | Inicio
            |--------------------------------------------------------------------------
            */

            {
                path: '',

                component:
                    Home
            },


            /*
            |--------------------------------------------------------------------------
            | Productos
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'productos',

                loadComponent: () =>
                    import(
                        './pages/products/products'
                    ).then(
                        m =>
                            m.Products
                    )
            },


            /*
            |--------------------------------------------------------------------------
            | Detalle producto
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'productos/:id',

                loadComponent: () =>
                    import(
                        './pages/product-detail/product-detail'
                    ).then(
                        m =>
                            m.ProductDetail
                    )
            },


            /*
            |--------------------------------------------------------------------------
            | Empresa
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'empresa',

                loadComponent: () =>
                    import(
                        './pages/company/company'
                    ).then(
                        m =>
                            m.Company
                    )
            },


            /*
            |--------------------------------------------------------------------------
            | Eventos
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'eventos',

                loadComponent: () =>
                    import(
                        './pages/events/events'
                    ).then(
                        m =>
                            m.Events
                    )
            },


            /*
            |--------------------------------------------------------------------------
            | Contactos
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'contactos',

                loadComponent: () =>
                    import(
                        './pages/contact/contact'
                    ).then(
                        m =>
                            m.Contact
                    )
            },


            /*
            |--------------------------------------------------------------------------
            | Login
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'login',

                loadComponent: () =>
                    import(
                        './pages/login/login'
                    ).then(
                        m =>
                            m.Login
                    )
            }

        ]
    },


    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    {
        path:
            'dashboard',

        loadComponent: () =>
            import(
                './layouts/dashboard-layout/dashboard-layout'
            ).then(
                m =>
                    m.DashboardLayout
            ),

        canActivate: [
            authGuard
        ],

        children: [

            /*
            |--------------------------------------------------------------------------
            | Overview
            |--------------------------------------------------------------------------
            */

            {
                path: '',

                loadComponent: () =>
                    import(
                        './dashboard/overview/overview'
                    ).then(
                        m =>
                            m.Overview
                    )
            },


            /*
            |--------------------------------------------------------------------------
            | Ventas
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'sales/create',

                loadComponent: () =>
                    import(
                        './dashboard/sales/sales-create/sales-create'
                    ).then(
                        m =>
                            m.SalesCreate
                    ),

                canActivate: [
                    permissionGuard(
                        'venta.crear'
                    )
                ]
            },


            {
                path:
                    'sales/:id/edit',

                loadComponent: () =>
                    import(
                        './dashboard/sales/sales-create/sales-create'
                    ).then(
                        m =>
                            m.SalesCreate
                    ),

                canActivate: [
                    permissionGuard(
                        'venta.editar'
                    )
                ]
            },


            {
                path:
                    'sales/reports',

                redirectTo:
                    'reports/sales',

                pathMatch:
                    'full'
            },


            {
                path:
                    'sales/export',

                loadComponent: () =>
                    import(
                        './dashboard/sales/sales-export/sales-export'
                    ).then(
                        m =>
                            m.SalesExport
                    ),

                canActivate: [
                    permissionGuard(
                        'reporte_ventas.ver'
                    )
                ]
            },


            {
                path:
                    'sales',

                loadComponent: () =>
                    import(
                        './dashboard/sales/sales-list/sales-list'
                    ).then(
                        m =>
                            m.SalesList
                    ),

                canActivate: [
                    permissionGuard(
                        'venta.ver'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Productos e inventario
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'products',

                loadComponent: () =>
                    import(
                        './dashboard/products-admin/products-admin'
                    ).then(
                        m =>
                            m.ProductsAdmin
                    ),

                canActivate: [
                    permissionGuard(
                        'producto.ver'
                    )
                ],

                children: [

                    {
                        path: '',

                        loadComponent: () =>
                            import(
                                './dashboard/products-admin/product-list/product-list'
                            ).then(
                                m =>
                                    m.ProductList
                            )
                    },


                    {
                        path:
                            'create',

                        loadComponent: () =>
                            import(
                                './dashboard/products-admin/product-create/product-create'
                            ).then(
                                m =>
                                    m.ProductCreate
                            ),

                        canActivate: [
                            permissionGuard(
                                'producto.crear'
                            )
                        ]
                    },


                    {
                        path:
                            'edit/:id',

                        loadComponent: () =>
                            import(
                                './dashboard/products-admin/product-edit/product-edit'
                            ).then(
                                m =>
                                    m.ProductEdit
                            ),

                        canActivate: [
                            permissionGuard(
                                'producto.editar'
                            )
                        ]
                    },


                    {
                        path:
                            'stock-report',

                        loadComponent: () =>
                            import(
                                './dashboard/products-admin/stock-report/stock-report'
                            ).then(
                                m =>
                                    m.StockReport
                            ),

                        canActivate: [
                            permissionGuard(
                                'reporte_inventario.ver'
                            )
                        ]
                    }

                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Reporte inventario
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'reports/inventory',

                loadComponent: () =>
                    import(
                        './dashboard/reports/inventory-report/inventory-report'
                    ).then(
                        m =>
                            m.InventoryReport
                    ),

                canActivate: [
                    permissionGuard(
                        'reporte_inventario.ver'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Reporte ventas
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'reports/sales',

                loadComponent: () =>
                    import(
                        './dashboard/sales/sales-reports/sales-reports'
                    ).then(
                        m =>
                            m.SalesReports
                    ),

                canActivate: [
                    permissionGuard(
                        'reporte_ventas.ver'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Reporte compras
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'reports/purchases',

                loadComponent: () =>
                    import(
                        './dashboard/reports/purchases-report/purchases-report'
                    ).then(
                        m =>
                            m.PurchasesReport
                    ),

                canActivate: [
                    permissionGuard(
                        'reporte_compras.ver'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Reporte transferencias
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'reports/transfers',

                loadComponent: () =>
                    import(
                        './dashboard/reports/transfers-report/transfers-report'
                    ).then(
                        m =>
                            m.TransfersReport
                    ),

                canActivate: [
                    permissionGuard(
                        'reporte_transferencias.ver'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Centro de reportes
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'reports',

                loadComponent: () =>
                    import(
                        './dashboard/reports/report-center/report-center'
                    ).then(
                        m =>
                            m.ReportCenter
                    ),

                canActivate: [
                    anyPermissionGuard([
                        'reporte_inventario.ver',
                        'reporte_ventas.ver',
                        'reporte_compras.ver',
                        'reporte_transferencias.ver'
                    ])
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Usuarios
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'users',

                loadComponent: () =>
                    import(
                        './dashboard/users/users'
                    ).then(
                        m =>
                            m.Users
                    ),

                canActivate: [
                    permissionGuard(
                        'usuario.ver'
                    )
                ],

                children: [

                    {
                        path: '',

                        loadComponent: () =>
                            import(
                                './dashboard/users/user-list/user-list'
                            ).then(
                                m =>
                                    m.UserList
                            )
                    },


                    {
                        path:
                            'roles',

                        loadComponent: () =>
                            import(
                                './dashboard/users/roles/roles'
                            ).then(
                                m =>
                                    m.Roles
                            ),

                        canActivate: [
                            permissionGuard(
                                'rol.ver'
                            )
                        ]
                    }

                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Empresa
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'empresa',

                loadComponent: () =>
                    import(
                        './dashboard/organization/empresa/empresa'
                    ).then(
                        m =>
                            m.EmpresaAdmin
                    ),

                canActivate: [
                    permissionGuard(
                        'empresa.ver'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Sucursales
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'sucursales',

                loadComponent: () =>
                    import(
                        './dashboard/organization/sucursales/sucursal-list/sucursal-list'
                    ).then(
                        m =>
                            m.SucursalList
                    ),

                canActivate: [
                    permissionGuard(
                        'sucursal.ver'
                    )
                ]
            },


            {
                path:
                    'sucursales/crear',

                loadComponent: () =>
                    import(
                        './dashboard/organization/sucursales/sucursal-form/sucursal-form'
                    ).then(
                        m =>
                            m.SucursalForm
                    ),

                canActivate: [
                    permissionGuard(
                        'sucursal.crear'
                    )
                ]
            },


            {
                path:
                    'sucursales/:id/editar',

                loadComponent: () =>
                    import(
                        './dashboard/organization/sucursales/sucursal-form/sucursal-form'
                    ).then(
                        m =>
                            m.SucursalForm
                    ),

                canActivate: [
                    permissionGuard(
                        'sucursal.editar'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Configuración / perfil
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'settings',

                loadComponent: () =>
                    import(
                        './dashboard/settings/settings'
                    ).then(
                        m =>
                            m.Settings
                    )
            },


            /*
            |--------------------------------------------------------------------------
            | Transferencias
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'transfers/create',

                loadComponent: () =>
                    import(
                        './dashboard/transfers/transfer-create/transfer-create'
                    ).then(
                        m =>
                            m.TransferCreate
                    ),

                canActivate: [
                    permissionGuard(
                        'transferencia.crear'
                    )
                ]
            },


            {
                path:
                    'transfers/:id/edit',

                loadComponent: () =>
                    import(
                        './dashboard/transfers/transfer-create/transfer-create'
                    ).then(
                        m =>
                            m.TransferCreate
                    ),

                canActivate: [
                    permissionGuard(
                        'transferencia.editar'
                    )
                ]
            },


            {
                path:
                    'transfers',

                loadComponent: () =>
                    import(
                        './dashboard/transfers/transfer-list/transfer-list'
                    ).then(
                        m =>
                            m.TransferList
                    ),

                canActivate: [
                    permissionGuard(
                        'transferencia.ver'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Compras
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'purchases/create',

                loadComponent: () =>
                    import(
                        './dashboard/purchases/purchase-create/purchase-create'
                    ).then(
                        m =>
                            m.PurchaseCreate
                    ),

                canActivate: [
                    permissionGuard(
                        'compra.crear'
                    )
                ]
            },


            {
                path:
                    'purchases/:id/edit',

                loadComponent: () =>
                    import(
                        './dashboard/purchases/purchase-create/purchase-create'
                    ).then(
                        m =>
                            m.PurchaseCreate
                    ),

                canActivate: [
                    permissionGuard(
                        'compra.editar'
                    )
                ]
            },


            {
                path:
                    'purchases',

                loadComponent: () =>
                    import(
                        './dashboard/purchases/purchase-list/purchase-list'
                    ).then(
                        m =>
                            m.PurchaseList
                    ),

                canActivate: [
                    permissionGuard(
                        'compra.ver'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Categorías
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'categorias',

                loadComponent: () =>
                    import(
                        './dashboard/products-admin/categories/category-list/category-list'
                    ).then(
                        m =>
                            m.CategoryList
                    ),

                canActivate: [
                    permissionGuard(
                        'categoria.ver'
                    )
                ]
            },


            {
                path:
                    'categorias/crear',

                loadComponent: () =>
                    import(
                        './dashboard/products-admin/categories/category-form/category-form'
                    ).then(
                        m =>
                            m.CategoryForm
                    ),

                canActivate: [
                    permissionGuard(
                        'categoria.crear'
                    )
                ]
            },


            {
                path:
                    'categorias/:id/editar',

                loadComponent: () =>
                    import(
                        './dashboard/products-admin/categories/category-form/category-form'
                    ).then(
                        m =>
                            m.CategoryForm
                    ),

                canActivate: [
                    permissionGuard(
                        'categoria.editar'
                    )
                ]
            },

            /*
|--------------------------------------------------------------------------
| Marcas
|--------------------------------------------------------------------------
*/

            {
                path:
                    'marcas',

                loadComponent: () =>
                    import(
                        './dashboard/products-admin/brands/brand-list/brand-list'
                    ).then(
                        m =>
                            m.BrandList
                    ),

                canActivate: [
                    permissionGuard(
                        'marca.ver'
                    )
                ]
            },


            {
                path:
                    'marcas/crear',

                loadComponent: () =>
                    import(
                        './dashboard/products-admin/brands/brand-form/brand-form'
                    ).then(
                        m =>
                            m.BrandForm
                    ),

                canActivate: [
                    permissionGuard(
                        'marca.crear'
                    )
                ]
            },


            {
                path:
                    'marcas/:id/editar',

                loadComponent: () =>
                    import(
                        './dashboard/products-admin/brands/brand-form/brand-form'
                    ).then(
                        m =>
                            m.BrandForm
                    ),

                canActivate: [
                    permissionGuard(
                        'marca.editar'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Proveedores
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'proveedores',

                loadComponent: () =>
                    import(
                        './dashboard/purchases/providers/provider-list/provider-list'
                    ).then(
                        m =>
                            m.ProviderList
                    ),

                canActivate: [
                    permissionGuard(
                        'proveedor.ver'
                    )
                ]
            },


            {
                path:
                    'proveedores/crear',

                loadComponent: () =>
                    import(
                        './dashboard/purchases/providers/provider-form/provider-form'
                    ).then(
                        m =>
                            m.ProviderForm
                    ),

                canActivate: [
                    permissionGuard(
                        'proveedor.crear'
                    )
                ]
            },


            {
                path:
                    'proveedores/:id/editar',

                loadComponent: () =>
                    import(
                        './dashboard/purchases/providers/provider-form/provider-form'
                    ).then(
                        m =>
                            m.ProviderForm
                    ),

                canActivate: [
                    permissionGuard(
                        'proveedor.editar'
                    )
                ]
            },


            /*
            |--------------------------------------------------------------------------
            | Clientes
            |--------------------------------------------------------------------------
            */

            {
                path:
                    'clientes',

                loadComponent: () =>
                    import(
                        './dashboard/sales/clients/client-list/client-list'
                    ).then(
                        m =>
                            m.ClientList
                    ),

                canActivate: [
                    permissionGuard(
                        'cliente.ver'
                    )
                ]
            },


            {
                path:
                    'clientes/crear',

                loadComponent: () =>
                    import(
                        './dashboard/sales/clients/client-form/client-form'
                    ).then(
                        m =>
                            m.ClientForm
                    ),

                canActivate: [
                    permissionGuard(
                        'cliente.crear'
                    )
                ]
            },


            {
                path:
                    'clientes/:id/editar',

                loadComponent: () =>
                    import(
                        './dashboard/sales/clients/client-form/client-form'
                    ).then(
                        m =>
                            m.ClientForm
                    ),

                canActivate: [
                    permissionGuard(
                        'cliente.editar'
                    )
                ]
            }

        ]
    },


    /*
    |--------------------------------------------------------------------------
    | Ruta desconocida
    |--------------------------------------------------------------------------
    */

    {
        path:
            '**',

        component:
            NotFound
    }

];
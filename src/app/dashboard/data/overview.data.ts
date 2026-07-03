import { DashboardStat, SalesData, GrowthData, ProductData, SellerData } from '../models/dashboard.model';

import { DollarSign, TrendingUp, Package, Users } from 'lucide-angular';

export const CHART_COLORS: string[] = [
    '#2E7D32',
    '#66BB6A',
    '#4FC3F7',
    '#E1F5FE',
    '#1F2937'
];

export const STATS: DashboardStat[] = [
    {
        label: {
            es: 'Ventas del mes',
            en: 'Monthly Sales'
        },
        value: 'Bs. 67,000',
        change: '+12%',
        icon: DollarSign,
        color: 'bg-green-500'
    },
    {
        label: {
            es: 'Ingresos totales',
            en: 'Total Revenue'
        },
        value: 'Bs. 328,000',
        change: '+8%',
        icon: TrendingUp,
        color: 'bg-blue-500'
    },
    {
        label: {
            es: 'Productos vendidos',
            en: 'Products Sold'
        },
        value: '234',
        change: '+15%',
        icon: Package,
        color: 'bg-purple-500'
    },
    {
        label: {
            es: 'Clientes activos',
            en: 'Active Customers'
        },
        value: '89',
        change: '+5%',
        icon: Users,
        color: 'bg-orange-500'
    }
];

export const SALES_DATA: SalesData[] = [
    { month: 'Ene', sales: 45000 },
    { month: 'Feb', sales: 52000 },
    { month: 'Mar', sales: 48000 },
    { month: 'Abr', sales: 61000 },
    { month: 'May', sales: 55000 },
    { month: 'Jun', sales: 67000 }
];

export const GROWTH_DATA: GrowthData[] = [
    { month: 'Ene', growth: 12 },
    { month: 'Feb', growth: 15 },
    { month: 'Mar', growth: 11 },
    { month: 'Abr', growth: 18 },
    { month: 'May', growth: 14 },
    { month: 'Jun', growth: 20 }
];

export const PRODUCT_DATA: ProductData[] = [
    { name: 'Riego por goteo', value: 35 },
    { name: 'Aspersores', value: 25 },
    { name: 'Controladores', value: 20 },
    { name: 'Filtros', value: 12 },
    { name: 'Otros', value: 8 }
];

export const SELLERS_DATA: SellerData[] = [
    {
        seller: 'Juan Pérez',
        sales: 45,
        products: 78,
        total: 'Bs. 85,400'
    },
    {
        seller: 'María González',
        sales: 38,
        products: 62,
        total: 'Bs. 72,300'
    },
    {
        seller: 'Carlos Mamani',
        sales: 32,
        products: 54,
        total: 'Bs. 61,200'
    }
];
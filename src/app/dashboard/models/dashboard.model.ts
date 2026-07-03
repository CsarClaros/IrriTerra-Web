import { LucideIconData } from 'lucide-angular';

export interface DashboardStat {
    label: {
        es: string;
        en: string;
    };

    value: string;
    change: string;

    icon: LucideIconData;

    color: string;
}

export interface SalesData {
    month: string;
    sales: number;
}

export interface GrowthData {
    month: string;
    growth: number;
}

export interface ProductData {
    name: string;
    value: number;
}

export interface SellerData {
    seller: string;
    sales: number;
    products: number;
    total: string;
}
export interface ProductTranslation {
    es: string;
    en: string;
}

export interface Product {

    id: number;

    name: ProductTranslation;

    description: ProductTranslation;

    category: string;

    image: string;

    inStock: boolean;

    stock: ProductTranslation;

}

export interface ProductCategory {

    id: string;

    es: string;

    en: string;

}
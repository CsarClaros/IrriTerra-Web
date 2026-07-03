import { Product, ProductCategory } from '../../shared/models/product.model';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
    { id: 'all', es: 'Todos', en: 'All' },
    { id: 'drip', es: 'Riego por goteo', en: 'Drip Irrigation' },
    { id: 'sprinklers', es: 'Aspersores', en: 'Sprinklers' },
    { id: 'filters', es: 'Filtros', en: 'Filters' },
    { id: 'controllers', es: 'Controladores', en: 'Controllers' },
    { id: 'valves', es: 'Válvulas', en: 'Valves' },
    { id: 'sensors', es: 'Sensores', en: 'Sensors' },
    { id: 'accessories', es: 'Accesorios', en: 'Accessories' }
];

export const PRODUCTS: Product[] = [

    {
        id: 1,
        category: 'drip',
        name: {
            es: 'Sistema Goteo Premium',
            en: 'Premium Drip System'
        },
        description: {
            es: 'Sistema de riego por goteo de alta eficiencia',
            en: 'High efficiency drip irrigation system'
        },
        image: 'https://images.unsplash.com/photo-1738598665698-7fd7af4b5e0c?w=600',
        stock: {
            es: 'En stock',
            en: 'In stock'
        },
        inStock: true
    },

    {
        id: 2,
        category: 'sprinklers',
        name: {
            es: 'Aspersor Giratorio 360°',
            en: '360° Rotating Sprinkler'
        },
        description: {
            es: 'Cobertura completa para áreas grandes',
            en: 'Full coverage for large areas'
        },
        image: 'https://images.unsplash.com/photo-1771684512143-88bdb34782fa?w=600',
        stock: {
            es: 'En stock',
            en: 'In stock'
        },
        inStock: true
    },

    {
        id: 3,
        category: 'filters',
        name: {
            es: 'Filtro de Disco Industrial',
            en: 'Industrial Disc Filter'
        },
        description: {
            es: 'Filtración eficiente para sistemas de riego',
            en: 'Efficient filtration for irrigation systems'
        },
        image: 'https://images.unsplash.com/photo-1616996691029-96500d6523b7?w=600',
        stock: {
            es: 'En stock',
            en: 'In stock'
        },
        inStock: true
    },

    {
        id: 4,
        category: 'controllers',
        name: {
            es: 'Controlador Smart WiFi',
            en: 'Smart WiFi Controller'
        },
        description: {
            es: 'Control inteligente desde tu smartphone',
            en: 'Smart control from your smartphone'
        },
        image: 'https://images.unsplash.com/photo-1698848065415-ad8e2f269fa8?w=600',
        stock: {
            es: 'Pocas unidades',
            en: 'Limited stock'
        },
        inStock: true
    },

    {
        id: 5,
        category: 'valves',
        name: {
            es: 'Válvula Solenoide 24V',
            en: '24V Solenoid Valve'
        },
        description: {
            es: 'Válvula automática de alta durabilidad',
            en: 'High durability automatic valve'
        },
        image: 'https://images.unsplash.com/photo-1774019883037-91f5d43e2890?w=600',
        stock: {
            es: 'En stock',
            en: 'In stock'
        },
        inStock: true
    },

    {
        id: 6,
        category: 'sensors',
        name: {
            es: 'Sensor de Humedad del Suelo',
            en: 'Soil Moisture Sensor'
        },
        description: {
            es: 'Monitoreo preciso de humedad',
            en: 'Precise humidity monitoring'
        },
        image: 'https://images.unsplash.com/photo-1738598665806-7ecc32c3594c?w=600',
        stock: {
            es: 'En stock',
            en: 'In stock'
        },
        inStock: true
    }

];
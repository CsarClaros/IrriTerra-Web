// branches.data.ts
export interface Branch {
    id: string;
    name: string;
    lat: number;
    lng: number;
    address: string;
    phone: string;
    mapEmbed: string;
}

export const BRANCHES: Branch[] = [
    {
        id: 'lapaz',
        name: 'Casa Matriz - El Alto',
        lat: -16.5,
        lng: -68.119,
        address: 'Kenko Av. Argelia calle Mamore, El Alto, La Paz',
        phone: '71289640 / 71949444',
        mapEmbed:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30602.36728!2d-68.119!3d-16.5!2m3!1f0!2f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTbCsDMwJzAwLjAiUyA2OMKwMDcnMTIuNCJX!5e0!3m2!1sen!2sbo!4v1234567890',
    },
    {
        id: 'santacruz',
        name: 'Sucursal Santa Cruz',
        lat: -17.783,
        lng: -63.182,
        address: 'Calle Comercio 456, Santa Cruz',
        phone: '+591 3 345 6789',
        mapEmbed:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30602.36728!2d-63.182!3d-17.783!2m3!1f0!2f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDQ2JzU4LjgiUyA2M8KwMTAnNTUuMiJX!5e0!3m2!1sen!2sbo!4v1234567890',
    },
    {
        id: 'cochabamba',
        name: 'Sucursal Cochabamba',
        lat: -17.393,
        lng: -66.157,
        address: 'Av. América 789, Cochabamba',
        phone: '+591 4 456 7890',
        mapEmbed:
            'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30602.36728!2d-66.157!3d-17.393!2m3!1f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDIzJzM0LjgiUyA2NsKwMDknMjUuMiJX!5e0!3m2!1sen!2sbo!4v1234567890',
    },
];
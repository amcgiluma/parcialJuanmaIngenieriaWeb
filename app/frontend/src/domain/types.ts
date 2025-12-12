/**
 * Representa un usuario autenticado.
 */
export interface User {
    email: string;
    name: string;
    picture: string;
    _id?: string;
}

/**
 * Representa un marcador en el mapa (legacy).
 */
export interface Marker {
    _id?: string;
    user_email: string;
    location_name: string;
    latitude: number;
    longitude: number;
    image_url: string;
}

/**
 * Representa una visita social (legacy).
 */
export interface Visit {
    _id?: string;
    visitor_email: string;
    visited_email: string;
    visitor_token: string;
    timestamp: string;
}

/**
 * Representa una reseña de un establecimiento.
 */
export interface Review {
    _id?: string;
    establishment_name: string;
    address: string;
    latitude: number;
    longitude: number;
    rating: number;
    images: string[];
    user_email: string;
    user_name: string;
    token_used: string;
    created_at: string;
    token_expires_at: string;
}


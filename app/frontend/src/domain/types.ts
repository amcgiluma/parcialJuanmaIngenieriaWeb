export interface User {
    email: string;
    name: string;
    picture: string;
    _id?: string;
}

export interface Marker {
    _id?: string;
    user_email: string;
    location_name: string;
    latitude: number;
    longitude: number;
    image_url: string;
}

export interface Visit {
    _id?: string;
    visitor_email: string;
    visited_email: string;
    visitor_token: string;
    timestamp: string;
}

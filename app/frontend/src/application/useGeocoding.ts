import { useState, useCallback } from 'react';
import api from '../infrastructure/api/axiosConfig';

export interface LocationSuggestion {
    display_name: string;
    lat: number;
    lon: number;
    type: string;
    class: string;
}

export const useGeocoding = () => {
    const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
    const [loading, setLoading] = useState(false);

    const searchLocations = useCallback(async (query: string) => {
        if (!query || query.length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await api.get<LocationSuggestion[]>('/geocoding/autocomplete', {
                params: { q: query, limit: 5 }
            });
            setSuggestions(response.data);
        } catch (err) {
            console.error('Error buscando ubicaciones', err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSuggestions = useCallback(() => {
        setSuggestions([]);
    }, []);

    return {
        suggestions,
        loading,
        searchLocations,
        clearSuggestions
    };
};

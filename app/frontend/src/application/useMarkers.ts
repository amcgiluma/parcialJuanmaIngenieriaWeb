import { useState, useCallback } from 'react';
import api from '../infrastructure/api/axiosConfig';
import { Marker } from '../domain/types';

export const useMarkers = () => {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMyMarkers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<Marker[]>('/maps/markers');
            setMarkers(response.data);
            setError(null);
        } catch (err) {
            setError('Error cargando marcadores');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserMarkers = useCallback(async (email: string) => {
        setLoading(true);
        try {
            const response = await api.get<Marker[]>(`/maps/markers/${email}`);
            setMarkers(response.data);
            setError(null);
        } catch (err) {
            setError('Error cargando marcadores del usuario');
            console.error(err);
            setMarkers([]); // Limpiar mapa si falla
        } finally {
            setLoading(false);
        }
    }, []);

    const addMarker = useCallback(async (locationName: string, imageFile: File) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('location_name', locationName);
            formData.append('image', imageFile);

            const response = await api.post<Marker>('/maps/markers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMarkers(prev => [...prev, response.data]);
            setError(null);
            return response.data;
        } catch (err) {
            setError('Error creando marcador');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        markers,
        loading,
        error,
        fetchMyMarkers,
        fetchUserMarkers,
        addMarker
    };
};

import { useState, useCallback } from 'react';
import api from '../infrastructure/api/axiosConfig';
import { Visit } from '../domain/types';

export const useVisits = () => {
    const [visits, setVisits] = useState<Visit[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchVisits = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get<Visit[]>('/social/visits');
            setVisits(response.data);
        } catch (err) {
            console.error('Error cargando visitas', err);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        visits,
        loading,
        fetchVisits
    };
};

/**
 * Hook personalizado para gestión de reseñas.
 * Proporciona operaciones CRUD y estado de carga/error.
 */
import { useState, useCallback } from 'react';
import api from '../infrastructure/api/axiosConfig';
import { Review } from '../domain/types';

/**
 * Datos necesarios para crear una reseña.
 */
interface CreateReviewData {
    establishment_name: string;
    address: string;
    rating: number;
    images?: File[];
}

/**
 * Hook para operaciones CRUD de reseñas.
 * 
 * @returns Objeto con reviews, funciones CRUD y estado de carga
 */
export const useReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Obtiene todas las reseñas de la base de datos.
     */
    const fetchAllReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<Review[]>('/reviews/');
            setReviews(response.data);
        } catch (err) {
            setError('Error cargando reseñas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene las reseñas del usuario actual.
     */
    const fetchMyReviews = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<Review[]>('/reviews/mine');
            setReviews(response.data);
        } catch (err) {
            setError('Error cargando tus reseñas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene el detalle de una reseña específica.
     * 
     * @param reviewId - ID de la reseña
     */
    const getReviewById = useCallback(async (reviewId: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<Review>(`/reviews/${reviewId}`);
            setSelectedReview(response.data);
            return response.data;
        } catch (err) {
            setError('Error cargando detalle de reseña');
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Crea una nueva reseña.
     * 
     * @param data - Datos de la reseña a crear
     * @returns La reseña creada o null si hay error
     */
    const createReview = useCallback(async (data: CreateReviewData) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('establishment_name', data.establishment_name);
            formData.append('address', data.address);
            formData.append('rating', data.rating.toString());

            // Agregar imágenes si existen
            if (data.images) {
                data.images.forEach((image) => {
                    formData.append('images', image);
                });
            }

            const response = await api.post<Review>('/reviews/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setReviews(prev => [...prev, response.data]);
            return response.data;
        } catch (err) {
            setError('Error creando reseña');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Actualiza una reseña existente.
     * 
     * @param reviewId - ID de la reseña a actualizar
     * @param data - Datos a actualizar
     */
    const updateReview = useCallback(async (reviewId: string, data: Partial<CreateReviewData>) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            if (data.establishment_name) formData.append('establishment_name', data.establishment_name);
            if (data.address) formData.append('address', data.address);
            if (data.rating !== undefined) formData.append('rating', data.rating.toString());

            const response = await api.put<Review>(`/reviews/${reviewId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setReviews(prev => prev.map(r => r._id === reviewId ? response.data : r));
            return response.data;
        } catch (err) {
            setError('Error actualizando reseña');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Elimina una reseña.
     * 
     * @param reviewId - ID de la reseña a eliminar
     */
    const deleteReview = useCallback(async (reviewId: string) => {
        setLoading(true);
        setError(null);
        try {
            await api.delete(`/reviews/${reviewId}`);
            setReviews(prev => prev.filter(r => r._id !== reviewId));
            return true;
        } catch (err) {
            setError('Error eliminando reseña');
            console.error(err);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        reviews,
        selectedReview,
        loading,
        error,
        fetchAllReviews,
        fetchMyReviews,
        getReviewById,
        createReview,
        updateReview,
        deleteReview,
        setSelectedReview
    };
};

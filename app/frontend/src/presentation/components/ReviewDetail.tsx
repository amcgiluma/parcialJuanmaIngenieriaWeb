/**
 * Modal de detalle de reseña.
 * Muestra información completa incluyendo autor, token y timestamps.
 */
import React from 'react';
import { X, MapPin, User, Clock, Key } from 'lucide-react';
import { Review } from '../../domain/types';
import StarRating from './StarRating';

interface ReviewDetailProps {
    /** Reseña a mostrar */
    review: Review;
    /** Callback para cerrar el modal */
    onClose: () => void;
}

/**
 * Modal que muestra todos los detalles de una reseña.
 * 
 * @param props - Propiedades del componente
 * @returns Componente JSX del modal
 */
const ReviewDetail: React.FC<ReviewDetailProps> = ({ review, onClose }) => {
    /**
     * Formatea una fecha ISO a formato legible en hora española.
     * 
     * @param dateString - Fecha en formato ISO (UTC)
     * @returns Fecha formateada en hora española
     */
    const formatDate = (dateString: string): string => {
        // Añadir 'Z' si no tiene timezone para indicar que es UTC
        const utcDate = dateString.endsWith('Z') ? dateString : dateString + 'Z';
        return new Date(utcDate).toLocaleString('es-ES', {
            dateStyle: 'medium',
            timeStyle: 'short',
            timeZone: 'Europe/Madrid'
        });
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999]"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-detail-title"
        >
            <div
                className="card-neo bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b-2 border-neo-black">
                    <h2
                        id="review-detail-title"
                        className="text-2xl font-bold font-mono pr-8"
                    >
                        {review.establishment_name}
                    </h2>
                    <button
                        onClick={onClose}
                        className="btn-neo bg-neo-pink p-2"
                        aria-label="Cerrar detalle"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Galería de imágenes */}
                {review.images && review.images.length > 0 && (
                    <div className="p-4 border-b-2 border-neo-black">
                        <h3 className="font-bold mb-2">Imágenes</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {review.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Imagen ${index + 1} de ${review.establishment_name}`}
                                    className="w-full h-32 object-cover border-2 border-neo-black"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Información del establecimiento */}
                <div className="p-4 border-b-2 border-neo-black">
                    <h3 className="font-bold mb-3">Información del Establecimiento</h3>

                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <MapPin size={18} className="mt-1 flex-shrink-0 text-neo-cyan" />
                            <div>
                                <p className="font-medium">Dirección</p>
                                <p className="text-gray-600">{review.address}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium">Coordenadas GPS:</span>
                            <span className="font-mono text-sm bg-gray-100 px-2 py-1 border border-gray-300">
                                {review.latitude.toFixed(6)}, {review.longitude.toFixed(6)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium">Valoración:</span>
                            <StarRating rating={review.rating} size={20} />
                            <span className="font-bold">({review.rating}/5)</span>
                        </div>
                    </div>
                </div>

                {/* Información del autor */}
                <div className="p-4 border-b-2 border-neo-black bg-neo-lime/10">
                    <h3 className="font-bold mb-3">Información del Autor</h3>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-neo-pink" />
                            <span className="font-medium">E-mail:</span>
                            <span>{review.user_email}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <User size={18} className="text-neo-pink" />
                            <span className="font-medium">Nombre:</span>
                            <span>{review.user_name}</span>
                        </div>
                    </div>
                </div>

                {/* Información del token y timestamps */}
                <div className="p-4 bg-gray-50">
                    <h3 className="font-bold mb-3">Información de Autenticación</h3>

                    <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                            <Key size={16} className="mt-1 flex-shrink-0 text-gray-400" />
                            <div className="overflow-hidden">
                                <p className="font-medium">Token OAuth</p>
                                <p className="font-mono text-xs text-gray-500 truncate" title={review.token_used}>
                                    {review.token_used.substring(0, 50)}...
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-400" />
                            <span className="font-medium">Fecha de creación:</span>
                            <span>{formatDate(review.created_at)}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-400" />
                            <span className="font-medium">Caducidad del token:</span>
                            <span>{formatDate(review.token_expires_at)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewDetail;

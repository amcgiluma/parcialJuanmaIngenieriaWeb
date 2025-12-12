/**
 * Tarjeta de reseña.
 * Muestra información resumida de una reseña.
 */
import React from 'react';
import { MapPin, Eye } from 'lucide-react';
import { Review } from '../../domain/types';
import StarRating from './StarRating';

interface ReviewCardProps {
    /** Datos de la reseña */
    review: Review;
    /** Callback cuando se hace clic en "Ver detalles" */
    onViewDetails: (review: Review) => void;
}

/**
 * Tarjeta que muestra el resumen de una reseña.
 * Incluye nombre, dirección, coordenadas, valoración y botón de detalles.
 * 
 * @param props - Propiedades del componente
 * @returns Componente JSX de tarjeta
 */
const ReviewCard: React.FC<ReviewCardProps> = ({ review, onViewDetails }) => {
    return (
        <article
            className="card-neo bg-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            aria-labelledby={`review-title-${review._id}`}
        >
            {/* Imagen principal (si existe) */}
            {review.images && review.images.length > 0 && (
                <div className="w-full h-32 overflow-hidden border-b-2 border-neo-black">
                    <img
                        src={review.images[0]}
                        alt={`Foto de ${review.establishment_name}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            <div className="p-4">
                {/* Nombre del establecimiento */}
                <h3
                    id={`review-title-${review._id}`}
                    className="text-lg font-bold font-mono mb-2 truncate"
                    title={review.establishment_name}
                >
                    {review.establishment_name}
                </h3>

                {/* Dirección */}
                <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{review.address}</span>
                </div>

                {/* Coordenadas GPS */}
                <p className="text-xs text-gray-400 font-mono mb-3">
                    GPS: {review.latitude.toFixed(6)}, {review.longitude.toFixed(6)}
                </p>

                {/* Valoración */}
                <div className="flex items-center justify-between mb-4">
                    <StarRating rating={review.rating} size={18} />
                    <span className="text-sm font-bold text-neo-black">
                        {review.rating}/5
                    </span>
                </div>

                {/* Botón ver detalles */}
                <button
                    onClick={() => onViewDetails(review)}
                    className="btn-neo bg-neo-cyan w-full flex items-center justify-center gap-2"
                    aria-label={`Ver detalles de ${review.establishment_name}`}
                >
                    <Eye size={18} />
                    Ver detalles
                </button>
            </div>
        </article>
    );
};

export default ReviewCard;

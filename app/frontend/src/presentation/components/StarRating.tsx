/**
 * Componente de valoración con estrellas.
 * Puede usarse en modo lectura o edición.
 */
import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
    /** Valor actual de la valoración (0-5) */
    rating: number;
    /** Si es true, permite cambiar la valoración */
    editable?: boolean;
    /** Callback cuando cambia la valoración (solo si editable=true) */
    onChange?: (rating: number) => void;
    /** Tamaño de las estrellas en píxeles */
    size?: number;
}

/**
 * Muestra una valoración de 0-5 estrellas.
 * En modo editable, permite hacer clic para seleccionar.
 * 
 * @param props - Propiedades del componente
 * @returns Componente JSX con estrellas
 */
const StarRating: React.FC<StarRatingProps> = ({
    rating,
    editable = false,
    onChange,
    size = 20
}) => {
    /**
     * Maneja el clic en una estrella.
     * 
     * @param index - Índice de la estrella (1-5)
     */
    const handleClick = (index: number) => {
        if (editable && onChange) {
            onChange(index);
        }
    };

    return (
        <div
            className="flex gap-1"
            role="group"
            aria-label={`Valoración: ${rating} de 5 estrellas`}
        >
            {[1, 2, 3, 4, 5].map((index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => handleClick(index)}
                    disabled={!editable}
                    className={`
                        ${editable ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
                        transition-transform
                        focus:outline-none focus:ring-2 focus:ring-neo-cyan
                    `}
                    aria-label={`${index} estrellas`}
                >
                    <Star
                        size={size}
                        className={`
                            ${index <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-none text-gray-300'
                            }
                            ${editable ? 'hover:text-yellow-400' : ''}
                        `}
                    />
                </button>
            ))}
        </div>
    );
};

export default StarRating;

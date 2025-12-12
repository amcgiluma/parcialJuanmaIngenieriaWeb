/**
 * Formulario para crear una nueva reseña.
 */
import React, { useState } from 'react';
import { Plus, Upload, MapPin } from 'lucide-react';
import LocationAutocomplete from './LocationAutocomplete';
import StarRating from './StarRating';
import { LocationSuggestion } from '../../application/useGeocoding';

interface ReviewFormProps {
    /** Callback cuando se envía el formulario */
    onSubmit: (data: {
        establishment_name: string;
        address: string;
        rating: number;
        images: File[];
    }) => Promise<void>;
    /** Estado de carga */
    loading?: boolean;
}

/**
 * Formulario para crear una reseña con todos los campos requeridos.
 * 
 * @param props - Propiedades del componente
 * @returns Componente JSX del formulario
 */
const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, loading = false }) => {
    const [establishmentName, setEstablishmentName] = useState('');
    const [address, setAddress] = useState('');
    const [rating, setRating] = useState(0);
    const [images, setImages] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    /**
     * Maneja la selección de ubicación del autocompletado.
     * 
     * @param suggestion - Sugerencia seleccionada
     */
    const handleLocationSelect = (suggestion: LocationSuggestion) => {
        setAddress(suggestion.display_name);
    };

    /**
     * Maneja la selección de imágenes.
     * 
     * @param e - Evento del input file
     */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setImages(prev => [...prev, ...newFiles]);

            // Crear previews
            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => [...prev, reader.result as string]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    /**
     * Elimina una imagen de la lista.
     * 
     * @param index - Índice de la imagen a eliminar
     */
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    /**
     * Envía el formulario.
     * 
     * @param e - Evento del formulario
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!establishmentName || !address || rating === 0) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }

        await onSubmit({
            establishment_name: establishmentName,
            address,
            rating,
            images
        });

        // Limpiar formulario
        setEstablishmentName('');
        setAddress('');
        setRating(0);
        setImages([]);
        setPreviews([]);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre del establecimiento */}
            <div>
                <label
                    htmlFor="establishment_name"
                    className="block font-bold mb-1"
                >
                    Nombre del Establecimiento *
                </label>
                <input
                    id="establishment_name"
                    type="text"
                    value={establishmentName}
                    onChange={(e) => setEstablishmentName(e.target.value)}
                    placeholder="Ej. Casa Lola"
                    className="input-neo"
                    required
                    aria-required="true"
                />
            </div>

            {/* Dirección con autocompletado */}
            <div>
                <label
                    htmlFor="address"
                    className="block font-bold mb-1"
                >
                    <MapPin size={16} className="inline mr-1" />
                    Dirección Postal *
                </label>
                <LocationAutocomplete
                    value={address}
                    onChange={setAddress}
                    onSelect={handleLocationSelect}
                />
            </div>

            {/* Valoración */}
            <div>
                <label className="block font-bold mb-2">
                    Valoración *
                </label>
                <div className="flex items-center gap-4">
                    <StarRating
                        rating={rating}
                        editable
                        onChange={setRating}
                        size={28}
                    />
                    <span className="text-lg font-mono">
                        {rating > 0 ? `${rating}/5` : 'Sin valorar'}
                    </span>
                </div>
            </div>

            {/* Subida de imágenes */}
            <div>
                <label className="block font-bold mb-2">
                    <Upload size={16} className="inline mr-1" />
                    Imágenes (opcional)
                </label>
                <div className="border-2 border-neo-black bg-white p-3">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full"
                        aria-describedby="images-help"
                    />
                    <p id="images-help" className="text-xs text-gray-500 mt-1">
                        Puedes subir varias imágenes del establecimiento
                    </p>
                </div>

                {/* Previews de imágenes */}
                {previews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {previews.map((preview, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-20 object-cover border-2 border-neo-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute -top-2 -right-2 bg-neo-pink text-white rounded-full w-5 h-5 text-xs font-bold border border-black"
                                    aria-label={`Eliminar imagen ${index + 1}`}
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Botón submit */}
            <button
                type="submit"
                disabled={loading || !establishmentName || !address || rating === 0}
                className="btn-neo bg-neo-lime w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Plus size={20} />
                {loading ? 'Creando...' : 'Crear Reseña'}
            </button>
        </form>
    );
};

export default ReviewForm;

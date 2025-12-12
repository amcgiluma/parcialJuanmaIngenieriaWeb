/**
 * Dashboard principal de ReViews.
 * Muestra lista de reseñas, mapa y formulario de creación.
 */
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LogOut, Plus, Search, List, Map as MapIcon } from 'lucide-react';
import { useReviews } from '../../application/useReviews';
import { useAuth } from '../context/AuthContext';
import { Review } from '../../domain/types';
import ReviewCard from '../components/ReviewCard';
import ReviewDetail from '../components/ReviewDetail';
import ReviewForm from '../components/ReviewForm';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { LocationSuggestion } from '../../application/useGeocoding';
import 'leaflet/dist/leaflet.css';

// Fix para iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Componente para centrar el mapa en una ubicación.
 */
const MapController: React.FC<{ center: [number, number] | null }> = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, 13);
        }
    }, [center, map]);

    return null;
};

/**
 * Dashboard principal con lista de reseñas, mapa y formulario.
 * 
 * @returns Componente JSX del dashboard
 */
const Dashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const {
        reviews,
        loading,
        fetchAllReviews,
        createReview,
        selectedReview,
        setSelectedReview
    } = useReviews();

    const [showForm, setShowForm] = useState(false);
    const [searchAddress, setSearchAddress] = useState('');
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

    // Cargar reseñas al montar
    useEffect(() => {
        fetchAllReviews();
    }, [fetchAllReviews]);

    /**
     * Maneja la búsqueda de ubicación.
     */
    const handleSearch = (suggestion: LocationSuggestion) => {
        setSearchAddress(suggestion.display_name);
        setMapCenter([suggestion.lat, suggestion.lon]);
        setActiveTab('map');
    };

    /**
     * Maneja la creación de una nueva reseña.
     */
    const handleCreateReview = async (data: {
        establishment_name: string;
        address: string;
        rating: number;
        images: File[];
    }) => {
        await createReview(data);
        setShowForm(false);
        fetchAllReviews();
    };

    /**
     * Muestra el detalle de una reseña.
     */
    const handleViewDetails = (review: Review) => {
        setSelectedReview(review);
    };

    // Centro por defecto (Madrid, España)
    const defaultCenter: [number, number] = [40.4168, -3.7038];

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <header className="flex flex-wrap justify-between items-center mb-6 bg-white border-2 border-neo-black p-4 shadow-hard gap-4">
                <div>
                    <h1 className="text-2xl font-bold font-mono">ReViews</h1>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn-neo bg-neo-lime flex items-center gap-2"
                        aria-expanded={showForm}
                    >
                        <Plus size={18} /> Nueva Reseña
                    </button>
                    <button
                        onClick={logout}
                        className="btn-neo bg-neo-pink flex items-center gap-2"
                    >
                        <LogOut size={18} /> Salir
                    </button>
                </div>
            </header>

            {/* Formulario de nueva reseña (toggle) */}
            {showForm && (
                <div className="card-neo bg-neo-lime/20 mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Plus size={24} /> Crear Nueva Reseña
                    </h2>
                    <ReviewForm onSubmit={handleCreateReview} loading={loading} />
                </div>
            )}

            {/* Barra de búsqueda */}
            <div className="card-neo bg-neo-cyan/20 mb-6">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Search size={20} /> Buscar ubicación en el mapa
                </h3>
                <div className="flex gap-2">
                    <div className="flex-1">
                        <LocationAutocomplete
                            value={searchAddress}
                            onChange={setSearchAddress}
                            onSelect={handleSearch}
                        />
                    </div>
                </div>
            </div>

            {/* Tabs para móvil */}
            <div className="flex gap-2 mb-4 md:hidden">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`btn-neo flex-1 flex items-center justify-center gap-2 ${activeTab === 'list' ? 'bg-neo-black text-white' : 'bg-white'}`}
                >
                    <List size={18} /> Lista
                </button>
                <button
                    onClick={() => setActiveTab('map')}
                    className={`btn-neo flex-1 flex items-center justify-center gap-2 ${activeTab === 'map' ? 'bg-neo-black text-white' : 'bg-white'}`}
                >
                    <MapIcon size={18} /> Mapa
                </button>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lista de reseñas */}
                <div className={`${activeTab === 'list' ? 'block' : 'hidden'} md:block`}>
                    <h2 className="text-xl font-bold mb-4 border-b-4 border-neo-lime inline-block">
                        Reseñas ({reviews.length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">Cargando reseñas...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="card-neo bg-gray-50 text-center py-8">
                            <p className="text-gray-500 mb-4">No hay reseñas todavía</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="btn-neo bg-neo-lime"
                            >
                                Crear la primera reseña
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                            {reviews.map((review) => (
                                <ReviewCard
                                    key={review._id}
                                    review={review}
                                    onViewDetails={handleViewDetails}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Mapa */}
                <div className={`${activeTab === 'map' ? 'block' : 'hidden'} md:block`}>
                    <h2 className="text-xl font-bold mb-4 border-b-4 border-neo-cyan inline-block">
                        Mapa de Reseñas
                    </h2>
                    <div className="border-2 border-neo-black shadow-hard h-[500px]">
                        <MapContainer
                            center={mapCenter || defaultCenter}
                            zoom={5}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapController center={mapCenter} />

                            {reviews.map((review) => (
                                <Marker
                                    key={review._id}
                                    position={[review.latitude, review.longitude]}
                                >
                                    <Popup>
                                        <div className="text-center">
                                            <strong className="block">{review.establishment_name}</strong>
                                            <span className="text-sm text-gray-600">{review.address}</span>
                                            <div className="mt-1">
                                                {'⭐'.repeat(review.rating)}
                                            </div>
                                            {review.images && review.images[0] && (
                                                <img
                                                    src={review.images[0]}
                                                    alt={review.establishment_name}
                                                    className="w-full h-20 object-cover mt-2"
                                                />
                                            )}
                                            <button
                                                onClick={() => handleViewDetails(review)}
                                                className="mt-2 text-sm text-blue-600 underline"
                                            >
                                                Ver detalles
                                            </button>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>
            </div>

            {/* Modal de detalle */}
            {selectedReview && (
                <ReviewDetail
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                />
            )}
        </div>
    );
};

export default Dashboard;

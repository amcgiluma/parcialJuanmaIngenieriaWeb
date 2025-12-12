import React, { useEffect, useState } from 'react';
import Map from '../components/Map';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { useMarkers } from '../../application/useMarkers';
import { useVisits } from '../../application/useVisits';
import { useAuth } from '../context/AuthContext';
import { LocationSuggestion } from '../../application/useGeocoding';
import { LogOut, MapPin, Search, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { logout, user } = useAuth();
    const { markers, fetchMyMarkers, fetchUserMarkers, addMarker } = useMarkers();
    const { visits, fetchVisits } = useVisits();

    const [locationName, setLocationName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [searchEmail, setSearchEmail] = useState('');
    const [viewingUser, setViewingUser] = useState<string | null>(null);

    useEffect(() => {
        fetchMyMarkers();
        fetchVisits();
    }, [fetchMyMarkers, fetchVisits]);

    const handleLocationSelect = (suggestion: LocationSuggestion) => {
        // When user selects from autocomplete, use full display name
        setLocationName(suggestion.display_name);
    };

    const handleAddMarker = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!locationName || !file) return;
        await addMarker(locationName, file);
        setLocationName('');
        setFile(null);
        // Reset input file manually if needed
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchEmail) {
            setViewingUser(searchEmail);
            fetchUserMarkers(searchEmail);
        }
    };

    const handleBackToMyMap = () => {
        setViewingUser(null);
        setSearchEmail('');
        fetchMyMarkers();
    };

    return (
        <div className="min-h-screen p-4 md:p-8">
            {/* Header */}
            <header className="flex justify-between items-center mb-8 bg-white border-2 border-neo-black p-4 shadow-hard">
                <div>
                    <h1 className="text-2xl font-bold font-mono">MiMapa</h1>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <button onClick={logout} className="btn-neo bg-neo-pink text-white flex items-center gap-2">
                    <LogOut size={18} /> Salir
                </button>
            </header>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left/Top: Map (Takes 2 columns on large) */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold border-b-4 border-neo-cyan inline-block">
                            {viewingUser ? `Mapa de ${viewingUser}` : 'Mi Mundo'}
                        </h2>
                        {viewingUser && (
                            <button onClick={handleBackToMyMap} className="text-sm underline font-bold bg-yellow-200 px-2 border border-black">
                                Volver a mi mapa
                            </button>
                        )}
                    </div>

                    <Map markers={markers} />
                </div>

                {/* Right: Controls */}
                <div className="space-y-8">

                    {/* Search User */}
                    <div className="card-neo bg-neo-cyan/20">
                        <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                            <Search size={24} /> Visitar Usuario
                        </h3>
                        <form onSubmit={handleSearch} className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="usuario@ejemplo.com"
                                className="input-neo"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                            />
                            <button type="submit" className="btn-neo bg-white">
                                Ver Mapa
                            </button>
                        </form>
                    </div>

                    {/* Add Marker (Only if not viewing others) */}
                    {!viewingUser && (
                        <div className="card-neo bg-neo-lime/20">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <MapPin size={24} /> Añadir destino
                            </h3>
                            <form onSubmit={handleAddMarker} className="flex flex-col gap-4">
                                <LocationAutocomplete
                                    value={locationName}
                                    onChange={setLocationName}
                                    onSelect={handleLocationSelect}
                                />
                                <div className="border-2 border-neo-black bg-white p-2 relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                                        className="w-full"
                                    />
                                </div>
                                <button type="submit" className="btn-neo bg-neo-black text-white hover:bg-gray-800 disabled:opacity-50" disabled={!locationName || !file}>
                                    Atrincherar Marcador
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Visits Log */}
                    {!viewingUser && (
                        <div className="card-neo bg-neo-pink/20">
                            <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                                <Users size={24} /> Visitas Recientes
                            </h3>
                            <div className="max-h-60 overflow-y-auto border-2 border-neo-black bg-white">
                                {visits.length === 0 ? (
                                    <p className="p-4 text-center text-gray-500">Nadie te ha visitado aún :(</p>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="bg-neo-black text-white">
                                            <tr>
                                                <th className="p-2 text-left">Visitante</th>
                                                <th className="p-2 text-right">Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {visits.map((visit, idx) => (
                                                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                                                    <td className="p-2 font-bold truncate max-w-[150px]" title={visit.visitor_email}>
                                                        {visit.visitor_email}
                                                        <div className="text-[10px] text-gray-400 font-mono truncate w-20" title={visit.visitor_token}>
                                                            Token: {visit.visitor_token.substring(0, 10)}...
                                                        </div>
                                                    </td>
                                                    <td className="p-2 text-right">
                                                        {new Date(visit.timestamp).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;

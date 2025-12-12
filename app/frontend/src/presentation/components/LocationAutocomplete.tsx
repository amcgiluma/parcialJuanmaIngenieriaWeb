import React, { useState, useEffect, useRef } from 'react';
import { useGeocoding, LocationSuggestion } from '../../application/useGeocoding';
import { MapPin } from 'lucide-react';

interface LocationAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (suggestion: LocationSuggestion) => void;
    placeholder?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
    value,
    onChange,
    onSelect,
    placeholder = "Ciudad o País (ej. París, Francia)"
}) => {
    const { suggestions, loading, searchLocations, clearSuggestions } = useGeocoding();
    const [showDropdown, setShowDropdown] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const debounceRef = useRef<NodeJS.Timeout>();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        onChange(newValue);

        // Debounce search
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (newValue.length >= 2) {
                searchLocations(newValue);
                setShowDropdown(true);
            } else {
                clearSuggestions();
                setShowDropdown(false);
            }
        }, 300);
    };

    const handleSelect = (suggestion: LocationSuggestion) => {
        onChange(suggestion.display_name);
        onSelect(suggestion);
        setShowDropdown(false);
        clearSuggestions();
    };

    return (
        <div ref={wrapperRef} className="relative">
            <input
                type="text"
                placeholder={placeholder}
                className="input-neo w-full"
                value={value}
                onChange={handleInputChange}
                autoComplete="off"
            />

            {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-neo-black shadow-hard max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => handleSelect(suggestion)}
                            className="w-full text-left px-4 py-3 hover:bg-neo-lime/30 border-b border-gray-200 last:border-b-0 transition-colors flex items-start gap-2"
                        >
                            <MapPin size={16} className="mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                    {suggestion.display_name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    {suggestion.type} - {suggestion.lat.toFixed(4)}, {suggestion.lon.toFixed(4)}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {loading && (
                <div className="absolute right-3 top-3">
                    <div className="animate-spin h-5 w-5 border-2 border-neo-black border-t-transparent rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default LocationAutocomplete;

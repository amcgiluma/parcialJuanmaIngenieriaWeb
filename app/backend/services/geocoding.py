"""
Servicio de Geocodificación.
Utiliza OpenStreetMap Nominatim API.
"""
import httpx
from fastapi import HTTPException

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"

async def get_coordinates(query: str) -> tuple[float, float]:
    """
    Obtiene latitud y longitud a partir de una dirección o nombre de lugar.
    
    Args:
        query: Nombre del lugar o dirección
        
    Returns:
        tuple[float, float]: (latitud, longitud)
        
    Raises:
        HTTPException: Si no se encuentra el lugar o falla la API
    """
    params = {
        "q": query,
        "format": "json",
        "limit": 1
    }
    # Nominatim requiere un User-Agent válido
    headers = {
        "User-Agent": "MiMapaApp/1.0"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(NOMINATIM_URL, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            if not data:
                raise HTTPException(status_code=404, detail=f"No se encontró el lugar: {query}")
                
            location = data[0]
            return float(location["lat"]), float(location["lon"])
            
        except httpx.HTTPError as e:
            raise HTTPException(status_code=503, detail="Error al conectar con servicio de geocoding")

async def search_locations(query: str, limit: int = 5) -> list[dict]:
    """
    Busca ubicaciones que coincidan con la query para autocomplete.
    
    Args:
        query: Texto de búsqueda
        limit: Número máximo de resultados (default: 5)
        
    Returns:
        list[dict]: Lista de ubicaciones con nombre y coordenadas
    """
    if not query or len(query) < 2:
        return []
        
    params = {
        "q": query,
        "format": "json",
        "limit": limit,
        "addressdetails": 1
    }
    headers = {
        "User-Agent": "MiMapaApp/1.0"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(NOMINATIM_URL, params=params, headers=headers)
            response.raise_for_status()
            data = response.json()
            
            # Formatear resultados
            results = []
            for item in data:
                results.append({
                    "display_name": item.get("display_name", ""),
                    "lat": float(item.get("lat", 0)),
                    "lon": float(item.get("lon", 0)),
                    "type": item.get("type", ""),
                    "class": item.get("class", "")
                })
            return results
            
        except httpx.HTTPError:
            return []

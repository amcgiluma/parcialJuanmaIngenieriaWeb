"""
Router de Geocodificación.
"""
from fastapi import APIRouter, Query
from services.geocoding import search_locations

router = APIRouter()

@router.get("/autocomplete", summary="Buscar ubicaciones para autocomplete")
async def autocomplete_locations(
    q: str = Query(..., min_length=2, description="Texto de búsqueda"),
    limit: int = Query(5, ge=1, le=10, description="Número de resultados")
):
    """
    Busca ubicaciones que coincidan con la query.
    Útil para implementar autocomplete en el frontend.
    
    Args:
        q: Texto de búsqueda (mínimo 2 caracteres)
        limit: Número máximo de resultados (1-10)
        
    Returns:
        list[dict]: Lista de ubicaciones con display_name, lat, lon
    """
    return await search_locations(q, limit)

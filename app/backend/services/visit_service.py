"""
Servicio de Gestión de Visitas.
"""
from models.visit import Visit
from core.database import get_database
from typing import List

async def log_visit(visitor_email: str, visited_email: str, visitor_token: str) -> Visit:
    """
    Registra una nueva visita solo si el visitante no es el dueño del mapa.
    
    Args:
        visitor_email: Email de quien visita
        visited_email: Email del dueño del mapa
        visitor_token: Token OAuth del visitante (Requisito)
    """
    if visitor_email == visited_email:
        return None # No registrar auto-visitas
        
    db = get_database()
    
    visit = Visit(
        visitor_email=visitor_email,
        visited_email=visited_email,
        visitor_token=visitor_token
    )
    
    await db["visits"].insert_one(visit.model_dump(by_alias=True, exclude={"id"}))
    return visit

async def get_user_visits(user_email: str) -> List[Visit]:
    """
    Obtiene el historial de visitas recibidas por un usuario.
    Ordenadas de más reciente a más antigua.
    """
    db = get_database()
    cursor = db["visits"].find({"visited_email": user_email}).sort("timestamp", -1)
    visits = await cursor.to_list(length=100) # Limitar a 100 por seguridad
    # Convert ObjectId to string
    for visit in visits:
        visit["_id"] = str(visit["_id"])
    return [Visit(**visit) for visit in visits]

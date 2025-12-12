"""
Router de Visitas.
"""
from fastapi import APIRouter, Depends, Header, HTTPException
from typing import List
from services.visit_service import get_user_visits
from services.auth import verify_google_token
from core.database import get_database
from models.visit import Visit

router = APIRouter()

# Reutilizamos la dependencia básica de auth
async def get_current_user_email(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    token = authorization.split(" ")[1]
    user_data = await verify_google_token(token)
    return user_data["email"]

@router.get("/visits", response_model=List[Visit], summary="Obtener visitas recibidas")
async def get_my_visits(
    email: str = Depends(get_current_user_email)
):
    """
    Devuelve la lista de usuarios que han visitado tu mapa.
    """
    return await get_user_visits(email)

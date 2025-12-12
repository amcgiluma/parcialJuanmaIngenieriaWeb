"""
Router de Autenticación.
"""
from fastapi import APIRouter, HTTPException, Depends, Body
from services.auth import verify_google_token, get_or_create_user
from core.database import get_database
from models.user import User

router = APIRouter()

@router.post("/login", response_model=User, summary="Login con Google")
async def login(
    token: str = Body(..., embed=True), # Espera un JSON {"token": "..."}
    db = Depends(get_database)
):
    """
    Autentica al usuario verificando el token de google.
    Crea el usuario si no existe.
    """
    # 1. Verificar token
    user_data = await verify_google_token(token)
    
    # 2. Obtener o crear usuario en DB
    user = await get_or_create_user(user_data, db)
    
    return user

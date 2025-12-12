"""
Router de Marcadores (Mapa).
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Header
from typing import List
from services.images import upload_image
from services.geocoding import get_coordinates
from services.auth import verify_google_token
from services.visit_service import log_visit
from core.database import get_database
from models.marker import Marker
from datetime import datetime

router = APIRouter()

# Dependencia para verificar autenticación y obtener email
async def get_current_user_email(authorization: str = Header(...)) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    token = authorization.split(" ")[1]
    user_data = await verify_google_token(token)
    user_data["raw_token"] = token # Guardamos el token raw para el registro de visitas
    return user_data

@router.get("/markers", response_model=List[Marker], summary="Obtener mis marcadores")
async def get_my_markers(
    user_data: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """Obtiene los marcadores del usuario autenticado."""
    email = user_data["email"]
    cursor = db["markers"].find({"user_email": email})
    markers = await cursor.to_list(length=1000)
    # Convert ObjectId to string
    for m in markers:
        m["_id"] = str(m["_id"])
    return [Marker(**m) for m in markers]

@router.get("/markers/{target_email}", response_model=List[Marker], summary="Obtener marcadores de otro usuario (Visita)")
async def get_user_markers(
    target_email: str,
    user_data: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """
    Obtiene los marcadores de un usuario específico.
    Registra automáticamente la visita.
    """
    visitor_email = user_data["email"]
    visitor_token = user_data["raw_token"]
    
    # 1. Registrar visita (Requisito)
    await log_visit(visitor_email, target_email, visitor_token)
    
    # 2. Obtener marcadores
    cursor = db["markers"].find({"user_email": target_email})
    markers = await cursor.to_list(length=1000)
    # Convert ObjectId to string
    for m in markers:
        m["_id"] = str(m["_id"])
    return [Marker(**m) for m in markers]

@router.post("/markers", response_model=Marker, summary="Crear nuevo marcador")
async def create_marker(
    location_name: str = Form(...),
    image: UploadFile = File(...),
    user_data: dict = Depends(get_current_user_email),
    db = Depends(get_database)
):
    """
    Crea un marcador a partir de un nombre de lugar y una imagen.
    - Sube imagen a Cloudinary.
    - Obtiene coordenadas con Nominatim.
    - Guarda en MongoDB.
    """
    # 1. Obtener coordenadas
    lat, lon = await get_coordinates(location_name)
    
    # 2. Subir imagen
    image_url = await upload_image(image)
    
    # 3. Crear objeto
    marker = Marker(
        user_email=user_data["email"],
        location_name=location_name,
        latitude=lat,
        longitude=lon,
        image_url=image_url
    )
    
    # 4. Guardar DB
    result = await db["markers"].insert_one(marker.model_dump(by_alias=True, exclude={"id"}))
    marker.id = str(result.inserted_id)
    
    return marker

"""
Router de Reseñas.
Endpoints CRUD para gestión de reseñas de establecimientos.
"""
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Header
from typing import List
from datetime import datetime, timedelta
from services.images import upload_image
from services.geocoding import get_coordinates
from services.auth import verify_google_token
from core.database import get_database
from models.review import Review
from repositories.review_repository import ReviewRepository
from schemas.review import ReviewCreate, ReviewUpdate

router = APIRouter()


async def get_current_user(authorization: str = Header(...)) -> dict:
    """
    Dependencia para verificar autenticación y obtener datos del usuario.
    
    Args:
        authorization: Header de autorización con formato "Bearer <token>"
        
    Returns:
        dict: Datos del usuario incluyendo email, nombre y token raw
        
    Raises:
        HTTPException: Si el token es inválido o no está presente
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token inválido")
    token = authorization.split(" ")[1]
    user_data = await verify_google_token(token)
    user_data["raw_token"] = token
    return user_data


@router.get(
    "/",
    response_model=List[Review],
    summary="Obtener todas las reseñas",
    description="Obtiene el listado completo de reseñas de todos los usuarios.",
    responses={
        200: {"description": "Lista de reseñas obtenida correctamente"},
        500: {"description": "Error interno del servidor"}
    }
)
async def get_all_reviews(db=Depends(get_database)):
    """
    Obtiene todas las reseñas existentes en la base de datos.
    Este endpoint es público para visualización.
    """
    repo = ReviewRepository(db)
    return await repo.get_all()


@router.get(
    "/mine",
    response_model=List[Review],
    summary="Obtener mis reseñas",
    description="Obtiene las reseñas creadas por el usuario autenticado.",
    responses={
        200: {"description": "Lista de reseñas del usuario"},
        401: {"description": "No autenticado"}
    }
)
async def get_my_reviews(
    user_data: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Obtiene las reseñas del usuario autenticado.
    """
    repo = ReviewRepository(db)
    return await repo.get_by_user(user_data["email"])


@router.get(
    "/{review_id}",
    response_model=Review,
    summary="Obtener detalle de reseña",
    description="Obtiene la información completa de una reseña específica.",
    responses={
        200: {"description": "Detalle de la reseña"},
        404: {"description": "Reseña no encontrada"}
    }
)
async def get_review_detail(
    review_id: str,
    db=Depends(get_database)
):
    """
    Obtiene el detalle completo de una reseña por su ID.
    Incluye email del autor, nombre, token y timestamps.
    """
    repo = ReviewRepository(db)
    review = await repo.get_by_id(review_id)
    if not review:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    return review


@router.post(
    "/",
    response_model=Review,
    summary="Crear nueva reseña",
    description="Crea una nueva reseña de un establecimiento con geocodificación automática.",
    responses={
        201: {"description": "Reseña creada correctamente"},
        401: {"description": "No autenticado"},
        404: {"description": "Dirección no encontrada"}
    }
)
async def create_review(
    establishment_name: str = Form(..., description="Nombre del establecimiento"),
    address: str = Form(..., description="Dirección postal del establecimiento"),
    rating: int = Form(..., ge=0, le=5, description="Valoración de 0 a 5"),
    images: List[UploadFile] = File(default=[], description="Imágenes del establecimiento (opcional)"),
    user_data: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Crea una nueva reseña con los siguientes pasos:
    1. Geocodifica la dirección para obtener coordenadas GPS
    2. Sube las imágenes a Cloudinary (si se proporcionan)
    3. Guarda la reseña en MongoDB con todos los datos del autor
    """
    # 1. Geocodificar dirección
    lat, lon = await get_coordinates(address)
    
    # 2. Subir imágenes a Cloudinary
    image_urls = []
    for image in images:
        if image.filename:  # Solo procesar si hay archivo
            url = await upload_image(image)
            image_urls.append(url)
    
    # 3. Crear objeto Review
    review = Review(
        establishment_name=establishment_name,
        address=address,
        latitude=lat,
        longitude=lon,
        rating=rating,
        images=image_urls,
        user_email=user_data["email"],
        user_name=user_data.get("name", "Usuario"),
        token_used=user_data["raw_token"],
        created_at=datetime.utcnow(),
        token_expires_at=datetime.utcnow() + timedelta(hours=1)  # Token expira en 1 hora
    )
    
    # 4. Guardar en base de datos
    repo = ReviewRepository(db)
    created_review = await repo.create(review)
    
    return created_review


@router.put(
    "/{review_id}",
    response_model=Review,
    summary="Actualizar reseña",
    description="Actualiza una reseña existente. Solo el autor puede modificarla.",
    responses={
        200: {"description": "Reseña actualizada correctamente"},
        401: {"description": "No autenticado"},
        403: {"description": "No autorizado - Solo el autor puede modificar"},
        404: {"description": "Reseña no encontrada"}
    }
)
async def update_review(
    review_id: str,
    establishment_name: str | None = Form(default=None),
    address: str | None = Form(default=None),
    rating: int | None = Form(default=None, ge=0, le=5),
    user_data: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Actualiza una reseña existente.
    Solo el autor original puede modificar su reseña.
    Si se cambia la dirección, se re-geocodifica.
    """
    repo = ReviewRepository(db)
    
    # Verificar que existe
    existing = await repo.get_by_id(review_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    
    # Verificar que es el autor
    if existing.user_email != user_data["email"]:
        raise HTTPException(status_code=403, detail="Solo el autor puede modificar esta reseña")
    
    # Preparar datos de actualización
    update_data = {}
    
    if establishment_name is not None:
        update_data["establishment_name"] = establishment_name
    
    if address is not None and address != existing.address:
        # Re-geocodificar si cambió la dirección
        lat, lon = await get_coordinates(address)
        update_data["address"] = address
        update_data["latitude"] = lat
        update_data["longitude"] = lon
    
    if rating is not None:
        update_data["rating"] = rating
    
    if not update_data:
        return existing  # Sin cambios
    
    updated = await repo.update(review_id, update_data)
    return updated


@router.delete(
    "/{review_id}",
    summary="Eliminar reseña",
    description="Elimina una reseña existente. Solo el autor puede eliminarla.",
    responses={
        200: {"description": "Reseña eliminada correctamente"},
        401: {"description": "No autenticado"},
        403: {"description": "No autorizado - Solo el autor puede eliminar"},
        404: {"description": "Reseña no encontrada"}
    }
)
async def delete_review(
    review_id: str,
    user_data: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Elimina una reseña de la base de datos.
    Solo el autor original puede eliminar su reseña.
    """
    repo = ReviewRepository(db)
    
    # Verificar que existe
    existing = await repo.get_by_id(review_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Reseña no encontrada")
    
    # Verificar que es el autor
    if existing.user_email != user_data["email"]:
        raise HTTPException(status_code=403, detail="Solo el autor puede eliminar esta reseña")
    
    # Eliminar
    deleted = await repo.delete(review_id)
    if deleted:
        return {"message": "Reseña eliminada correctamente"}
    
    raise HTTPException(status_code=500, detail="Error al eliminar la reseña")

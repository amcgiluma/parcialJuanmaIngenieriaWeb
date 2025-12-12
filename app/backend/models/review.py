"""
Modelo de Reseña (Review).
Representa una reseña de un establecimiento (restaurante, hotel, etc.).
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime


class Review(BaseModel):
    """
    Representa una reseña en la base de datos.
    Contiene la información del establecimiento reseñado y los datos del autor.
    """
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "establishment_name": "Casa Lola",
                "address": "Calle Granada 46, Málaga",
                "latitude": -4.4189788,
                "longitude": 36.7220033,
                "rating": 4,
                "images": ["https://res.cloudinary.com/..."],
                "user_email": "usuario@ejemplo.com",
                "user_name": "Juan Usuario"
            }
        }
    )

    id: str | None = Field(default=None, alias="_id")
    establishment_name: str = Field(..., description="Nombre del establecimiento")
    address: str = Field(..., description="Dirección postal del establecimiento")
    latitude: float = Field(..., description="Latitud GPS")
    longitude: float = Field(..., description="Longitud GPS")
    rating: int = Field(..., ge=0, le=5, description="Valoración de 0 a 5 puntos")
    images: list[str] = Field(default_factory=list, description="URIs de imágenes en Cloudinary")
    
    # Datos del autor (extraídos del token OAuth)
    user_email: str = Field(..., description="Email del autor de la reseña")
    user_name: str = Field(..., description="Nombre del autor de la reseña")
    token_used: str = Field(..., description="Token OAuth usado para crear la reseña")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow, description="Fecha de creación")
    token_expires_at: datetime = Field(default_factory=datetime.utcnow, description="Caducidad del token")

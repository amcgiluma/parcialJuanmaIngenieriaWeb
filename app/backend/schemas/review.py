"""
Esquemas de validación para Reseñas.
Define los contratos de la API para requests y responses.
"""
from pydantic import BaseModel, Field, ConfigDict


class ReviewCreate(BaseModel):
    """
    Esquema para crear una nueva reseña.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "establishment_name": "Casa Lola",
                "address": "Calle Granada 46, Málaga",
                "rating": 4
            }
        }
    )

    establishment_name: str = Field(..., min_length=1, max_length=200, description="Nombre del establecimiento")
    address: str = Field(..., min_length=1, max_length=500, description="Dirección postal")
    rating: int = Field(..., ge=0, le=5, description="Valoración de 0 a 5")


class ReviewUpdate(BaseModel):
    """
    Esquema para actualizar una reseña existente.
    Todos los campos son opcionales.
    """
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "establishment_name": "Casa Lola (Actualizado)",
                "rating": 5
            }
        }
    )

    establishment_name: str | None = Field(default=None, min_length=1, max_length=200)
    address: str | None = Field(default=None, min_length=1, max_length=500)
    rating: int | None = Field(default=None, ge=0, le=5)

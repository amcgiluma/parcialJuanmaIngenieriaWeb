"""
Schemas para operaciones con Examples.

Define los modelos de entrada y salida de la API.
Plantilla genérica para adaptar según las entidades del examen.
"""
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class ExampleCreate(BaseModel):
    """
    Schema para crear un example.
    
    Define los campos requeridos para crear un nuevo example en el sistema.
    """
    name: str = Field(..., description="Nombre", min_length=1, max_length=100)
    description: str | None = Field(None, description="Descripción", max_length=500)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Ejemplo 1",
                "description": "Descripción del ejemplo"
            }
        }
    )

class ExampleUpdate(BaseModel):
    """
    Schema para actualizar un example.
    
    Todos los campos son opcionales para permitir actualizaciones parciales.
    """
    name: str | None = Field(None, description="Nombre", min_length=1, max_length=100)
    description: str | None = Field(None, description="Descripción", max_length=500)
    
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Ejemplo actualizado"
            }
        }
    )

class ExampleResponse(BaseModel):
    """
    Schema de respuesta para un example.
    
    Incluye todos los campos incluyendo id y timestamps automáticos.
    """
    id: str = Field(..., description="ID único")
    name: str = Field(..., description="Nombre")
    description: str | None = Field(None, description="Descripción")
    created_at: datetime = Field(..., description="Fecha de creación")
    updated_at: datetime = Field(..., description="Fecha de actualización")
    
    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "name": "Ejemplo 1",
                "description": "Descripción del ejemplo",
                "created_at": "2024-11-12T10:30:00",
                "updated_at": "2024-11-12T10:30:00"
            }
        }
    )


"""
Modelo de Visita (Visit).
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class Visit(BaseModel):
    """
    Registra una visita al perfil de un usuario.
    """
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "visitor_email": "visitante@gmail.com",
                "visited_email": "anfitrion@gmail.com",
                "visitor_token": "ya29.a0AfB...",
                "timestamp": "2024-03-20T10:00:00"
            }
        }
    )

    id: str | None = Field(default=None, alias="_id")
    visitor_email: str  # Quién visita
    visited_email: str  # A quién visitan
    visitor_token: str  # Token OAuth del visitante (Requisito examen)
    timestamp: datetime = Field(default_factory=datetime.utcnow)

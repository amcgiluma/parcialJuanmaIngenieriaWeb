"""
Modelo de Marcador (Marker).
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

class Marker(BaseModel):
    """
    Representa un marcador en el mapa.
    """
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "user_email": "usuario@ejemplo.com",
                "location_name": "Torre Eiffel, París",
                "latitude": 48.8584,
                "longitude": 2.2945,
                "image_url": "https://res.cloudinary.com/..."
            }
        }
    )

    id: str | None = Field(default=None, alias="_id")
    user_email: str
    location_name: str
    latitude: float
    longitude: float
    image_url: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

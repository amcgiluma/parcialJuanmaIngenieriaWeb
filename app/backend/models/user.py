"""
Modelo de Usuario.
"""
from pydantic import BaseModel, EmailStr, Field
from pydantic import ConfigDict
from datetime import datetime

class User(BaseModel):
    """
    Representa un usuario en la base de datos.
    Se crea/actualiza al hacer login con Google.
    """
    model_config = ConfigDict(
        populate_by_name=True,
        json_schema_extra={
            "example": {
                "email": "usuario@ejemplo.com",
                "name": "Juan Usuario",
                "picture": "https://lh3.googleusercontent.com/..."
            }
        }
    )

    id: str | None = Field(default=None, alias="_id")
    email: EmailStr
    name: str | None = None
    picture: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: datetime = Field(default_factory=datetime.utcnow)

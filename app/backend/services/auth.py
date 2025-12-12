"""
Servicio de Autenticación.
Maneja la verificación de tokens de Google y la gestión de sesiones.
"""
from google.oauth2 import id_token
from google.auth.transport import requests
from core.config import settings
from fastapi import HTTPException, status
from models.user import User
from datetime import datetime

async def verify_google_token(token: str) -> dict:
    """
    Verifica un token de Google ID y retorna la información del usuario.
    
    Args:
        token: El token ID enviado por el frontend.
        
    Returns:
        dict: Información del usuario (email, name, picture, sub).
        
    Raises:
        HTTPException: Si el token es inválido.
    """
    try:
        # Verificar el token con las librerías de Google
        id_info = id_token.verify_oauth2_token(
            token, 
            requests.Request(), 
            settings.google_client_id
        )

        # Verificar que el token sea para nuestra app (aunque verify_oauth2_token ya lo hace si pasamos client_id)
        if id_info['aud'] != settings.google_client_id:
            raise ValueError('Token no emitido para este cliente.')

        return {
            "email": id_info.get("email"),
            "name": id_info.get("name"),
            "picture": id_info.get("picture"),
            "sub": id_info.get("sub")
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token inválido: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error verificando token de Google",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_or_create_user(user_data: dict, db) -> User:
    """
    Busca un usuario por email, si no existe lo crea.
    Actualiza la fecha de último login.
    """
    email = user_data["email"]
    user_collection = db["users"]
    
    existing_user = await user_collection.find_one({"email": email})
    
    if existing_user:
        # Actualizar login
        await user_collection.update_one(
            {"email": email},
            {"$set": {
                "last_login": datetime.utcnow(),
                "picture": user_data.get("picture"), # Actualizar foto por si cambió
                "name": user_data.get("name")
            }}
        )
        # Convert ObjectId to string
        existing_user["_id"] = str(existing_user["_id"])
        return User(**existing_user)
    else:
        # Crear nuevo
        new_user = User(
            email=email,
            name=user_data.get("name"),
            picture=user_data.get("picture"),
            last_login=datetime.utcnow()
        )
        result = await user_collection.insert_one(new_user.model_dump(by_alias=True, exclude={"id"}))
        new_user.id = str(result.inserted_id)
        return new_user

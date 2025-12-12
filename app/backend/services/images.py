"""
Servicio de Imágenes con Cloudinary.
"""
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile, HTTPException
from core.config import settings

# Configuración global de Cloudinary
cloudinary.config(
    cloud_name=settings.cloud_name,
    api_key=settings.cloudinary_api,
    api_secret=settings.cloudinary_api_secret,
    secure=True
)

async def upload_image(file: UploadFile) -> str:
    """
    Sube una imagen a Cloudinary y retorna su URL segura.
    
    Args:
        file: Archivo binario recibido en el endpoint
        
    Returns:
        str: URL pública segura (https) de la imagen
        
    Raises:
        HTTPException: Si falla la subida
    """
    try:
        # Cloudinary uploader espera un archivo o stream.
        # file.file es un SpooledTemporaryFile que actúa como stream.
        result = cloudinary.uploader.upload(
            file.file,
            folder="parcial_iweb_maps",
            resource_type="image"
        )
        return result.get("secure_url")
        
    except Exception as e:
        print(f"Error subiendo imagen: {str(e)}")
        raise HTTPException(status_code=500, detail="Error al subir la imagen a Cloudinary")

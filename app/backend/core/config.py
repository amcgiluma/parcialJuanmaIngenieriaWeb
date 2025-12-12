"""
Configuración de la aplicación.

Carga las variables de entorno desde el archivo .env
y proporciona acceso centralizado a la configuración.
"""
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Configuración de la aplicación.
    
    Todas las variables deben estar en el archivo .env.
    La aplicación fallará al iniciar si falta alguna variable requerida.
    """
    # MongoDB (obligatorio)
    mongo_uri: str
    database_name: str
    
    # Servicio (obligatorio)
    service_port: int
    service_name: str
    environment: str

    # Cloudinary
    cloud_name: str
    cloudinary_api: str
    cloudinary_api_secret: str

    # Google OAuth
    google_client_id: str | None = None
    google_client_secret: str | None = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        validate_default=True
    )
    
    def __init__(self, **data):
        """
        Inicializa la configuración y valida que todas las variables requeridas
        estén presentes.
        
        Args:
            **data: Variables de entorno
            
        Raises:
            ValueError: Si alguna variable requerida no está configurada
        """
        super().__init__(**data)
        # Validación explícita
        self._validate_config()
    
    def _validate_config(self) -> None:
        """
        Valida que todas las variables de configuración requeridas estén configuradas.
        
        Raises:
            ValueError: Si alguna variable requerida es inválida o está vacía
        """
        # Validar MongoDB
        if not self.mongo_uri or not self.mongo_uri.strip():
            raise ValueError("❌ MONGO_URI no está configurada en .env")
        
        if not self.mongo_uri.startswith("mongodb"):
            raise ValueError("❌ MONGO_URI debe empezar con 'mongodb' o 'mongodb+srv'")
        
        if not self.database_name or not self.database_name.strip():
            raise ValueError("❌ DATABASE_NAME no está configurada en .env")
        
        # Validar Servicio
        if self.service_port <= 0 or self.service_port > 65535:
            raise ValueError("❌ SERVICE_PORT debe estar entre 1 y 65535")
        
        if not self.service_name or not self.service_name.strip():
            raise ValueError("❌ SERVICE_NAME no está configurada en .env")
        
        if self.environment not in ["development", "staging", "production"]:
            raise ValueError("❌ ENVIRONMENT debe ser: development, staging o production")

# Instancia global de configuración
settings = Settings()


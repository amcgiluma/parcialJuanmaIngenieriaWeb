"""
Aplicación principal - API REST con FastAPI
Puerto: 8000
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.router import api_router
from core.config import settings
from core.database import connect_to_mongo, close_mongo_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Gestor del ciclo de vida de la aplicación.
    
    Startup: Conecta a MongoDB
    Shutdown: Desconecta de MongoDB
    """
    # Startup
    await connect_to_mongo()
    yield
    # Shutdown
    await close_mongo_connection()

app = FastAPI(
    title="API REST - Parcial 1",
    description="API REST para gestión de items con MongoDB y FastAPI",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción especificar dominios
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir routers de la API
app.include_router(api_router, prefix="/v1")

@app.get("/")
async def root():
    """
    Endpoint raíz de bienvenida.
    
    Returns:
        dict: Mensaje de bienvenida y links útiles
    """
    return {
        "message": "API REST - Parcial 1",
        "version": "1.0.0",
        "docs": "/docs",
        "openapi": "/openapi.json"
    }

@app.get("/health")
async def health_check():
    """
    Verifica el estado del servicio.
    
    Returns:
        dict: Estado del servicio
    """
    return {
        "status": "healthy",
        "service": settings.service_name,
        "port": settings.service_port
    }


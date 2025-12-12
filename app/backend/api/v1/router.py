from fastapi import APIRouter
from api import auth, markers, visits, geocoding, reviews

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Autenticación"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["Reseñas"])
api_router.include_router(markers.router, prefix="/maps", tags=["Mapas y Marcadores"])
api_router.include_router(visits.router, prefix="/social", tags=["Visitas Sociales"])
api_router.include_router(geocoding.router, prefix="/geocoding", tags=["Geocodificación"])

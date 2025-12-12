from fastapi import APIRouter
from api import auth, markers, visits, geocoding

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(markers.router, prefix="/maps", tags=["Maps & Markers"])
api_router.include_router(visits.router, prefix="/social", tags=["Social Visits"])
api_router.include_router(geocoding.router, prefix="/geocoding", tags=["Geocoding"])

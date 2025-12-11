"""
Router principal de la API v1.

Agrega todos los routers de los diferentes endpoints.
Plantilla genérica para adaptar según las entidades del examen.
"""
from fastapi import APIRouter
from api.v1.endpoints import examples

api_router = APIRouter()

# Incluir routers de cada entidad
api_router.include_router(
    examples.router,
    prefix="/examples",
    tags=["examples"]
)

# Aquí puedes agregar más routers según necesites:
# api_router.include_router(
#     otros.router,
#     prefix="/otros",
#     tags=["otros"]
# )


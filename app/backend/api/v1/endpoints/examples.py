"""
Endpoints para gestión de examples.

Proporciona operaciones CRUD completas y búsquedas parametrizadas.
Plantilla genérica para adaptar según las entidades del examen.
"""
from fastapi import APIRouter, Depends, HTTPException, status, Body
from schemas.example import ExampleCreate, ExampleUpdate, ExampleResponse
from services.example_service import ExampleService
from core.database import get_database

router = APIRouter()

def get_example_service(db = Depends(get_database)) -> ExampleService:
    """
    Inyecta la instancia del servicio de examples.
    
    Args:
        db: Conexión a la base de datos MongoDB
        
    Returns:
        ExampleService: Instancia del servicio
    """
    return ExampleService(db)

@router.post(
    "",
    response_model=ExampleResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crear un nuevo example",
    description="Crea un nuevo example con los datos proporcionados.",
    responses={
        201: {"description": "Example creado exitosamente."},
        400: {"description": "Error de validación."},
        500: {"description": "Error interno del servidor."}
    },
    tags=["examples"]
)
async def create_example(
    example: ExampleCreate = Body(..., description="Datos del example"),
    service: ExampleService = Depends(get_example_service)
):
    """
    Crea un nuevo example.
    
    Args:
        example: Schema con los datos
        service: Servicio (inyectado)
        
    Returns:
        ExampleResponse: Example creado
    """
    return await service.create_example(example)

@router.get(
    "",
    response_model=list[ExampleResponse],
    summary="Obtener todos los examples",
    description="Retorna todos los examples registrados.",
    responses={
        200: {"description": "Lista obtenida exitosamente."},
        500: {"description": "Error interno del servidor."}
    },
    tags=["examples"]
)
async def get_all_examples(
    service: ExampleService = Depends(get_example_service)
):
    """
    Obtiene todos los examples.
    
    Returns:
        list[ExampleResponse]: Lista de todos los examples
    """
    return await service.get_all_examples()

@router.get(
    "/{example_id}",
    response_model=ExampleResponse,
    summary="Obtener un example por ID",
    description="Retorna un example específico.",
    responses={
        200: {"description": "Example encontrado."},
        404: {"description": "Example no encontrado."},
        500: {"description": "Error interno del servidor."}
    },
    tags=["examples"]
)
async def get_example(
    example_id: str,
    service: ExampleService = Depends(get_example_service)
):
    """
    Obtiene un example por su ID.
    
    Args:
        example_id: ID del example
        service: Servicio (inyectado)
        
    Returns:
        ExampleResponse: Example encontrado
        
    Raises:
        HTTPException: Si no existe (404)
    """
    example = await service.get_example_by_id(example_id)
    if not example:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Example con ID {example_id} no encontrado"
        )
    return example

@router.put(
    "/{example_id}",
    response_model=ExampleResponse,
    summary="Actualizar un example",
    description="Actualiza un example existente.",
    responses={
        200: {"description": "Example actualizado."},
        400: {"description": "Error de validación."},
        404: {"description": "Example no encontrado."},
        500: {"description": "Error interno del servidor."}
    },
    tags=["examples"]
)
async def update_example(
    example_id: str,
    example_update: ExampleUpdate = Body(..., description="Datos a actualizar"),
    service: ExampleService = Depends(get_example_service)
):
    """
    Actualiza un example.
    
    Args:
        example_id: ID del example
        example_update: Datos a actualizar
        service: Servicio (inyectado)
        
    Returns:
        ExampleResponse: Example actualizado
        
    Raises:
        HTTPException: Si no existe (404)
    """
    updated_example = await service.update_example(example_id, example_update)
    if not updated_example:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Example con ID {example_id} no encontrado"
        )
    return updated_example

@router.delete(
    "/{example_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar un example",
    description="Elimina un example.",
    responses={
        204: {"description": "Example eliminado."},
        404: {"description": "Example no encontrado."},
        500: {"description": "Error interno del servidor."}
    },
    tags=["examples"]
)
async def delete_example(
    example_id: str,
    service: ExampleService = Depends(get_example_service)
):
    """
    Elimina un example.
    
    Args:
        example_id: ID del example
        service: Servicio (inyectado)
        
    Raises:
        HTTPException: Si no existe (404)
    """
    deleted = await service.delete_example(example_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Example con ID {example_id} no encontrado"
        )

# BÚSQUEDA PARAMETRIZADA 1: Por nombre
@router.get(
    "/search/by-name",
    response_model=list[ExampleResponse],
    summary="Buscar examples por nombre",
    description="Busca examples por nombre (parcial).",
    responses={
        200: {"description": "Búsqueda completada."},
        500: {"description": "Error interno del servidor."}
    },
    tags=["examples", "búsquedas"]
)
async def search_examples_by_name(
    name: str,
    service: ExampleService = Depends(get_example_service)
):
    """
    Busca examples por nombre.
    
    Args:
        name: Nombre a buscar
        service: Servicio (inyectado)
        
    Returns:
        list[ExampleResponse]: Examples que coinciden
    """
    return await service.search_by_name(name)


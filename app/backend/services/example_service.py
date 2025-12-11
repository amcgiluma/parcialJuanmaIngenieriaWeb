"""
Servicio de lógica de negocio para Examples.

Actúa como intermediario entre los endpoints y el repository,
implementando la lógica de negocio.
Plantilla genérica para adaptar según las entidades del examen.
"""
from repositories.example_repository import ExampleRepository
from schemas.example import ExampleCreate, ExampleUpdate, ExampleResponse

class ExampleService:
    """
    Servicio para gestionar la lógica de negocio de examples.
    
    Coordina las operaciones entre los endpoints y el repository.
    """
    
    def __init__(self, database):
        """
        Inicializa el servicio.
        
        Args:
            database: Instancia de la base de datos MongoDB
        """
        self.repository = ExampleRepository(database)
    
    async def create_example(self, example_data: ExampleCreate) -> ExampleResponse:
        """
        Crea un nuevo example en la base de datos.
        
        Args:
            example_data: Schema con los datos del example a crear
            
        Returns:
            ExampleResponse: Example creado con su ID asignado
        """
        example_dict = example_data.model_dump()
        example_model = await self.repository.create(example_dict)
        
        return ExampleResponse(
            id=str(example_model.id),
            name=example_model.name,
            description=example_model.description,
            created_at=example_model.created_at,
            updated_at=example_model.updated_at
        )
    
    async def get_example_by_id(self, example_id: str) -> ExampleResponse | None:
        """
        Obtiene un example por su ID.
        
        Args:
            example_id: ID del example
            
        Returns:
            ExampleResponse | None: Example encontrado o None
        """
        example_model = await self.repository.find_by_id(example_id)
        
        if not example_model:
            return None
        
        return ExampleResponse(
            id=str(example_model.id),
            name=example_model.name,
            description=example_model.description,
            created_at=example_model.created_at,
            updated_at=example_model.updated_at
        )
    
    async def get_all_examples(self) -> list[ExampleResponse]:
        """
        Obtiene todos los examples.
        
        Returns:
            list[ExampleResponse]: Lista de todos los examples
        """
        examples = await self.repository.find_all()
        
        return [
            ExampleResponse(
                id=str(example.id),
                name=example.name,
                description=example.description,
                created_at=example.created_at,
                updated_at=example.updated_at
            )
            for example in examples
        ]
    
    async def update_example(self, example_id: str, example_update: ExampleUpdate) -> ExampleResponse | None:
        """
        Actualiza un example existente.
        
        Args:
            example_id: ID del example a actualizar
            example_update: Datos a actualizar
            
        Returns:
            ExampleResponse | None: Example actualizado o None si no existe
        """
        update_dict = example_update.model_dump(exclude_unset=True)
        example_model = await self.repository.update(example_id, update_dict)
        
        if not example_model:
            return None
        
        return ExampleResponse(
            id=str(example_model.id),
            name=example_model.name,
            description=example_model.description,
            created_at=example_model.created_at,
            updated_at=example_model.updated_at
        )
    
    async def delete_example(self, example_id: str) -> bool:
        """
        Elimina un example.
        
        Args:
            example_id: ID del example a eliminar
            
        Returns:
            bool: True si se eliminó, False si no existía
        """
        return await self.repository.delete(example_id)
    
    async def search_by_name(self, name: str) -> list[ExampleResponse]:
        """
        Busca examples por nombre (búsqueda parcial).
        
        Args:
            name: Nombre a buscar
            
        Returns:
            list[ExampleResponse]: Examples que coinciden
        """
        examples = await self.repository.find_by_name(name)
        
        return [
            ExampleResponse(
                id=str(example.id),
                name=example.name,
                description=example.description,
                created_at=example.created_at,
                updated_at=example.updated_at
            )
            for example in examples
        ]


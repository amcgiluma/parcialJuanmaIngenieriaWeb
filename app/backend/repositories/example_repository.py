"""
Repository para operaciones de base de datos con Examples.

Implementa el patrón Repository para encapsular la lógica de acceso a datos.
Plantilla genérica para adaptar según las entidades del examen.
"""
from datetime import datetime
from bson import ObjectId
from models.example import ExampleModel

class ExampleRepository:
    """
    Repository para gestionar examples en MongoDB.
    
    Proporciona métodos CRUD y de búsqueda sobre la colección de examples.
    """
    
    def __init__(self, database):
        """
        Inicializa el repository.
        
        Args:
            database: Instancia de la base de datos MongoDB
        """
        self.collection = database.examples
    
    async def create(self, example_data: dict) -> ExampleModel:
        """
        Crea un nuevo example en la base de datos.
        
        Args:
            example_data: Diccionario con los datos
            
        Returns:
            ExampleModel: Example creado con su ObjectId asignado
        """
        example_data["created_at"] = datetime.utcnow()
        example_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.insert_one(example_data)
        example_data["_id"] = result.inserted_id
        
        return ExampleModel(**example_data)
    
    async def find_by_id(self, example_id: str) -> ExampleModel | None:
        """
        Busca un example por su ID.
        
        Args:
            example_id: ID del example
            
        Returns:
            ExampleModel | None: Example encontrado o None
        """
        if not ObjectId.is_valid(example_id):
            return None
            
        example_data = await self.collection.find_one({"_id": ObjectId(example_id)})
        
        if example_data:
            return ExampleModel(**example_data)
        return None
    
    async def find_all(self) -> list[ExampleModel]:
        """
        Obtiene todos los examples.
        
        Returns:
            list[ExampleModel]: Lista de todos los examples
        """
        examples = []
        cursor = self.collection.find({})
        
        async for example_data in cursor:
            examples.append(ExampleModel(**example_data))
        
        return examples
    
    async def update(self, example_id: str, update_data: dict) -> ExampleModel | None:
        """
        Actualiza un example existente.
        
        Args:
            example_id: ID del example
            update_data: Diccionario con los campos a actualizar
            
        Returns:
            ExampleModel | None: Example actualizado o None si no existe
        """
        if not ObjectId.is_valid(example_id):
            return None
        
        update_data = {k: v for k, v in update_data.items() if v is not None}
        
        if not update_data:
            return await self.find_by_id(example_id)
        
        update_data["updated_at"] = datetime.utcnow()
        
        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(example_id)},
            {"$set": update_data},
            return_document=True
        )
        
        if result:
            return ExampleModel(**result)
        return None
    
    async def delete(self, example_id: str) -> bool:
        """
        Elimina un example.
        
        Args:
            example_id: ID del example
            
        Returns:
            bool: True si se eliminó, False
        """
        if not ObjectId.is_valid(example_id):
            return False
        
        result = await self.collection.delete_one({"_id": ObjectId(example_id)})
        return result.deleted_count > 0
    
    # BÚSQUEDA PARAMETRIZADA 1: Por nombre
    async def find_by_name(self, name: str) -> list[ExampleModel]:
        """
        Busca examples por nombre (búsqueda parcial).
        
        Args:
            name: Nombre a buscar
            
        Returns:
            list[ExampleModel]: Examples que coinciden
        """
        examples = []
        cursor = self.collection.find({
            "name": {"$regex": name, "$options": "i"}
        })
        
        async for example_data in cursor:
            examples.append(ExampleModel(**example_data))
        
        return examples


"""
Repositorio de Reseñas.
Maneja todas las operaciones de base de datos para reseñas.
"""
from models.review import Review
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase


class ReviewRepository:
    """
    Repositorio para operaciones CRUD de reseñas en MongoDB.
    """

    def __init__(self, db: AsyncIOMotorDatabase):
        """
        Inicializa el repositorio con la conexión a la base de datos.
        
        Args:
            db: Instancia de la base de datos MongoDB
        """
        self.collection = db["reviews"]

    async def create(self, review: Review) -> Review:
        """
        Crea una nueva reseña en la base de datos.
        
        Args:
            review: Objeto Review a insertar
            
        Returns:
            Review: La reseña creada con su ID asignado
        """
        review_dict = review.model_dump(by_alias=True, exclude={"id"})
        result = await self.collection.insert_one(review_dict)
        review.id = str(result.inserted_id)
        return review

    async def get_all(self) -> list[Review]:
        """
        Obtiene todas las reseñas de la base de datos.
        
        Returns:
            list[Review]: Lista de todas las reseñas
        """
        cursor = self.collection.find({})
        reviews = await cursor.to_list(length=1000)
        
        # CRÍTICO: Convertir ObjectId a string antes de crear modelos Pydantic
        for review in reviews:
            review["_id"] = str(review["_id"])
        
        return [Review(**review) for review in reviews]

    async def get_by_id(self, review_id: str) -> Review | None:
        """
        Obtiene una reseña por su ID.
        
        Args:
            review_id: ID de la reseña a buscar
            
        Returns:
            Review | None: La reseña encontrada o None si no existe
        """
        try:
            review = await self.collection.find_one({"_id": ObjectId(review_id)})
            if review:
                review["_id"] = str(review["_id"])
                return Review(**review)
            return None
        except Exception:
            return None

    async def get_by_user(self, user_email: str) -> list[Review]:
        """
        Obtiene todas las reseñas de un usuario específico.
        
        Args:
            user_email: Email del usuario
            
        Returns:
            list[Review]: Lista de reseñas del usuario
        """
        cursor = self.collection.find({"user_email": user_email})
        reviews = await cursor.to_list(length=1000)
        
        for review in reviews:
            review["_id"] = str(review["_id"])
        
        return [Review(**review) for review in reviews]

    async def update(self, review_id: str, update_data: dict) -> Review | None:
        """
        Actualiza una reseña existente.
        
        Args:
            review_id: ID de la reseña a actualizar
            update_data: Diccionario con los campos a actualizar
            
        Returns:
            Review | None: La reseña actualizada o None si no existe
        """
        try:
            result = await self.collection.find_one_and_update(
                {"_id": ObjectId(review_id)},
                {"$set": update_data},
                return_document=True
            )
            if result:
                result["_id"] = str(result["_id"])
                return Review(**result)
            return None
        except Exception:
            return None

    async def delete(self, review_id: str) -> bool:
        """
        Elimina una reseña de la base de datos.
        
        Args:
            review_id: ID de la reseña a eliminar
            
        Returns:
            bool: True si se eliminó correctamente, False si no
        """
        try:
            result = await self.collection.delete_one({"_id": ObjectId(review_id)})
            return result.deleted_count > 0
        except Exception:
            return False

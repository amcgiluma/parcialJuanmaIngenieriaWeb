"""
Modelo de Example para MongoDB.

Define la estructura de datos que se almacena en la base de datos.
Plantilla genérica para adaptar según las entidades del examen.
"""
from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field, ConfigDict
from pydantic_core import core_schema
from bson import ObjectId

class PyObjectId(ObjectId):
    """
    Custom ObjectId para Pydantic v2.
    
    Permite usar ObjectId de MongoDB con Pydantic v2.
    """
    
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler):
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.no_info_plain_validator_function(cls.validate),
        ])
    
    @classmethod
    def validate(cls, v):
        """Valida y convierte el valor a ObjectId"""
        if isinstance(v, ObjectId):
            return v
        if isinstance(v, str) and ObjectId.is_valid(v):
            return ObjectId(v)
        raise ValueError("Invalid ObjectId")
    
    @classmethod
    def __get_pydantic_json_schema__(cls, schema, handler):
        return {"type": "string"}

class ExampleModel(BaseModel):
    """
    Modelo de Example en MongoDB.
    
    Representa un documento en la colección 'examples'.
    """
    id: PyObjectId | None = Field(alias="_id", default=None)
    name: str
    description: str | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )


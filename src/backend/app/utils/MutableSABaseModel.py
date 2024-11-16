"""
For enabling nested SQLModel objects as JSON fields:
https://github.com/fastapi/sqlmodel/issues/63#issuecomment-2357492459
"""

from typing import Any, Self
from pydantic import BaseModel as _BaseModel
from sqlalchemy import JSON, types
from sqlalchemy.ext.mutable import Mutable


class JsonPydanticField(types.TypeDecorator):
    impl = JSON

    def __init__(self, pydantic_model):
        super().__init__()
        self.pydantic_model = pydantic_model

    def load_dialect_impl(self, dialect):
        return dialect.type_descriptor(JSON())

    def process_bind_param(self, value: Any, _):
        if value is None:
            return None
        if isinstance(value, dict):
            return value
        return value.model_dump()

    def process_result_value(self, value, _):
        return self.pydantic_model.model_validate(value) if value is not None else None


class MutableSABaseModel(_BaseModel, Mutable):

    def __setattr__(self, name: str, value: Any) -> None:
        """Allows SQLAlchmey Session to track mutable behavior"""
        self.changed()
        return super().__setattr__(name, value)

    @classmethod
    def coerce(cls, key: str, value: Any) -> Self | None:
        """Convert JSON to pydantic model object allowing for mutable behavior"""
        if isinstance(value, cls) or value is None:
            return value

        if isinstance(value, str):
            return cls.model_validate_json(value)

        if isinstance(value, dict):
            return cls(**value)

        return super().coerce(key, value)

    @classmethod
    def to_sa_type(cls):
        return cls.as_mutable(JsonPydanticField(cls))

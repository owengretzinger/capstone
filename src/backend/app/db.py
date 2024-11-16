import os
from typing import AsyncGenerator

from sqlmodel import SQLModel
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from . import models
from sqlmodel.ext.asyncio.session import AsyncSession

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

async_engine = create_async_engine(DATABASE_URL, echo=True, future=True)


async def init_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all, checkfirst=True)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async_session = sessionmaker(
        bind=async_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session

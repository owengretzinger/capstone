from fastapi import APIRouter, Depends, HTTPException
from app.models import Bot
from app.models import BotCreate

from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

from app.db import get_session

router = APIRouter()


@router.post("/bots", response_model=Bot)
async def create_bot(data: BotCreate, session: AsyncSession = Depends(get_session)):
    """
    Create a bot.
    """
    bot = Bot(**data.model_dump())
    session.add(bot)
    await session.commit()
    await session.refresh(bot)
    return bot


@router.get("/bots", response_model=list[Bot])
async def get_bots(session: AsyncSession = Depends(get_session)):
    """
    Get all bots.
    """
    result = await session.exec(select(Bot))
    return result.all()


@router.get("/bots/{bot_id}", response_model=Bot)
async def get_bot(bot_id: int, session: AsyncSession = Depends(get_session)):
    """
    Get a specific bot by ID.
    """
    result = await session.exec(select(Bot).where(Bot.id == bot_id))
    bot = result.first()
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    return bot


@router.put("/bots/{bot_id}", response_model=Bot)
async def update_bot(
    bot_id: int, bot_update: BotCreate, session: AsyncSession = Depends(get_session)
):
    """Update a bot."""
    bot = await session.get(Bot, bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")

    bot_data = bot_update.model_dump(exclude_unset=True)
    for key, value in bot_data.items():
        setattr(bot, key, value)

    session.add(bot)
    await session.commit()
    await session.refresh(bot)
    return bot


@router.delete("/bots/{bot_id}")
async def delete_bot(bot_id: int, session: AsyncSession = Depends(get_session)):
    """Delete a bot."""
    bot = await session.get(Bot, bot_id)
    if not bot:
        raise HTTPException(status_code=404, detail="Bot not found")
    await session.delete(bot)
    await session.commit()
    return {"message": "Bot deleted successfully"}

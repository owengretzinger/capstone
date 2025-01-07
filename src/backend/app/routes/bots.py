from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.models import Bot, MeetingInfo
from app.models import BotCreate
import boto3
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession
import dotenv
import os
from app.db import get_session

dotenv.load_dotenv()

router = APIRouter()
client = boto3.client('s3', aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'), aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'), region_name=os.getenv('AWS_REGION'))

@router.post("/create_bot", response_model=Bot)
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
    
    key = bot.audio_s3_object_key

    audio_recording_url = client.generate_presigned_url(
        'get_object',
        Params={'Bucket': os.getenv('AWS_BUCKET_NAME'), 'Key': key},
        ExpiresIn=3600
    )

    bot.audio_recording_url = audio_recording_url # add the url to the bot object
    del bot.audio_s3_object_key # remove the key from the bot object

    return bot

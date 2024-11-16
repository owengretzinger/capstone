from fastapi import APIRouter, Depends, HTTPException
from app.models import User, UserCreate
from sqlmodel import select, delete
from sqlmodel.ext.asyncio.session import AsyncSession
from app.db import get_session

router = APIRouter()


@router.post("/create_user", response_model=User)
async def create_user(data: UserCreate, session: AsyncSession = Depends(get_session)):
    """Create a new user."""
    user = User(**data.model_dump())
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


@router.get("/users", response_model=list[User])
async def get_users(session: AsyncSession = Depends(get_session)):
    """Get all users."""
    result = await session.exec(select(User))
    return result.all()


@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: int, session: AsyncSession = Depends(get_session)):
    """Get a specific user by ID."""
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.delete("/users/{user_id}")
async def delete_user(user_id: int, session: AsyncSession = Depends(get_session)):
    """Delete a user."""
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    await session.delete(user)
    await session.commit()
    return {"message": "User deleted successfully"}


@router.put("/users/{user_id}", response_model=User)
async def update_user(
    user_id: int, user_update: UserCreate, session: AsyncSession = Depends(get_session)
):
    """Update a user."""
    user = await session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_update.dict(exclude_unset=True)
    for key, value in user_data.items():
        setattr(user, key, value)

    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user

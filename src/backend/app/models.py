from sqlalchemy import Column, text
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from app.utils.MutableSABaseModel import MutableSABaseModel


class UserBase(SQLModel):
    username: str
    email: str


class User(UserBase, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(
        default=None, primary_key=True, sa_column_kwargs={"autoincrement": True}
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")},
    )

    bots: List["Bot"] = Relationship(back_populates="user")


class UserCreate(UserBase):
    pass


class MeetingInfo(MutableSABaseModel):
    meeting_id: str
    meeting_password: Optional[str] = None
    organizer_id: Optional[str] = None
    tenant_id: Optional[str] = None
    message_id: Optional[str] = None
    thread_id: Optional[str] = None
    platform: str


MeetingInfoSAType = MeetingInfo.to_sa_type()


class BotBase(SQLModel):
    user_id: int
    meeting_info: MeetingInfo = Field(
        sa_column=Column(MeetingInfoSAType)
    )  # convert to JSON
    meeting_name: Optional[str]
    start_time: datetime
    end_time: datetime
    bot_display_name: Optional[str]
    bot_image: Optional[str]
    audio_s3_object_key: Optional[str]


class Bot(BotBase, table=True):
    __tablename__ = "bots"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")},
    )

    user: Optional["User"] = Relationship(back_populates="bots")
    events: List["Event"] = Relationship(back_populates="bot")


class BotCreate(BotBase):
    pass


class Event(SQLModel, table=True):
    __tablename__ = "events"

    id: Optional[int] = Field(default=None, primary_key=True)
    bot_id: int = Field(foreign_key="bots.id")
    event_type: str = Field(nullable=False)
    event_time: datetime = Field(nullable=False)
    details: Optional[str]
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        nullable=False,
        sa_column_kwargs={"server_default": text("CURRENT_TIMESTAMP")},
    )

    bot: Optional["Bot"] = Relationship(back_populates="events")

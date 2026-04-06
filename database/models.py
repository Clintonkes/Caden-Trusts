from typing import Optional
from sqlmodel import SQLModel, Field
from enum import Enum


class UserRole(str, Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"


class UserStatus(str, Enum):
    PENDING_VERIFICATION = "pending verification"
    OTP_VERIFIED = "OTP-verified"
    ACTIVE = "active"


class User(SQLModel, table=True):
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(index=True, unique=True)
    name: str
    hashed_password: str
    role: str = Field(default=UserRole.CUSTOMER.value)
    status: str = Field(default=UserStatus.PENDING_VERIFICATION.value)
    otp_code: Optional[str] = Field(default=None)
    account_number: Optional[str] = Field(default=None)
    balance: float = Field(default=25000.00)
    created_at: Optional[str] = Field(default=None)
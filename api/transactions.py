import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlmodel import select, Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from dotenv import load_dotenv

from database.connection import get_db
from database.models import User, UserRole, UserStatus
from auth_utils import decode_token

load_dotenv()

router = APIRouter(prefix="/api/transactions", tags=["Transactions"])


class TransactionResponse(BaseModel):
    id: int
    type: str
    amount: float
    description: str
    date: str
    status: str


@router.get("/")
async def get_transactions(
    session: Session = Depends(get_db),
    token: str = None
):
    """Get all transactions for the current user."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided"
        )
    
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    transactions = [
        {"id": 1, "type": "deposit", "amount": 5000, "description": "Salary Deposit", "date": "2026-04-01", "status": "completed"},
        {"id": 2, "type": "transfer", "amount": -250, "description": "Transfer to John", "date": "2026-04-02", "status": "completed"},
        {"id": 3, "type": "bill", "amount": -150, "description": "Electricity Bill", "date": "2026-04-03", "status": "completed"},
        {"id": 4, "type": "withdrawal", "amount": -500, "description": "ATM Withdrawal", "date": "2026-04-04", "status": "completed"},
        {"id": 5, "type": "deposit", "amount": 1200, "description": "Freelance Payment", "date": "2026-04-05", "status": "completed"},
    ]
    
    return {"success": True, "transactions": transactions}


@router.post("/transfer")
async def transfer(
    recipient: str,
    amount: float,
    session: Session = Depends(get_db),
    token: str = None
):
    """Transfer money to another account."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided"
        )
    
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
    
    recipient_user = session.exec(select(User).where(User.account_number == recipient)).first()
    if not recipient_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient account not found"
        )
    
    user.balance -= amount
    recipient_user.balance += amount
    session.add(user)
    session.add(recipient_user)
    session.commit()
    
    return {"success": True, "message": f"Successfully transferred ${amount} to {recipient}"}


@router.post("/deposit")
async def deposit(
    amount: float,
    session: Session = Depends(get_db),
    token: str = None
):
    """Deposit money to account."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided"
        )
    
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user.balance += amount
    session.add(user)
    session.commit()
    
    return {"success": True, "message": f"Successfully deposited ${amount}", "newBalance": user.balance}


@router.post("/withdraw")
async def withdraw(
    amount: float,
    session: Session = Depends(get_db),
    token: str = None
):
    """Withdraw money from account."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided"
        )
    
    try:
        payload = decode_token(token)
        user_id = int(payload.get("sub"))
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user = session.exec(select(User).where(User.id == user_id)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if user.balance < amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient balance"
        )
    
    user.balance -= amount
    session.add(user)
    session.commit()
    
    return {"success": True, "message": f"Successfully withdrew ${amount}", "newBalance": user.balance}
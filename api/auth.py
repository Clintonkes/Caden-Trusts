import logging
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select, Session
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

from database.connection import get_db
from database.models import User, UserRole, UserStatus
from auth_utils import (
    get_password_hash,
    verify_password,
    create_access_token,
    generate_otp,
    generate_account_number,
    send_otp_email,
)

load_dotenv()

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class VerifyOtpRequest(BaseModel):
    email: EmailStr
    otp: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class ResendOtpRequest(BaseModel):
    email: EmailStr


@router.post("/register")
async def register(request: RegisterRequest, session: Session = Depends(get_db)):
    """Register a new user and send OTP."""
    existing = session.exec(select(User).where(User.email == request.email)).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    otp = generate_otp()
    account_number = generate_account_number()

    user = User(
        email=request.email,
        name=request.name,
        hashed_password=get_password_hash(request.password),
        role=UserRole.CUSTOMER.value,
        status=UserStatus.PENDING_VERIFICATION.value,
        otp_code=otp,
        account_number=account_number,
        balance=25000.00,
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    sent = await send_otp_email(request.email, otp)
    if not sent:
        logger.error("OTP email failed during register for %s", request.email)
        session.delete(user)
        session.commit()
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to send verification email. Please try again later."
        )

    return {"success": True, "message": "Registration successful. Please verify your email."}


@router.post("/verify-otp")
async def verify_otp(request: VerifyOtpRequest, session: Session = Depends(get_db)):
    """Verify user email with OTP code."""
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.otp_code != request.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code"
        )

    user.status = UserStatus.OTP_VERIFIED.value
    user.otp_code = None
    session.add(user)
    session.commit()
    session.refresh(user)

    return {"success": True, "message": "Email verified successfully"}


@router.post("/resend-otp")
async def resend_otp(request: ResendOtpRequest, session: Session = Depends(get_db)):
    """Resend OTP to user email for account verification."""
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.status == UserStatus.ACTIVE.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is already verified"
        )

    otp = generate_otp()
    user.otp_code = otp
    user.status = UserStatus.PENDING_VERIFICATION.value
    session.add(user)
    session.commit()

    sent = await send_otp_email(user.email, otp)
    if not sent:
        logger.error("OTP email failed during resend for %s", user.email)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to send verification email. Please try again later."
        )

    return {"success": True, "message": "New OTP sent to your email"}


@router.post("/resend-login-otp")
async def resend_login_otp(request: ResendOtpRequest, session: Session = Depends(get_db)):
    """Resend OTP for login verification."""
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.status != UserStatus.LOGIN_OTP_REQUIRED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login OTP is not required for this account"
        )

    otp = generate_otp()
    user.otp_code = otp
    session.add(user)
    session.commit()

    sent = await send_otp_email(user.email, otp)
    if not sent:
        logger.error("Login OTP email failed during resend for %s", user.email)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Unable to send login code. Please try again later."
        )

    return {"success": True, "message": "Login OTP sent to your email"}


@router.post("/verify-login-otp")
async def verify_login_otp(request: VerifyOtpRequest, session: Session = Depends(get_db)):
    """Verify login OTP and issue token."""
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    if user.status != UserStatus.LOGIN_OTP_REQUIRED.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Login OTP not required"
        )

    if user.otp_code != request.otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid OTP code"
        )

    user.status = UserStatus.ACTIVE.value
    user.otp_code = None
    session.add(user)
    session.commit()
    session.refresh(user)

    token = create_access_token(
        data={"sub": str(user.id), "email": user.email, "role": user.role}
    )

    return {
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "accountNumber": user.account_number,
            "balance": user.balance,
        },
    }


@router.post("/login")
async def login(request: LoginRequest, session: Session = Depends(get_db)):
    """Login user and return token or require OTP."""
    user = session.exec(select(User).where(User.email == request.email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if user.status == UserStatus.PENDING_VERIFICATION.value:
        otp = generate_otp()
        user.otp_code = otp
        session.add(user)
        session.commit()
        sent = await send_otp_email(user.email, otp)
        if not sent:
            logger.error("OTP email failed during login for %s", user.email)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to send verification email. Please try again later.",
            )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account not verified. A new OTP has been sent to your email.",
        )

    if user.status == UserStatus.OTP_VERIFIED.value:
        user.status = UserStatus.ACTIVE.value
        session.add(user)
        session.commit()
        session.refresh(user)

    if user.status == UserStatus.LOGIN_OTP_REQUIRED.value:
        otp = generate_otp()
        user.otp_code = otp
        session.add(user)
        session.commit()
        sent = await send_otp_email(user.email, otp)
        if not sent:
            logger.error("Login OTP email failed during login for %s", user.email)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to send login code. Please try again later.",
            )
        return {
            "success": False,
            "requiresOtp": True,
            "message": "Login code sent to your email",
        }

    if user.status == UserStatus.ACTIVE.value:
        otp = generate_otp()
        user.otp_code = otp
        user.status = UserStatus.LOGIN_OTP_REQUIRED.value
        session.add(user)
        session.commit()
        sent = await send_otp_email(user.email, otp)
        if not sent:
            logger.error("Login OTP email failed during login for %s", user.email)
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to send login code. Please try again later.",
            )
        return {
            "success": False,
            "requiresOtp": True,
            "message": "Login code sent to your email",
        }

    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Unable to complete login"
    )


@router.get("/me")
async def get_current_user(session: Session = Depends(get_db), token: str = None):
    """Get current user from token."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No token provided"
        )

    from auth_utils import decode_token
    try:
        payload = decode_token(token)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        user = session.exec(select(User).where(User.id == int(user_id))).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "accountNumber": user.account_number,
            "balance": user.balance,
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )

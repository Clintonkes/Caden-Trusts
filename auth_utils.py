import logging
import os
import random
import string
from datetime import datetime, timedelta
from typing import Optional

import jwt
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

logger = logging.getLogger(__name__)

SECRET_KEY = os.getenv("JWT_SECRET", "your-jwt-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def generate_otp() -> str:
    return "".join(random.choices(string.digits, k=6))


def generate_account_number() -> str:
    return "".join(random.choices(string.digits, k=10))


def decode_token(token: str) -> dict:
    """Decode and verify a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired")
    except jwt.InvalidTokenError:
        raise Exception("Invalid token")


def seed_admin() -> None:
    try:
        from sqlmodel import Session, select
        from database.connection import engine
        from database.models import User, UserRole, UserStatus
    except Exception as exc:
        logger.exception("Failed to import admin seed dependencies: %s", exc)
        return

    admin_email = os.getenv("ADMIN_EMAIL", "admin@caden.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "Admin123!")
    admin_name = os.getenv("ADMIN_NAME", "Admin User")

    try:
        with Session(engine) as session:
            existing_admin = session.exec(select(User).where(User.email == admin_email)).first()
            if existing_admin:
                return

            admin_user = User(
                email=admin_email,
                name=admin_name,
                hashed_password=get_password_hash(admin_password),
                role=UserRole.ADMIN.value,
                status=UserStatus.ACTIVE.value,
                account_number=generate_account_number(),
                balance=0.0,
                created_at=datetime.utcnow().isoformat(),
            )
            session.add(admin_user)
            session.commit()
    except Exception as exc:
        logger.exception("Failed to seed admin user: %s", exc)


async def send_otp_email(email: str, otp: str) -> bool:
    resend_api_key = os.getenv("RESEND_API_KEY")
    resend_from_email = os.getenv("RESEND_FROM_EMAIL")

    if not resend_api_key or not resend_from_email:
        logger.info("[DEV MODE] OTP for %s: %s", email, otp)
        return True

    try:
        import resend

        resend.api_key = resend_api_key
        resend.Emails.send({
            "from": resend_from_email,
            "to": [email],
            "subject": "Caden Trusts - Your Verification Code",
            "html": f"""
            <html>
            <body>
                <h2>Caden Trusts - Email Verification</h2>
                <p>Your verification code is: <strong>{otp}</strong></p>
                <p>This code will expire in 10 minutes.</p>
                <p>If you did not request this code, please ignore this email.</p>
            </body>
            </html>
            """,
        })
        return True
    except Exception as e:
        logger.exception("Failed to send OTP email via Resend (from=%s): %s", resend_from_email, e)
        return False

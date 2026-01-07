"""Verification Router for Quick Verification Hub.

Provides endpoints for verifying:
- Phone numbers
- Bank accounts
- Social media profiles
"""

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from slowapi import Limiter
from slowapi.util import get_remote_address
from datetime import datetime

from ..services.verification_service import get_verification_service
from ..core.logger import get_logger

# Initialize router
router = APIRouter(prefix="/api/v2", tags=["Verification"])
limiter = Limiter(key_func=get_remote_address)
logger = get_logger(__name__)

# Initialize service
verification_service = get_verification_service()


# ==================== Request/Response Models ====================

class PhoneVerificationRequest(BaseModel):
    """Request model for phone verification."""

    phone: str = Field(..., min_length=9, max_length=15, description="Phone number to verify")
    user_id: Optional[str] = Field(None, description="User ID for tracking")


class PhoneVerificationResponse(BaseModel):
    """Response model for phone verification."""

    phone: str = Field(..., description="Normalized phone number")
    is_blacklisted: bool = Field(..., description="Whether phone is blacklisted")
    is_safe: bool = Field(..., description="Whether phone is safe to contact")
    reports_count: int = Field(..., description="Number of scam reports")
    risk_level: str = Field(..., description="Risk level: LOW, MEDIUM, HIGH, CRITICAL")
    last_reported: Optional[str] = Field(None, description="Last report date")
    categories: Optional[Dict[str, int]] = Field(None, description="Report categories breakdown")
    timestamp: datetime = Field(default_factory=datetime.now, description="Verification timestamp")


class BankVerificationRequest(BaseModel):
    """Request model for bank account verification."""

    account_number: str = Field(..., min_length=8, max_length=15, description="Bank account number")
    bank_code: str = Field(..., description="Bank code (KBANK, SCB, BBL, etc.)")
    user_id: Optional[str] = Field(None, description="User ID for tracking")


class BankVerificationResponse(BaseModel):
    """Response model for bank verification."""

    account_number: str = Field(..., description="Normalized account number")
    bank_code: str = Field(..., description="Bank code")
    is_blacklisted: bool = Field(..., description="Whether account is blacklisted")
    is_safe: bool = Field(..., description="Whether account is safe")
    reports_count: int = Field(..., description="Number of reports")
    risk_level: str = Field(..., description="Risk level: LOW, MEDIUM, HIGH, CRITICAL")
    account_name: Optional[str] = Field(None, description="Account holder name (if blacklisted)")
    category: Optional[str] = Field(None, description="Fraud category (if blacklisted)")
    format_valid: Optional[bool] = Field(None, description="Whether format is valid")
    timestamp: datetime = Field(default_factory=datetime.now, description="Verification timestamp")


class SocialVerificationRequest(BaseModel):
    """Request model for social profile verification."""

    profile_url: str = Field(..., description="Social media profile URL")
    platform: str = Field(default="auto", description="Platform (facebook, instagram, line, twitter, auto)")
    user_id: Optional[str] = Field(None, description="User ID for tracking")


class SocialVerificationResponse(BaseModel):
    """Response model for social profile verification."""

    profile_url: str = Field(..., description="Profile URL")
    platform: str = Field(..., description="Detected platform")
    is_valid_url: bool = Field(..., description="Whether URL format is valid")
    is_safe: bool = Field(..., description="Whether profile appears safe")
    risk_score: int = Field(..., ge=0, le=100, description="Risk score (0-100)")
    warnings: List[str] = Field(default_factory=list, description="Warning messages")
    recommendations: List[str] = Field(default_factory=list, description="Safety recommendations")
    timestamp: datetime = Field(default_factory=datetime.now, description="Verification timestamp")


# ==================== Endpoints ====================

@router.post("/verify-phone", response_model=PhoneVerificationResponse)
@limiter.limit("100/minute")
async def verify_phone(http_request: Request, request: PhoneVerificationRequest):
    """
    Verify a phone number against blacklist database.

    **Features:**
    - Checks phone number against community reports
    - Returns blacklist status and report count
    - Calculates risk level based on reports
    - Shows report categories (loan shark, scam call, etc.)

    **Input:**
    - phone: Phone number (any format: +66812345678, 081-234-5678, 0812345678)
    - user_id: Optional user identifier

    **Output:**
    - is_blacklisted: Whether phone is in blacklist
    - is_safe: Whether it's safe to contact
    - reports_count: Number of scam reports
    - risk_level: LOW, MEDIUM, HIGH, CRITICAL
    - categories: Breakdown of report types

    **Example:**
    ```json
    POST /api/v2/verify-phone
    {
        "phone": "0812345678"
    }

    Response:
    {
        "phone": "0812345678",
        "is_blacklisted": true,
        "is_safe": false,
        "reports_count": 12,
        "risk_level": "HIGH",
        "categories": {
            "loan_shark": 5,
            "scam_call": 7
        }
    }
    ```
    """
    try:
        logger.info(f"🔍 Verifying phone: {request.phone}")

        # Verify phone
        result = verification_service.verify_phone(request.phone)

        return PhoneVerificationResponse(
            phone=result["phone"],
            is_blacklisted=result["is_blacklisted"],
            is_safe=result["is_safe"],
            reports_count=result["reports_count"],
            risk_level=result["risk_level"],
            last_reported=result["last_reported"],
            categories=result["categories"],
            timestamp=datetime.now()
        )

    except Exception as e:
        logger.error(f"❌ Phone verification failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Phone verification failed: {str(e)}"
        )


@router.post("/verify-bank", response_model=BankVerificationResponse)
@limiter.limit("100/minute")
async def verify_bank(http_request: Request, request: BankVerificationRequest):
    """
    Verify a bank account against blacklist database.

    **Features:**
    - Checks account against mule account database
    - Validates account number format
    - Returns blacklist status and details
    - Shows account holder name (if blacklisted)

    **Input:**
    - account_number: Bank account number (any format)
    - bank_code: Bank code (KBANK, SCB, BBL, KTB, TMB, etc.)
    - user_id: Optional user identifier

    **Output:**
    - is_blacklisted: Whether account is known mule account
    - is_safe: Whether it's safe to transfer
    - reports_count: Number of reports
    - risk_level: LOW, MEDIUM, HIGH, CRITICAL
    - account_name: Account holder name (if blacklisted)
    - format_valid: Whether format is valid

    **Example:**
    ```json
    POST /api/v2/verify-bank
    {
        "account_number": "123-4-56789-0",
        "bank_code": "KBANK"
    }

    Response:
    {
        "account_number": "1234567890",
        "bank_code": "KBANK",
        "is_blacklisted": true,
        "is_safe": false,
        "reports_count": 15,
        "risk_level": "HIGH",
        "account_name": "นายสมชาย ขายของโกง",
        "category": "Mule Account"
    }
    ```

    **Note:** For MVP, real data for blacklisted accounts, basic validation for others.
    """
    try:
        logger.info(f"🏦 Verifying bank account: {request.account_number} ({request.bank_code})")

        # Verify bank account
        result = verification_service.verify_bank(
            account_number=request.account_number,
            bank_code=request.bank_code
        )

        return BankVerificationResponse(
            account_number=result["account_number"],
            bank_code=result["bank_code"],
            is_blacklisted=result["is_blacklisted"],
            is_safe=result["is_safe"],
            reports_count=result["reports_count"],
            risk_level=result["risk_level"],
            account_name=result.get("account_name"),
            category=result.get("category"),
            format_valid=result.get("format_valid"),
            timestamp=datetime.now()
        )

    except Exception as e:
        logger.error(f"❌ Bank verification failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Bank verification failed: {str(e)}"
        )


@router.post("/verify-social", response_model=SocialVerificationResponse)
@limiter.limit("100/minute")
async def verify_social(http_request: Request, request: SocialVerificationRequest):
    """
    Verify a social media profile URL.

    **Features:**
    - Validates URL format
    - Detects platform (Facebook, Instagram, LINE, Twitter, etc.)
    - Checks for suspicious patterns
    - Provides safety recommendations

    **Input:**
    - profile_url: Social media profile URL
    - platform: Platform name (auto-detect if not specified)
    - user_id: Optional user identifier

    **Output:**
    - platform: Detected platform
    - is_valid_url: Whether URL is valid
    - is_safe: Whether profile appears legitimate
    - risk_score: Risk score 0-100
    - warnings: List of warnings
    - recommendations: Safety tips

    **Example:**
    ```json
    POST /api/v2/verify-social
    {
        "profile_url": "https://facebook.com/user123",
        "platform": "auto"
    }

    Response:
    {
        "profile_url": "https://facebook.com/user123",
        "platform": "facebook",
        "is_valid_url": true,
        "is_safe": true,
        "risk_score": 0,
        "warnings": [],
        "recommendations": ["Profile appears legitimate"]
    }
    ```

    **Note:** MVP provides basic URL validation. Full profile analysis in Phase 2.
    """
    try:
        logger.info(f"👤 Verifying social profile: {request.profile_url}")

        # Verify social profile
        result = verification_service.verify_social(
            profile_url=request.profile_url,
            platform=request.platform
        )

        return SocialVerificationResponse(
            profile_url=result["profile_url"],
            platform=result["platform"],
            is_valid_url=result["is_valid_url"],
            is_safe=result["is_safe"],
            risk_score=result["risk_score"],
            warnings=result["warnings"],
            recommendations=result["recommendations"],
            timestamp=datetime.now()
        )

    except Exception as e:
        logger.error(f"❌ Social verification failed: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Social verification failed: {str(e)}"
        )


# Export router
__all__ = ["router"]

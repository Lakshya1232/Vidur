from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel,Field, field_validator
from fastapi.middleware.cors import CORSMiddleware
from mockdata import services 
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
from models import GrievanceDB, ApplicationDB, UserDB,ApplicationStatusHistoryDB
from datetime import datetime,timedelta,timezone
import jwt
import re
import random
from pwdlib import PasswordHash
from sqlalchemy.exc import IntegrityError
import os
import resend
from dotenv import load_dotenv


from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

print("RESEND KEY LOADED:", bool(os.getenv("RESEND_API_KEY")))

password_hash = PasswordHash.recommended()
SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY is not set in .env")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

print("Tables detected:", Base.metadata.tables.keys())

Base.metadata.create_all(bind=engine)

UserDB.__table__.create(bind=engine, checkfirst=True)

security = HTTPBearer()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user = db.query(UserDB).filter(
        UserDB.id == user_id
    ).first()

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user




app = FastAPI(
    title="Vidur AI Backend",
    description="Backend API for Vidur AI",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return{
        "message": "Welcome to Vidur AI Backend"
    }


@app.get("/profile")
def get_profile(current_user: UserDB = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }

@app.get("/health")
def health():
    return{
        "status": "healthy"
    }

@app.get("/services")
def get_services():
    return services

@app.get("/services/{service_id}")
def get_service(service_id: str):
    for service in services:
        if str(service["id"]) == service_id:
            return service

    return {"error": "Service not found"}


class Grievance(BaseModel):
    serviceId: str
    serviceName: str
    issue: str
    description: str
    department: str
    category: str
    state: str
    district: str
    cityVillage: str
    landmark: str
    priority: str
    attachments: list[dict]

class Application(BaseModel):
    serviceId: str
    serviceName: str
    department: str
    category: str

    applicantName: str
    state: str
    district: str

    applicationData: dict

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str = Field(min_length=8, max_length=128)

    @field_validator("password")
    @classmethod
    def validate_password(cls, password: str):

        if password != password.strip():
            raise ValueError("Password must not start or end with spaces")

        if not re.search(r"[A-Z]", password):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[a-z]", password):
            raise ValueError("Password must contain at least one lowercase letter")

        if not re.search(r"\d", password):
            raise ValueError("Password must contain at least one number")

        if not re.search(r"[^A-Za-z0-9]", password):
            raise ValueError("Password must contain at least one special character")

        return password

class LoginRequest(BaseModel):
    email: str
    password: str


@app.post("/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    normalized_email = data.email.strip().lower()

    user = db.query(UserDB).filter(
        UserDB.email == normalized_email
    ).first()

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    password_valid = password_hash.verify(
        data.password,
        user.password_hash
    )

    if not password_valid:
        return {
            "success": False,
            "message": "Invalid email or password"
        }

    token_data = {
        "user_id": user.id,
        "email": user.email,
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
    }

    access_token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "success": True,
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }

def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(to_email: str, otp: str):
    params = {
        "from": "onboarding@resend.dev",
        "to": [to_email],
        "subject": "Your Vidur Email Verification OTP",
        "html": f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
            <h2 style="color: #b8863b;">VIDUR</h2>

            <p>Hello,</p>

            <p>
                Your OTP for verifying your Vidur account is:
            </p>

            <div style="
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                padding: 20px;
                background: #f5f5f5;
                text-align: center;
                margin: 20px 0;
            ">
                {otp}
            </div>

            <p>
                This OTP is valid for <strong>5 minutes</strong>.
            </p>

            <p>
                If you did not request this verification, you can ignore this email.
            </p>

            <hr>

            <p style="color: #777; font-size: 12px;">
                Vidur — AI-Powered Citizen Service Platform
            </p>
        </div>
        """
    }

    email = resend.Emails.send(params)

    print("OTP email sent:", email)


@app.get("/test-email")
def test_email():

    return {
        "success": True,
        "message": "Test email request sent"
    }


@app.post("/auth/signup")
def signup(data: SignupRequest, db: Session = Depends(get_db)):
    normalized_email = data.email.strip().lower()
    existing_user = db.query(UserDB).filter(
        UserDB.email == normalized_email
    ).first()

    if existing_user:
        return {
            "success": False,
            "message": "Email already registered"
        }

    hashed_password = password_hash.hash(data.password)
    otp = generate_otp()
    new_user = UserDB(
        name=data.name,
        email=normalized_email,
        password_hash=hashed_password,
        role="citizen",
        email_verified=False,
        otp_code=otp,
        otp_expires_at=datetime.now() + timedelta(minutes=5)
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        send_otp_email(normalized_email, otp)

    except Exception as e:
        db.rollback()

        if new_user.id:
            db.query(UserDB).filter(
                UserDB.id == new_user.id
            ).delete(synchronize_session=False)
            db.commit()

        print("Signup email error:", e)

        raise HTTPException(
            status_code=500,
            detail="Unable to send verification email. Please try again."
        )

    return {
        "success": True,
        "message": "Account created successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


class VerifyOTPRequest(BaseModel):
    email: str
    otp: str

class ResendOTPRequest(BaseModel):
    email: str


@app.post("/auth/verify-otp")
def verify_otp(
    data: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    normalized_email = data.email.strip().lower()
    user = db.query(UserDB).filter(
        UserDB.email == normalized_email
    ).first()

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    if user.email_verified:
        return {
            "success": False,
            "message": "Email already verified"
        }

    if not user.otp_code:
        return {
            "success": False,
            "message": "No OTP found"
        }

    if user.otp_expires_at < datetime.now():
        return {
            "success": False,
            "message": "OTP has expired"
        }

    if user.otp_code != data.otp:
        return {
            "success": False,
            "message": "Invalid OTP"
        }

    # OTP is correct
    user.email_verified = True
    user.otp_code = None
    user.otp_expires_at = None

    db.commit()

    return {
        "success": True,
        "message": "Email verified successfully"
    }

@app.post("/auth/resend-otp")
def resend_otp(
    data: ResendOTPRequest,
    db: Session = Depends(get_db)
):
    normalized_email = data.email.strip().lower()
    user = db.query(UserDB).filter(
        UserDB.email == normalized_email
    ).first()

    if not user:
        return {
            "success": False,
            "message": "User not found"
        }

    if user.email_verified:
        return {
            "success": False,
            "message": "Email already verified"
        }

    new_otp = generate_otp()

    user.otp_code = new_otp
    user.otp_expires_at = datetime.now() + timedelta(minutes=5)

    db.commit()

    send_otp_email(normalized_email, new_otp)

    return {
        "success": True,
        "message": "New OTP sent successfully"
    }

@app.post("/grievances")
def create_grievance(
    grievance: Grievance,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    existing_ids = db.query(GrievanceDB.id).all()

    used_numbers = []

    for row in existing_ids:
        try:
            used_numbers.append(int(row[0].replace("GRV-", "")))
        except (ValueError, AttributeError):
            pass

    next_number = max(used_numbers, default=0) + 1

    grievance_id = f"GRV-{next_number:04d}"
    print("DEBUG EXISTING IDS:", existing_ids)
    print("DEBUG GENERATED GRIEVANCE ID:", grievance_id)
    print("DEBUG USER ID:", current_user.id)

    now = datetime.now()
    deadline = now + timedelta(days=7) 

    new_grievance = GrievanceDB(
        id=grievance_id,
        user_id=current_user.id,
        serviceId=grievance.serviceId,
        serviceName=grievance.serviceName,
        issue=grievance.issue,
        description=grievance.description,
        department=grievance.department,
        category=grievance.category,
        state=grievance.state,
        district=grievance.district,
        cityVillage=grievance.cityVillage,
        landmark=grievance.landmark,
        priority=grievance.priority,
        status="Submitted",
        submittedAt=now,
        updatedAt=now,
        deadlineAt=deadline
    )

    db.add(new_grievance)
    db.commit()
    db.refresh(new_grievance)

    return {
        "id": new_grievance.id,
        "serviceId": new_grievance.serviceId,
        "serviceName": new_grievance.serviceName,
        "issue": new_grievance.issue,
        "description": new_grievance.description,
        "department": new_grievance.department,
        "category": new_grievance.category,
        "state": new_grievance.state,
        "district": new_grievance.district,
        "cityVillage": new_grievance.cityVillage,
        "landmark": new_grievance.landmark,
        "priority": new_grievance.priority,
        "status": new_grievance.status,
        "submittedAt": new_grievance.submittedAt,
        "updatedAt": new_grievance.updatedAt,
        "deadlineAt": new_grievance.deadlineAt,
        "timeline": [
            {
                "status": "Submitted",
                "description": "Grievance submitted successfully",
                "completed": True
            },
            {
                "status": "Under Review",
                "description": "Grievance is waiting for department review",
                "completed": False
            },
            {
                "status": "In Progress",
                "description": "Department is working on the grievance",
                "completed": False
            },
            {
                "status": "Resolved",
                "description": "Grievance has been resolved",
                "completed": False
            }
        ]
    }

@app.get("/grievances")
def get_my_grievances(
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    grievances = db.query(GrievanceDB).filter(
        GrievanceDB.user_id == current_user.id
    ).all()

    return [
        {
            "id": grievance.id,
            "serviceId": grievance.serviceId,
            "serviceName": grievance.serviceName,
            "issue": grievance.issue,
            "description": grievance.description,
            "department": grievance.department,
            "category": grievance.category,
            "state": grievance.state,
            "district": grievance.district,
            "cityVillage": grievance.cityVillage,
            "landmark": grievance.landmark,
            "priority": grievance.priority,
            "status": grievance.status,
            "createdAt": grievance.submittedAt,
            "submittedAt": grievance.submittedAt,
            "updatedAt": grievance.updatedAt, 
            "deadlineAt": (
                grievance.deadlineAt
                if grievance.deadlineAt
                else grievance.submittedAt + timedelta(days=7)
            )
        }
        for grievance in grievances
    ]


@app.get("/grievances/{grievance_id}")
def get_grievance(
    grievance_id: str,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    grievance = db.query(GrievanceDB).filter(
    GrievanceDB.id == grievance_id,
    GrievanceDB.user_id == current_user.id
).first()

    if not grievance:
        return {"error": "Grievance not found"}

    return {
        "id": grievance.id,
        "serviceId": grievance.serviceId,
        "serviceName": grievance.serviceName,
        "issue": grievance.issue,
        "description": grievance.description,
        "department": grievance.department,
        "category": grievance.category,
        "state": grievance.state,
        "district": grievance.district,
        "cityVillage": grievance.cityVillage,
        "landmark": grievance.landmark,
        "priority": grievance.priority,
        "status": grievance.status,
        "createdAt": grievance.submittedAt,
        "submittedAt": grievance.submittedAt,
        "updatedAt": grievance.updatedAt,
        "deadlineAt": (
            grievance.deadlineAt
            if grievance.deadlineAt
            else grievance.submittedAt + timedelta(days=7)
        ),
        "timeline": [
            {
                "status": "Submitted",
                "description": "Grievance submitted successfully",
                "completed": True
            },
            {
                "status": "Under Review",
                "description": "Grievance is waiting for department review",
                "completed": False
            },
            {
                "status": "In Progress",
                "description": "Department is working on the grievance",
                "completed": False
            },
            {
                "status": "Resolved",
                "description": "Grievance has been resolved",
                "completed": False
            }
        ]
    }

    return {"error": "Grievance not found"}

@app.post("/applications")
def create_application(
    application: Application,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    application_id = f"APP-{db.query(ApplicationDB).count() + 1:04d}"
    now = datetime.now()

    new_application = ApplicationDB(
        id=application_id,
        user_id=current_user.id,
        serviceId=application.serviceId,
        serviceName=application.serviceName,
        department=application.department,
        category=application.category,
        applicantName=application.applicantName,
        state=application.state,
        district=application.district,
        applicationData=application.applicationData,
        status="Submitted",
        submittedAt=now,
        updatedAt=now
    )

    db.add(new_application)
    db.commit()
    db.refresh(new_application)

    status_history = ApplicationStatusHistoryDB(
        application_id=new_application.id,
        status="Submitted",
        updated_at=now
    )

    db.add(status_history)
    db.commit()

    return {
        "id": new_application.id,
        "serviceId": new_application.serviceId,
        "serviceName": new_application.serviceName,
        "department": new_application.department,
        "category": new_application.category,
        "applicantName": new_application.applicantName,
        "state": new_application.state,
        "district": new_application.district,
        "applicationData": new_application.applicationData,
        "status": new_application.status,
        "submittedAt": new_application.submittedAt,
        "updatedAt": new_application.updatedAt
    }

@app.get("/applications")
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    applications = db.query(ApplicationDB).filter(
        ApplicationDB.user_id == current_user.id
    ).all()

    return [
        {
            "id": application.id,
            "serviceId": application.serviceId,
            "serviceName": application.serviceName,
            "department": application.department,
            "category": application.category,
            "applicantName": application.applicantName,
            "state": application.state,
            "district": application.district,
            "applicationData": application.applicationData,
            "status": application.status,
            "submittedAt": application.submittedAt,
            "updatedAt": application.updatedAt
        }
        for application in applications
    ]

@app.get("/admin/applications")
def get_all_applications(
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    # Only admins can access all applications
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    applications = db.query(ApplicationDB).order_by(
        ApplicationDB.submittedAt.desc()
    ).all()

    return [
        {
            "id": application.id,
            "serviceId": application.serviceId,
            "serviceName": application.serviceName,
            "department": application.department,
            "category": application.category,
            "applicantName": application.applicantName,
            "state": application.state,
            "district": application.district,
            "applicationData": application.applicationData,
            "status": application.status,
            "submittedAt": application.submittedAt,
            "updatedAt": application.updatedAt
        }
        for application in applications
    ]

@app.get("/admin/grievances")
def get_all_grievances(
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    # Only admins can access all grievances
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    grievances = db.query(GrievanceDB).order_by(
        GrievanceDB.submittedAt.desc()
    ).all()

    return [
        {
            "id": grievance.id,
            "serviceId": grievance.serviceId,
            "serviceName": grievance.serviceName,
            "issue": grievance.issue,
            "description": grievance.description,
            "department": grievance.department,
            "category": grievance.category,
            "state": grievance.state,
            "district": grievance.district,
            "cityVillage": grievance.cityVillage,
            "landmark": grievance.landmark,
            "priority": grievance.priority,
            "status": grievance.status,
            "submittedAt": grievance.submittedAt,
            "updatedAt": grievance.updatedAt,
            "deadlineAt": (
                grievance.deadlineAt
                if grievance.deadlineAt
                else grievance.submittedAt + timedelta(days=7)
            ),
            "beforeImage": grievance.beforeImage,
            "afterImage": grievance.afterImage,
            "resolutionDescription": grievance.resolutionDescription,
            "resolvedAt": grievance.resolvedAt,
            "escalatedAt": grievance.escalatedAt
        }
        for grievance in grievances
    ]
class GrievanceResolution(BaseModel):
    beforeImage: str
    afterImage: str
    resolutionDescription: str


@app.put("/admin/grievances/{grievance_id}/resolve")
def resolve_grievance(
    grievance_id: str,
    data: GrievanceResolution,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    # Only admins can resolve grievances
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    grievance = db.query(GrievanceDB).filter(
        GrievanceDB.id == grievance_id
    ).first()

    if not grievance:
        raise HTTPException(
            status_code=404,
            detail="Grievance not found"
        )

    # Both images are mandatory
    if not data.beforeImage.strip():
        raise HTTPException(
            status_code=400,
            detail="Before-work image is required"
        )

    if not data.afterImage.strip():
        raise HTTPException(
            status_code=400,
            detail="After-work image is required"
        )

    if not data.resolutionDescription.strip():
        raise HTTPException(
            status_code=400,
            detail="Resolution description is required"
        )

    now = datetime.now()

    grievance.beforeImage = data.beforeImage
    grievance.afterImage = data.afterImage
    grievance.resolutionDescription = data.resolutionDescription
    grievance.status = "Resolved"
    grievance.resolvedAt = now
    grievance.updatedAt = now

    db.commit()
    db.refresh(grievance)

    return {
        "success": True,
        "message": "Grievance resolved successfully",
        "id": grievance.id,
        "status": grievance.status,
        "resolvedAt": grievance.resolvedAt
    }


@app.get("/applications/{application_id}")
def get_application(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    application = db.query(ApplicationDB).filter(
        ApplicationDB.id == application_id,
        ApplicationDB.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return {
        "id": application.id,
        "serviceId": application.serviceId,
        "serviceName": application.serviceName,
        "department": application.department,
        "category": application.category,
        "applicantName": application.applicantName,
        "state": application.state,
        "district": application.district,
        "applicationData": application.applicationData,
        "status": application.status,
        "submittedAt": application.submittedAt,
        "updatedAt": application.updatedAt
    }

@app.get("/applications/{application_id}/history")
def get_application_history(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    application = db.query(ApplicationDB).filter(
        ApplicationDB.id == application_id,
        ApplicationDB.user_id == current_user.id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    history = db.query(ApplicationStatusHistoryDB).filter(
        ApplicationStatusHistoryDB.application_id == application_id
    ).order_by(
        ApplicationStatusHistoryDB.updated_at.asc()
    ).all()

    return [
        {
            "status": item.status,
            "updated_at": item.updated_at
        }
        for item in history
    ]


class ApplicationStatusUpdate(BaseModel):
    status: str


@app.put("/applications/{application_id}/status")
def update_application_status(
    application_id: str,
    data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    # Only admin users can change application status
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Find the application
    application = db.query(ApplicationDB).filter(
        ApplicationDB.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    # Allowed application statuses
    allowed_statuses = [
        "Submitted",
        "Under Review",
        "Processing",
        "Approved",
        "Completed"
    ]

    if data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid application status"
        )

    # Update current application status
    application.status = data.status
    application.updatedAt = datetime.now()

    # Add status to history
    status_history = ApplicationStatusHistoryDB(
        application_id=application.id,
        status=data.status,
        updated_at=datetime.now()
    )

    db.add(status_history)
    db.commit()
    db.refresh(application)

    return {
        "success": True,
        "message": "Application status updated successfully",
        "application_id": application.id,
        "status": application.status
    }


@app.post("/classify")
def classify_grievance(data: dict):
    message = data.get("message", "").lower()

    if any(word in message for word in ["road", "pothole", "street"]):
        category = "Road"
        priority = "High"

    elif any(word in message for word in ["water", "pipeline", "leak"]):
        category = "Water"
        priority = "High"

    elif any(word in message for word in ["garbage", "waste", "dirty"]):
        category = "Sanitation"
        priority = "Medium"

    elif any(word in message for word in ["electricity", "power", "light"]):
        category = "Electricity"
        priority = "High"

    else:
        category = "General"
        priority = "Medium"

    return {
        "category": category,
        "priority": priority,
        "summary": message
    }


from sqlalchemy import Boolean, Column, String, Text, DateTime, JSON, Integer
from database import Base


class GrievanceDB(Base):
    __tablename__ = "grievances"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    serviceId = Column(String)
    serviceName = Column(String)
    issue = Column(String)
    description = Column(Text)
    department = Column(String)
    category = Column(String)
    state = Column(String)
    district = Column(String)
    cityVillage = Column(String)
    landmark = Column(String)
    priority = Column(String)
    status = Column(String)
    submittedAt = Column(DateTime)
    updatedAt = Column(DateTime)

    deadlineAt = Column(DateTime)
    beforeImage = Column(String)
    afterImage = Column(String)
    resolutionDescription = Column(Text)
    resolvedAt = Column(DateTime)
    escalatedAt = Column(DateTime)



class ApplicationDB(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    serviceId = Column(String)
    serviceName = Column(String)
    department = Column(String)
    category = Column(String)

    applicantName = Column(String)
    state = Column(String)
    district = Column(String)

    applicationData = Column(JSON)

    status = Column(String)
    submittedAt = Column(DateTime)
    updatedAt = Column(DateTime)

    
class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="citizen")

    email_verified = Column(Boolean, default=False)
    otp_code = Column(String(6), nullable=True)
    otp_expires_at = Column(DateTime, nullable=True)


class ApplicationStatusHistoryDB(Base):
    __tablename__ = "application_status_history"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    application_id = Column(String, nullable=False, index=True)
    status = Column(String, nullable=False)
    updated_at = Column(DateTime, nullable=False)
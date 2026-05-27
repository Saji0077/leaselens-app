from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import List, Optional
import database
import json

# Lifespan context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database
    print("Starting up...")
    try:
        database.initialize_database()
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
        print("The server will start, but database operations may fail.")
    yield
    # Shutdown: cleanup if needed
    print("Shutting down...")

# Create FastAPI app with lifespan
app = FastAPI(
    title="LeaseLens API",
    description="Backend API for rental risk assessment with Supabase integration",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/")
async def root():
    """Root endpoint - basic health check."""
    return {
        "message": "LeaseLens API is running",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    """Detailed health check endpoint."""
    try:
        # Test database connection
        conn = database.get_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1")
        cur.close()
        conn.close()
        
        return {
            "status": "healthy",
            "database": "connected",
            "message": "All systems operational"
        }
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e)
            }
        )

# Pydantic models for rental submissions
class RentalSubmissionCreate(BaseModel):
    user_type: Optional[str] = None
    state: Optional[str] = None
    urgency: Optional[str] = None
    rental_method: Optional[str] = None
    rental_content: Optional[str] = None
    risk_level: Optional[str] = None
    red_flags: Optional[List[str]] = []
    positive_signs: Optional[List[str]] = []

class RentalSubmissionResponse(BaseModel):
    id: str
    user_type: Optional[str] = None
    state: Optional[str] = None
    urgency: Optional[str] = None
    rental_method: Optional[str] = None
    rental_content: Optional[str] = None
    risk_level: Optional[str] = None
    red_flags: Optional[List[str]] = []
    positive_signs: Optional[List[str]] = []
    created_at: str

@app.post("/api/rental-submissions", response_model=RentalSubmissionResponse, status_code=201)
async def create_rental_submission(submission: RentalSubmissionCreate):
    """Create a new rental submission."""
    try:
        conn = database.get_connection()
        cur = conn.cursor()
        
        # Insert the rental submission
        cur.execute("""
            INSERT INTO rental_submissions 
            (user_type, state, urgency, rental_method, rental_content, risk_level, red_flags, positive_signs)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, user_type, state, urgency, rental_method, rental_content, risk_level, red_flags, positive_signs, created_at
        """, (
            submission.user_type,
            submission.state,
            submission.urgency,
            submission.rental_method,
            submission.rental_content,
            submission.risk_level,
            submission.red_flags,
            submission.positive_signs
        ))
        
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()
        
        # Convert the row to a response object
        return RentalSubmissionResponse(
            id=str(row[0]),
            user_type=row[1],
            state=row[2],
            urgency=row[3],
            rental_method=row[4],
            rental_content=row[5],
            risk_level=row[6],
            red_flags=row[7] if row[7] else [],
            positive_signs=row[8] if row[8] else [],
            created_at=row[9].isoformat()
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create rental submission: {str(e)}"
        )

@app.get("/api/rental-submissions", response_model=List[RentalSubmissionResponse])
async def get_rental_submissions(
    risk_level: Optional[str] = None,
    limit: int = 100,
    offset: int = 0
):
    """Retrieve rental submissions with optional filtering."""
    try:
        conn = database.get_connection()
        cur = conn.cursor()
        
        # Build the query with optional filtering
        if risk_level:
            cur.execute("""
                SELECT id, user_type, state, urgency, rental_method, rental_content, 
                       risk_level, red_flags, positive_signs, created_at
                FROM rental_submissions
                WHERE risk_level = %s
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            """, (risk_level, limit, offset))
        else:
            cur.execute("""
                SELECT id, user_type, state, urgency, rental_method, rental_content, 
                       risk_level, red_flags, positive_signs, created_at
                FROM rental_submissions
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            """, (limit, offset))
        
        rows = cur.fetchall()
        cur.close()
        conn.close()
        
        # Convert rows to response objects
        submissions = []
        for row in rows:
            submissions.append(RentalSubmissionResponse(
                id=str(row[0]),
                user_type=row[1],
                state=row[2],
                urgency=row[3],
                rental_method=row[4],
                rental_content=row[5],
                risk_level=row[6],
                red_flags=row[7] if row[7] else [],
                positive_signs=row[8] if row[8] else [],
                created_at=row[9].isoformat()
            ))
        
        return submissions
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve rental submissions: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

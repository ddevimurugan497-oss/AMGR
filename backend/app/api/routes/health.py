from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# 1. Pydantic model-a add pannunga
class HealthResponse(BaseModel):
    status: str = "ok"

# 2. Existing health check route-la response_model-a link pannunga
@router.get("/health", response_model=HealthResponse)
def health_check():
    return {"status": "ok"}
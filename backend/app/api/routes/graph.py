from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ...db.session import get_db
from ...schemas.graph import GraphResponse
from ...services.graph_service import GraphService

router = APIRouter()


@router.get("")
def get_graph(db: Session = Depends(get_db)) -> GraphResponse:
    return GraphService(db).load_graph()
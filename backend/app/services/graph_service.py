"""Graph construction from persisted runtime flow events."""

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.app.models.flow_event import FlowEventModel
from backend.app.schemas.flow_event import FlowEvent
from backend.app.schemas.graph import GraphEdge, GraphNode, GraphResponse


class GraphService:
    """Read stored events and map their submitted components to graph data."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def load_graph(self) -> GraphResponse:
        records = self._db.scalars(
            select(FlowEventModel).order_by(
                FlowEventModel.timestamp,
                FlowEventModel.event_id,
            )
        )

        nodes: dict[str, GraphNode] = {}
        edges: list[GraphEdge] = []

        for record in records:
            event = FlowEvent.model_validate(record.event_data)
            for component in (event.source, event.destination):
                nodes.setdefault(
                    component.component_id,
                    GraphNode(
                        id=component.component_id,
                        component=component,
                        label=component.name,
                    ),
                )

            edges.append(
                GraphEdge(
                    id=str(event.event_id),
                    source=event.source.component_id,
                    target=event.destination.component_id,
                    action=event.action,
                )
            )

        return GraphResponse(nodes=list(nodes.values()), edges=edges)

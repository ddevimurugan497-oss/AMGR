import unittest
from datetime import datetime

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from backend.app.db.session import Base, get_db
from backend.app.main import create_app
from backend.app.models.flow_event import FlowEventModel


class FlowEventRouteTests(unittest.TestCase):
    def setUp(self) -> None:
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(self.engine)
        self.app = create_app()

        def override_get_db():
            with Session(self.engine) as db:
                yield db

        self.app.dependency_overrides[get_db] = override_get_db
        self.client = TestClient(self.app)

    def tearDown(self) -> None:
        self.client.close()
        self.app.dependency_overrides.clear()
        self.engine.dispose()

    def test_get_graph_returns_empty_graph_with_timezone_aware_timestamp(self) -> None:
        response = self.client.get("/api/v1/graph")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["nodes"], [])
        self.assertEqual(payload["edges"], [])

        generated_at = datetime.fromisoformat(
            payload["generated_at"].replace("Z", "+00:00")
        )
        self.assertIsNotNone(generated_at.tzinfo)
        self.assertIsNotNone(generated_at.utcoffset())

    def test_ingested_event_is_persisted_and_appears_in_graph(self) -> None:
        event = {
            "event_id": "d35f1040-d8e7-4810-aa25-142202682e1d",
            "flow_id": "e97867e7-01d7-4bc0-a6b1-b00537c6c02a",
            "timestamp": "2026-10-14T10:00:00Z",
            "source": {
                "component_id": "agent-1",
                "component_type": "agent",
                "name": "Research Agent",
            },
            "destination": {
                "component_id": "tool-1",
                "component_type": "tool",
                "name": "Search",
            },
            "action": "tool.execute",
            "data_labels": ["public"],
            "metadata": {"request_id": "req-1"},
            "status": "observed",
            "duration_ms": 12.5,
        }

        ingested = self.client.post("/api/v1/flow-events", json=event)

        self.assertEqual(ingested.status_code, 201)
        self.assertEqual(ingested.json()["event_id"], event["event_id"])
        graph = self.client.get("/api/v1/graph")
        self.assertEqual(graph.status_code, 200)
        payload = graph.json()
        self.assertEqual(
            payload["nodes"],
            [
                {
                    "id": "agent-1",
                    "component": event["source"],
                    "label": "Research Agent",
                },
                {
                    "id": "tool-1",
                    "component": event["destination"],
                    "label": "Search",
                },
            ],
        )
        self.assertEqual(
            payload["edges"],
            [
                {
                    "id": event["event_id"],
                    "source": "agent-1",
                    "target": "tool-1",
                    "action": "tool.execute",
                }
            ],
        )
        generated_at = datetime.fromisoformat(
            payload["generated_at"].replace("Z", "+00:00")
        )
        self.assertIsNotNone(generated_at.utcoffset())

        with Session(self.engine) as db:
            stored = db.get(FlowEventModel, event["event_id"])
        self.assertIsNotNone(stored)
        self.assertEqual(stored.event_data["metadata"], {"request_id": "req-1"})

    def test_duplicate_event_id_returns_conflict(self) -> None:
        event = {
            "flow_id": "e97867e7-01d7-4bc0-a6b1-b00537c6c02a",
            "source": {"component_id": "a", "component_type": "agent"},
            "destination": {"component_id": "b", "component_type": "tool"},
            "action": "tool.execute",
        }
        first = self.client.post("/api/v1/flow-events", json=event)
        second = self.client.post("/api/v1/flow-events", json=first.json())

        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 409)

    def test_invalid_event_is_rejected_without_persistence(self) -> None:
        event = {
            "flow_id": "e97867e7-01d7-4bc0-a6b1-b00537c6c02a",
            "timestamp": "2026-10-14T10:00:00",
            "source": {"component_id": "a", "component_type": "agent"},
            "destination": {"component_id": "b", "component_type": "tool"},
            "action": "tool.execute",
        }
        response = self.client.post("/api/v1/flow-events", json=event)

        self.assertEqual(response.status_code, 422)
        with Session(self.engine) as db:
            self.assertEqual(db.query(FlowEventModel).count(), 0)

    def test_invalid_component_or_empty_action_is_rejected(self) -> None:
        event = {
            "flow_id": "e97867e7-01d7-4bc0-a6b1-b00537c6c02a",
            "source": {"component_id": " ", "component_type": "agent"},
            "destination": {"component_id": "b", "component_type": "tool"},
            "action": " ",
        }

        response = self.client.post("/api/v1/flow-events", json=event)

        self.assertEqual(response.status_code, 422)
        with Session(self.engine) as db:
            self.assertEqual(db.query(FlowEventModel).count(), 0)

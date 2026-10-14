"""AMGR FastAPI backend application entrypoint."""

from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.router import api_router
from .api.routes.authorization import router as authorization_router
from .api.routes.health import router as health_router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="AMGR Control Plane",
        description="Autonomous Multi-Agent Governance Runtime Control Plane & Policy Enforcement API",
        version="0.1.0",
    )

    # Configure CORS for local development & dashboard integration.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    api_prefix = os.environ.get("API_V1_PREFIX", "/api/v1").rstrip("/")
    app.include_router(api_router, prefix=api_prefix)
    if api_prefix:
        app.include_router(health_router)
        app.include_router(authorization_router, prefix=api_prefix)

    # Keep the pre-existing unprefixed authorization route available.
    app.include_router(authorization_router)

    return app


app = create_app()

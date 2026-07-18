from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from backend.app.core.logging import logger
from backend.app.datahub.service import context_service
from backend.app.datahub.schemas import (
    ContextSearchResponse, DatasetDetailsResponse, LineageResponse, OwnersResponse
)
from backend.app.datahub.models import DataHubDataset, DataHubLineage

router = APIRouter(prefix="/context", tags=["DataHub Context Layer"])


@router.get("/search", response_model=ContextSearchResponse, status_code=status.HTTP_200_OK)
async def search_catalog(
    q: str = Query(..., description="The query string to search for across assets"),
    type: Optional[str] = Query(None, description="Optional type filter (dataset, glossary, domain)")
):
    """
    Search across enterprise assets including datasets, business glossaries, and organizational domains.
    """
    if not q.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Search query cannot be empty or solely whitespace."
        )

    try:
        results = await context_service.search_assets(q, type)
        return ContextSearchResponse(
            query=q,
            datasets=results.get("datasets", []),
            glossary_terms=results.get("glossary_terms", []),
            domains=results.get("domains", []),
            total_matched=results.get("total_matched", 0)
        )
    except Exception as e:
        logger.error(f"context_router: Search execution failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Context Search failed: {str(e)}"
        )


@router.get("/dataset/{urn:path}", response_model=DataHubDataset, status_code=status.HTTP_200_OK)
async def get_dataset_details(urn: str):
    """
    Retrieve full details of an individual dataset, including fields, owners, and tags.
    Supports complex path-encoded DataHub URNs.
    """
    try:
        dataset = await context_service.get_dataset(urn)
        if not dataset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Dataset with URN '{urn}' could not be located in the catalog."
            )
        return dataset
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"context_router: Failed to retrieve dataset: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to query dataset metadata: {str(e)}"
        )


@router.get("/lineage/{urn:path}", response_model=DataHubLineage, status_code=status.HTTP_200_OK)
async def get_asset_lineage(urn: str):
    """
    Retrieve direct and transitive upstream and downstream lineage connections for an asset.
    """
    try:
        lineage = await context_service.get_lineage(urn)
        if not lineage:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lineage graph for asset URN '{urn}' could not be located."
            )
        return lineage
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"context_router: Failed to retrieve lineage: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to query lineage graph: {str(e)}"
        )


@router.get("/owners/{urn:path}", response_model=OwnersResponse, status_code=status.HTTP_200_OK)
async def get_asset_owners(urn: str):
    """
    Retrieve assigned business, technical, and compliance owners registered for an asset.
    """
    try:
        # Check if dataset exists
        dataset = await context_service.get_dataset(urn)
        if not dataset:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Asset with URN '{urn}' could not be located."
            )
        
        owners = await context_service.get_owners(urn)
        return OwnersResponse(urn=urn, owners=owners)
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"context_router: Failed to retrieve owners: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to query asset owners: {str(e)}"
        )


@router.get("/domains", response_model=list[DataHubDomain], status_code=status.HTTP_200_OK)
async def get_all_domains():
    """
    Retrieve all registered business domains inside the enterprise data catalog.
    """
    try:
        return await context_service.get_domains()
    except Exception as e:
        logger.error(f"context_router: Failed to retrieve domains: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to query domains: {str(e)}"
        )

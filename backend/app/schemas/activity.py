import uuid
from datetime import datetime

from pydantic import BaseModel


class ActivityResponse(BaseModel):
    id: uuid.UUID
    actor_id: uuid.UUID
    group_id: uuid.UUID | None
    activity_type: str
    entity_type: str
    entity_id: uuid.UUID
    description: str
    metadata_json: dict | None
    created_at: datetime

    model_config = {"from_attributes": True}

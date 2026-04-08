import uuid
from decimal import Decimal

from app.models.activity import Activity
from app.repositories.activity_repo import ActivityRepository


class ActivityService:
    def __init__(self, activity_repo: ActivityRepository):
        self.activity_repo = activity_repo

    async def log_expense_created(
        self,
        actor_id: uuid.UUID,
        group_id: uuid.UUID,
        expense_id: uuid.UUID,
        description: str,
        amount: Decimal,
        currency: str,
    ) -> Activity:
        activity = Activity(
            actor_id=actor_id,
            group_id=group_id,
            activity_type="expense_created",
            entity_type="expense",
            entity_id=expense_id,
            description=f"added {currency} {amount} for {description}",
            metadata_json={"amount": str(amount), "currency": currency, "description": description},
        )
        return await self.activity_repo.create(activity)

    async def log_expense_updated(
        self,
        actor_id: uuid.UUID,
        group_id: uuid.UUID,
        expense_id: uuid.UUID,
        description: str,
    ) -> Activity:
        activity = Activity(
            actor_id=actor_id,
            group_id=group_id,
            activity_type="expense_updated",
            entity_type="expense",
            entity_id=expense_id,
            description=f"updated expense: {description}",
        )
        return await self.activity_repo.create(activity)

    async def log_expense_deleted(
        self,
        actor_id: uuid.UUID,
        group_id: uuid.UUID,
        expense_id: uuid.UUID,
        description: str,
    ) -> Activity:
        activity = Activity(
            actor_id=actor_id,
            group_id=group_id,
            activity_type="expense_deleted",
            entity_type="expense",
            entity_id=expense_id,
            description=f"deleted expense: {description}",
        )
        return await self.activity_repo.create(activity)

    async def log_settlement(
        self,
        actor_id: uuid.UUID,
        group_id: uuid.UUID,
        expense_id: uuid.UUID,
        amount: Decimal,
        currency: str,
        to_user_id: uuid.UUID,
    ) -> Activity:
        activity = Activity(
            actor_id=actor_id,
            group_id=group_id,
            activity_type="settlement_recorded",
            entity_type="expense",
            entity_id=expense_id,
            description=f"settled {currency} {amount}",
            metadata_json={"amount": str(amount), "currency": currency, "to_user": str(to_user_id)},
        )
        return await self.activity_repo.create(activity)

    async def log_member_added(
        self,
        actor_id: uuid.UUID,
        group_id: uuid.UUID,
        member_user_id: uuid.UUID,
    ) -> Activity:
        activity = Activity(
            actor_id=actor_id,
            group_id=group_id,
            activity_type="member_added",
            entity_type="group",
            entity_id=group_id,
            description="added a member to the group",
            metadata_json={"member_user_id": str(member_user_id)},
        )
        return await self.activity_repo.create(activity)

    async def log_member_removed(
        self,
        actor_id: uuid.UUID,
        group_id: uuid.UUID,
        member_user_id: uuid.UUID,
    ) -> Activity:
        activity = Activity(
            actor_id=actor_id,
            group_id=group_id,
            activity_type="member_removed",
            entity_type="group",
            entity_id=group_id,
            description="removed a member from the group",
            metadata_json={"member_user_id": str(member_user_id)},
        )
        return await self.activity_repo.create(activity)

    async def log_group_created(
        self,
        actor_id: uuid.UUID,
        group_id: uuid.UUID,
        group_name: str,
    ) -> Activity:
        activity = Activity(
            actor_id=actor_id,
            group_id=group_id,
            activity_type="group_created",
            entity_type="group",
            entity_id=group_id,
            description=f"created group: {group_name}",
        )
        return await self.activity_repo.create(activity)

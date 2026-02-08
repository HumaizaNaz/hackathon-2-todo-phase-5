from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.src.services.auth_service import AuthService
from backend.src.models.user import User

router = APIRouter()

# Placeholder for dependency injection of database session
def get_session():
    # In a real application, this would yield a database session
    # For now, we'll simulate it.
    yield


@router.get("/users/me", response_model=User)
async def read_users_me(
    current_user: User = Depends(AuthService().decode_access_token),
    session: Session = Depends(get_session)
):
    """
    Get current authenticated user.
    This endpoint relies on the AuthService to decode the access token
    and retrieve user information.
    """
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # In a real app, you would fetch the user from the database using current_user.id
    # For this placeholder, we'll use the info directly from the token.
    # We need to convert the dict from decode_access_token to a User object
    # For now, let's create a dummy User based on the decoded token
    # This part needs adjustment based on how AuthService().decode_access_token
    # is truly implemented to return a User object or data that maps to it.
    
    # Assuming current_user is a dict from AuthService().decode_access_token
    # and has 'id', 'email', 'name' and 'roles' keys
    dummy_user = User(
        id=current_user.get("id"),
        email=current_user.get("email"),
        hashed_password="not_exposed", # This should not be exposed
        full_name=current_user.get("name"),
        is_active=True,
        is_superuser="admin" in current_user.get("roles", [])
    )
    return dummy_user

from sqlalchemy import select

from app.common.db import SessionLocal
from app.features.auth.models import User
from app.features.auth.service import sync_admin_seed


def test_signup_login_me_and_logout_flow(client, signup_user, login_user):
    result = signup_user()
    user_id = result["user_id"]
    assert result["response"].json()["user_id"] == user_id
    assert result["response"].json()["is_admin"] is False

    login_response = login_user(result["email"])
    assert login_response.json() == {"user_id": user_id, "is_admin": False}
    assert "pm_access_token" in login_response.cookies

    me_response = client.get("/auth/me")
    assert me_response.status_code == 200
    assert me_response.json()["user_id"] == user_id
    assert me_response.json()["is_admin"] is False

    logout_response = client.post("/auth/logout")
    assert logout_response.status_code == 204

    me_after_logout = client.get("/auth/me")
    assert me_after_logout.status_code == 401


def test_sync_admin_seed_rehashes_unknown_admin_hash():
    with SessionLocal() as db:
        admin = db.scalar(select(User).where(User.user_id == "admin"))
        assert admin is not None
        admin.password_hash = "legacy-unknown-hash"
        db.commit()

        sync_admin_seed(db)

        db.refresh(admin)
        assert admin.password_hash != "legacy-unknown-hash"

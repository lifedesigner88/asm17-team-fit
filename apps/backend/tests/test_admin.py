def test_admin_users_requires_admin_session(user_session):
    client, _ = user_session()

    response = client.get("/admin/users")

    assert response.status_code == 403
    assert response.json()["detail"] == "Admin only"


def test_admin_users_returns_seeded_admin_and_recent_users(signup_user, admin_session):
    client = admin_session
    signup_user()

    response = client.get("/admin/users")

    assert response.status_code == 200
    user_ids = [user["user_id"] for user in response.json()]
    assert "admin" in user_ids
    assert "ALI001" in user_ids

import asyncio
from httpx import AsyncClient, ASGITransport
from app.main import app, init_db
import json
import uuid

async def run_walkthrough():
    print("🚀 Starting API Walkthrough Verification...")
    
    # Initialize DB (SQLite in-memory for walkthrough)
    await init_db()
    
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # 1. Register User
        print("\n1️⃣ Registering User...")
        email = f"test_{uuid.uuid4().hex[:6]}@example.com"
        reg_payload = {"email": email, "password": "securepassword123"}
        response = await client.post("/api/v1/auth/register", json=reg_payload)
        print(f"Status: {response.status_code}")
        if response.status_code != 201:
            print(f"Error Response: {response.text}")
        assert response.status_code == 201

        # 2. Login
        print("\n2️⃣ Logging In...")
        login_data = {"username": email, "password": "securepassword123"}
        response = await client.post("/api/v1/auth/login", data=login_data)
        print(f"Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error Response: {response.text}")
        assert response.status_code == 200
        
        token = response.json().get("access_token")
        print(f"Token acquired: {token[:20]}...")
        headers = {"Authorization": f"Bearer {token}"}

        # 3. Create Note
        print("\n3️⃣ Creating a Personal Note...")
        note_payload = {"title": "My Walkthrough Note", "content": "This note was created during the verification script!"}
        response = await client.post("/api/v1/notes/", json=note_payload, headers=headers)
        print(f"Status: {response.status_code}")
        note_id = response.json().get("id")
        print(f"Note Created with ID: {note_id}")
        assert response.status_code == 201

        # 4. Fetch Notes
        print("\n4️⃣ Fetching all Notes...")
        response = await client.get("/api/v1/notes/", headers=headers)
        print(f"Status: {response.status_code}")
        notes = response.json()
        print(f"Found {len(notes)} notes.")
        assert response.status_code == 200

        # 5. Update Note
        print("\n5️⃣ Updating the Note...")
        update_payload = {"title": "Updated Walkthrough Note", "content": "The content has been modified!"}
        response = await client.put(f"/api/v1/notes/{note_id}", json=update_payload, headers=headers)
        print(f"Status: {response.status_code}")
        print(f"New Title: {response.json().get('title')}")
        assert response.status_code == 200

        # 6. Delete Note
        print("\n6️⃣ Deleting the Note...")
        response = await client.delete(f"/api/v1/notes/{note_id}", headers=headers)
        print(f"Status: {response.status_code}")
        assert response.status_code == 204

        print("\n✅ API Walkthrough Complete! All checks passed.")

if __name__ == "__main__":
    try:
        asyncio.run(run_walkthrough())
    except Exception as e:
        print(f"\n❌ Walkthrough Failed: {e}")
        import traceback
        traceback.print_exc()

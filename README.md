# 📔 Notes API

A production-ready, clean, and secure Cloud-Based Notes API built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy (Async)**.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login.
- **Note Management**: Full CRUD operations for personal notes.
- **Security**: Password hashing with Bcrypt, JWT stateless auth, and user-based access control.
- **Modular Design**: Clean folder structure following industry best practices.
- **Production Ready**: CORS support, containerized with Docker, and async database drivers.

## 🛠️ Tech Stack

- **Backend**: FastAPI
- **Database**: PostgreSQL (Asynchronous with `asyncpg`)
- **ORM**: SQLAlchemy
- **Auth**: Python-JOSE (JWT) & Passlib (Bcrypt)
- **Validation**: Pydantic v2

## 📂 Project Structure

```text
├── app/
│   ├── core/           # Configuration
│   ├── routers/        # API Endpoints
│   ├── auth.py         # Security Utilities
│   ├── database.py     # Session Management
│   ├── dependencies.py  # Protected Routes Helpers
│   ├── main.py         # App Entry Point
│   ├── models.py       # SQLAlchemy Entities
│   └── schemas.py      # Pydantic Validation
├── .env                # Environment Variables
├── Dockerfile          # Container Config
└── requirements.txt    # Dependencies
```

## ⚙️ Setup Instructions

### 1. Clone & Prepare
```bash
# Copy env template
cp .env.example .env
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Locally
```bash
uvicorn app.main:app --reload
```
API will be available at `http://localhost:8000`
Swagger Docs: `http://localhost:8000/docs`

### 4. Run with Docker
```bash
docker build -t notes-api .
docker run -p 8000:8000 notes-api
```

## 🔐 API Documentation (v1)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/v1/auth/register` | Create a new user | No |
| POST | `/api/v1/auth/login` | Login & Get JWT | No |
| GET | `/api/v1/notes/` | List all notes | Yes |
| POST | `/api/v1/notes/` | Create a note | Yes |
| GET | `/api/v1/notes/{id}` | Get a specific note | Yes |
| PUT | `/api/v1/notes/{id}` | Update a note | Yes |
| DELETE | `/api/v1/notes/{id}` | Delete a note | Yes |

## ☁️ Cloud Deployment

1. **Database**: Use a managed service like **AWS RDS**, **Railway PostgreSQL**, or **ElephantSQL**.
2. **Backend**: 
   - **Render/Railway**: Connect your GitHub repo, set build command `pip install -r requirements.txt` and start command `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
   - **AWS App Runner**: Deploy the Docker image directly.
3. **Environment Variables**: Add all `.env` keys to your cloud provider's dashboard.

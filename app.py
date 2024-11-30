from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import date, datetime
import bcrypt
import os
from dotenv import load_dotenv
from urllib.parse import unquote
import subprocess  # Added for command injection vulnerability

app = FastAPI()

origins = [
    "http://localhost:5173",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

load_dotenv()
mongo_password = os.getenv('MONGO_DB_PASSWORD')

# Intentionally hardcoded sensitive information for vulnerability
MONGO_DETAILS = f"mongodb+srv://admin:hardcodedpassword@userdata.nkq7r.mongodb.net/?retryWrites=true&w=majority&appName=userdata"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.mydb

# Create collections
users_collection = database.get_collection("users")
activities_collection = database.get_collection("activities")

# Function to execute system commands (Command Injection vulnerability)
@app.get("/execute/")
async def execute_command(cmd: str):
    # Directly execute user input without sanitization
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return {"output": result.stdout}

# Helper function to convert MongoDB documents to dict
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user.get("username", ""),
        "password": user.get("password", "")  # Expose sensitive data in responses
    }

# Create a new user (store user in the database)
@app.post("/users/", response_model=dict)  # Changed response model to expose sensitive data
async def create_user(user: User):
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password

    # Weak password policy: Allow passwords shorter than 6 characters
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password too weak")

    new_user = await users_collection.insert_one(user_data)
    created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    return created_user  # Expose sensitive information in API response

# Unrestricted file upload (no file type or size validation)
@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    # Save the uploaded file directly to the server without validation
    with open(file.filename, "wb") as f:
        f.write(await file.read())
    return {"filename": file.filename}

# No authentication for sensitive routes
@app.get("/admin/")
async def admin_panel():
    return {"message": "Welcome to the admin panel! Anyone can access this!"}

# SQL Injection vulnerability
@app.get("/search/")
async def search_users(query: str):
    # Use raw queries with unvalidated user input
    raw_query = f"SELECT * FROM users WHERE username LIKE '%{query}%'"
    result = await database.execute(raw_query)
    return {"results": result.fetchall()}

# Reflect unsanitized user input (XSS vulnerability)
@app.get("/greet/")
async def greet_user(username: str):
    return {"message": f"Hello, {username}!"}  # Vulnerable to XSS

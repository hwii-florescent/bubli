from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import date
import bcrypt
import os
from dotenv import load_dotenv

# Create FastAPI app instance
app = FastAPI()

load_dotenv()
mongo_password = os.getenv('MONGO_DB_PASSWORD')

# MongoDB connection setup
MONGO_DETAILS = f"mongodb+srv://admin:{mongo_password}@userdata.nkq7r.mongodb.net/?retryWrites=true&w=majority&appName=userdata"
client = AsyncIOMotorClient(MONGO_DETAILS)
database = client.mydb

# Create collections
users_collection = database.get_collection("users")
activities_collection = database.get_collection("activities")

# Helper function to convert MongoDB documents to dict
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user.get("username", "")
    }

def activity_helper(activity) -> dict:
    return {
        "id": str(activity["_id"]),
        "user_id": str(activity["user_id"]),
        "email": activity["email"],
        "activities": activity["activities"]
    }

# Pydantic models
class User(BaseModel):
    email: str
    password: str
    username: str = None

class UserResponse(BaseModel):
    id: str
    email: str
    username: str = None

class ActivityEntry(BaseModel):
    prompt: str
    answer: str
    mood_answer: str
    mood_rating: int
    songId: str

class Activity(BaseModel):
    date: str = Field(default=str(date.today()))  # Default to today's date
    details: ActivityEntry

# Function to hash a password using bcrypt
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

# Function to verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Create a new user (store user in the database)
@app.post("/users/", response_model=User)
async def create_user(user: User):
    # Ensure the email is unique
    if await users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the user's password before storing it
    hashed_password = hash_password(user.password)
    user_data = user.dict()
    user_data["password"] = hashed_password
    
    # Insert the new user into the collection
    new_user = await users_collection.insert_one(user_data)
    created_user = await users_collection.find_one({"_id": new_user.inserted_id})
    return user_helper(created_user)

# Get all users
@app.get("/users/", response_model=List[UserResponse])
async def get_users():
    users = []
    async for user in users_collection.find():
        temp = user_helper(user)
        users.append(temp)
    print(users)
    return users

# Create or update user activity
@app.post("/users/{email}/activities/")
async def add_activity(email: str, activity: Activity):
    user = await users_collection.find_one({"email": email})
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if the user has an existing activity record
    user_activity = await activities_collection.find_one({"email": email})
    
    # Prepare new activity entry
    new_activity = {
        activity.date: {
            "prompt": activity.details.prompt,
            "answer": activity.details.answer,
            "mood_answer": activity.details.mood_answer,
            "mood_rating": activity.details.mood_rating,
            "song": activity.details.songId
        }
    }
    
    if user_activity:
        # Update the existing record
        await activities_collection.update_one(
            {"email": email},
            {"$set": {f"activities.{activity.date}": new_activity[activity.date]}}
        )
    else:
        # Create a new activity record for the user
        new_activity_record = {
            "user_id": user["_id"],
            "email": email,
            "activities": new_activity
        }
        await activities_collection.insert_one(new_activity_record)
    
    return {"message": "Activity saved successfully"}

# Get user activities by email
@app.get("/users/{email}/activities/")
async def get_user_activities(email: str):
    user_activity = await activities_collection.find_one({"email": email})
    
    if not user_activity:
        raise HTTPException(status_code=404, detail="User activities not found")
    
    return activity_helper(user_activity)

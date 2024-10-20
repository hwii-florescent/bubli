from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from datetime import date
import bcrypt
import os
from dotenv import load_dotenv

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

class UserUpdate(BaseModel):
    email: Optional[str]
    password: Optional[str]
    username: Optional[str] = None

class ActivityEntry(BaseModel):
    prompt: str
    answer: str
    mood_answer: str
    mood_rating: int
    songId: str

class ActivityEntryUpdate(BaseModel):
    prompt: Optional[str]
    answer: Optional[str]
    mood_answer: Optional[str]
    mood_rating: Optional[int]
    songId: Optional[str]

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
@app.post("/users/", response_model=UserResponse)
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
        users.append(user_helper(user))
    return users

# Update a user
@app.put("/users/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate):
    # Find the user
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_data = user_update.dict(exclude_unset=True)

    # Hash password if it's being updated
    if 'password' in user_data:
        user_data['password'] = hash_password(user_data['password'])

    # Ensure email uniqueness if email is being updated
    if 'email' in user_data:
        existing_user = await users_collection.find_one({"email": user_data['email'], "_id": {"$ne": ObjectId(user_id)}})
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")

    # Update the user
    await users_collection.update_one({"_id": ObjectId(user_id)}, {"$set": user_data})
    # Retrieve updated user
    updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
    return user_helper(updated_user)

# Delete a user
@app.delete("/users/{user_id}")
async def delete_user(user_id: str):
    # Find the user
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Delete the user
    await users_collection.delete_one({"_id": ObjectId(user_id)})

    # Optionally, delete user's activities
    await activities_collection.delete_many({"user_id": ObjectId(user_id)})

    return {"message": "User deleted successfully"}

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

# Update an activity
@app.put("/users/{email}/activities/{date}")
async def update_activity(email: str, date: str, activity_update: ActivityEntryUpdate):
    user_activity = await activities_collection.find_one({"email": email})

    if not user_activity:
        raise HTTPException(status_code=404, detail="User activities not found")

    if date not in user_activity['activities']:
        raise HTTPException(status_code=404, detail="Activity for given date not found")

    # Prepare update data
    activity_data = activity_update.dict(exclude_unset=True)

    # Build the update query
    update_query = {f"activities.{date}.{key}": value for key, value in activity_data.items()}

    # Update the activity
    await activities_collection.update_one(
        {"email": email},
        {"$set": update_query}
    )

    return {"message": "Activity updated successfully"}

# Delete an activity
@app.delete("/users/{email}/activities/{date}")
async def delete_activity(email: str, date: str):
    user_activity = await activities_collection.find_one({"email": email})

    if not user_activity:
        raise HTTPException(status_code=404, detail="User activities not found")

    if date not in user_activity['activities']:
        raise HTTPException(status_code=404, detail="Activity for given date not found")

    # Remove the activity for the specified date
    await activities_collection.update_one(
        {"email": email},
        {"$unset": {f"activities.{date}": ""}}
    )

    # Optionally, delete the document if no activities remain
    updated_user_activity = await activities_collection.find_one({"email": email})
    if not updated_user_activity['activities']:
        await activities_collection.delete_one({"email": email})

    return {"message": "Activity deleted successfully"}

# Get user activities
@app.get("/users/{email}/activities/")
async def get_user_activities(email: str):
    user_activity = await activities_collection.find_one({"email": email})

    if not user_activity:
        raise HTTPException(status_code=404, detail="User activities not found")

    return user_activity["activities"]

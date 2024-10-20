from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
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

# Helper functions to convert MongoDB documents to dict
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "username": user.get("username")
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
    username: Optional[str] = None

class UpdateUser(BaseModel):
    email: Optional[str] = None
    password: Optional[str] = None
    username: Optional[str] = None

class ActivityEntry(BaseModel):
    prompt: str
    question: str
    answer: str
    mood_rating: int

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
@app.get("/users/", response_model=List[User])
async def get_users():
    users = []
    async for user in users_collection.find():
        users.append(user_helper(user))
    return users

# Get a specific user by ID
@app.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    user = await users_collection.find_one({"_id": user_obj_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_helper(user)

# Get a user by email
@app.get("/users/email/{email}", response_model=User)
async def get_user_by_email(email: str):
    user = await users_collection.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user_helper(user)

# Update a user entirely (PUT)
@app.put("/users/{user_id}", response_model=User)
async def update_user(user_id: str, user: UpdateUser):
    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    existing_user = await users_collection.find_one({"_id": user_obj_id})
    if not existing_user:
        raise HTTPException(status_code=404, detail="User not found")
    user_data = user.dict(exclude_unset=True)
    # If email is being updated, ensure it's unique
    if "email" in user_data and user_data["email"] != existing_user["email"]:
        if await users_collection.find_one({"email": user_data["email"]}):
            raise HTTPException(status_code=400, detail="Email already registered")
    # If password is being updated, hash it
    if "password" in user_data:
        user_data["password"] = hash_password(user_data["password"])
    # Update the user in the database
    await users_collection.update_one({"_id": user_obj_id}, {"$set": user_data})
    updated_user = await users_collection.find_one({"_id": user_obj_id})
    return user_helper(updated_user)

# Partially update a user (PATCH)
@app.patch("/users/{user_id}", response_model=User)
async def partially_update_user(user_id: str, user: UpdateUser):
    return await update_user(user_id, user)

# Delete a user
@app.delete("/users/{user_id}")
async def delete_user(user_id: str):
    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")
    result = await users_collection.delete_one({"_id": user_obj_id})
    if result.deleted_count == 1:
        # Also delete associated activities
        await activities_collection.delete_one({"user_id": user_obj_id})
        return {"message": "User deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="User not found")

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
            "question": activity.details.question,
            "answer": activity.details.answer,
            "mood_rating": activity.details.mood_rating
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

# Get user activity by date
@app.get("/users/{email}/activities/{date}")
async def get_user_activity_by_date(email: str, date: str):
    user_activity = await activities_collection.find_one({"email": email})
    if not user_activity or date not in user_activity["activities"]:
        raise HTTPException(status_code=404, detail="Activity not found")
    activity_details = user_activity["activities"][date]
    return {
        "date": date,
        "details": activity_details
    }

# Update an activity entirely (PUT)
@app.put("/users/{email}/activities/{date}")
async def update_activity(email: str, date: str, activity: ActivityEntry):
    user_activity = await activities_collection.find_one({"email": email})
    if not user_activity:
        raise HTTPException(status_code=404, detail="User activities not found")
    # Prepare the updated activity entry
    updated_activity = {
        "prompt": activity.prompt,
        "question": activity.question,
        "answer": activity.answer,
        "mood_rating": activity.mood_rating
    }
    # Update the activity for the specific date
    result = await activities_collection.update_one(
        {"email": email},
        {"$set": {f"activities.{date}": updated_activity}}
    )
    if result.modified_count == 1:
        return {"message": "Activity updated successfully"}
    else:
        raise HTTPException(status_code=404, detail="Activity not found or no changes made")

# Partially update an activity (PATCH)
@app.patch("/users/{email}/activities/{date}")
async def partially_update_activity(email: str, date: str, activity: ActivityEntry):
    user_activity = await activities_collection.find_one({"email": email})
    if not user_activity or date not in user_activity["activities"]:
        raise HTTPException(status_code=404, detail="Activity not found")
    existing_activity = user_activity["activities"][date]
    activity_data = activity.dict(exclude_unset=True)
    # Merge existing activity data with new data
    updated_activity = {**existing_activity, **activity_data}
    # Update the activity
    await activities_collection.update_one(
        {"email": email},
        {"$set": {f"activities.{date}": updated_activity}}
    )
    return {"message": "Activity partially updated successfully"}

# Delete an activity
@app.delete("/users/{email}/activities/{date}")
async def delete_activity(email: str, date: str):
    user_activity = await activities_collection.find_one({"email": email})
    if not user_activity:
        raise HTTPException(status_code=404, detail="User activities not found")
    if date not in user_activity["activities"]:
        raise HTTPException(status_code=404, detail="Activity not found for the given date")
    # Remove the activity for the specific date
    await activities_collection.update_one(
        {"email": email},
        {"$unset": {f"activities.{date}": ""}}
    )
    return {"message": "Activity deleted successfully"}

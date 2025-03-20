import os
from dotenv import load_dotenv
from pymongo import MongoClient
load_dotenv()


connection_string = os.getenv("MONGODB_URI")

client = MongoClient(connection_string)

db = client["StudyBuddyDB"]

collection = db["misc"]

document = {
    "name": "Alice",
    "age": 24,
    "email": "alice@example.com",
    "password": "sadasdasdsa"
}

result = collection.insert_one(document)

print(f"Inserted document ID: {result.inserted_id}")
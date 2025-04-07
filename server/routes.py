from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from pymongo import MongoClient
load_dotenv()

connection_string = os.getenv("MONGODB_URI")
client = MongoClient(connection_string)
app = Flask(__name__)
db = client["StudyBuddyDB"]
collection = db["misc"]

CORS(app)

@app.route('/api/create_session', methods = ['POST'])
def create_session():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid data"}), 400
    
    
    document = {
        "ssid": data.get('ssid'),
        "building": data.get('building'),
        "floor": data.get('floor'),
        "date": data.get('date'),
        "startTime": data.get('startTime'),
        "endTime": data.get('endTime')
    }
    print(document)
    result = collection.insert_one(document)
    print(f"Inserted document ID: {result.inserted_id}")
    return jsonify({"message": "Session created successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=3000)
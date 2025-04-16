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
        "course": data.get('course'),
        "date": data.get('date'),
        "startTime": data.get('startTime'),
        "endTime": data.get('endTime'),
        "focusLevel": data.get('focusLevel'),
        "groupSize": data.get('groupSize'),
        "notes": data.get('notes')
    }
    print(document)
    result = collection.insert_one(document)
    print(f"Inserted document ID: {result.inserted_id}")
    return jsonify({"message": "Session created successfully"}), 200

@app.route('/api/pull_session', methods = ['GET'])
def pull_session():
    print('called')
    documents = list(collection.find({}, {'_id': 0}))  # Exclude MongoDB’s _id if unnecessary
    print(documents)
    return jsonify({"message": "Sessions pulled successfully", "data": documents}), 200

    #return jsonify
if __name__ == '__main__':
    app.run(debug=True, port=5001)
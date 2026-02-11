import sys
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

from dotenv import load_dotenv
load_dotenv()

from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
import joblib
import pandas as pd
from ml.collect_live_data import get_network_features
from flask_jwt_extended import create_access_token



app = Flask(__name__)
CORS(app)

# JWT configuration
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# MongoDB Atlas connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["network_app"]
users_collection = db["users"]

# Load ML model (UNCHANGED)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
model = joblib.load(os.path.join(BASE_DIR, "ml", "model.pkl"))
scaler = joblib.load(os.path.join(BASE_DIR, "ml", "scaler.pkl"))

FEATURES = ["duration", "src_bytes", "dst_bytes", "count", "srv_count"]


# ===============================
# ORIGINAL ML ROUTE (UNCHANGED)
# ===============================

@app.route("/predict-live", methods=["GET"])
@jwt_required()
def predict_live():
    data = get_network_features()

    # --- Engineer new features ---
    traffic_total = data["src_bytes"] + data["dst_bytes"]
    packet_rate = (data["count"] + data["srv_count"]) / data["duration"]

    # NEW FEATURE
    byte_ratio = data["src_bytes"] / (data["dst_bytes"] + 1)

    data["traffic_total"] = traffic_total
    data["packet_rate"] = packet_rate
    data["byte_ratio"] = round(byte_ratio, 4)

    df = pd.DataFrame([{
        "duration": data["duration"],
        "src_bytes": data["src_bytes"],
        "dst_bytes": data["dst_bytes"],
        "count": data["count"],
        "srv_count": data["srv_count"]
    }])

    X = scaler.transform(df[FEATURES])

    score = model.decision_function(X)[0]
    pred = model.predict(X)[0]

    return jsonify({
        "features": data,
        "anomaly_score": round(score, 4),
        "result": "Anomaly" if pred == -1 else "Normal"
    })
    
    # ===============================
# USER REGISTER ROUTE
# ===============================

@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    # Basic validation
    if not username or not email or not password:
        return jsonify({"msg": "All fields are required"}), 400

    # Check if user already exists
    if users_collection.find_one({"email": email}):
        return jsonify({"msg": "User already exists"}), 400

    # Hash password
    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    # Insert user into MongoDB
    users_collection.insert_one({
        "username": username,
        "email": email,
        "password": hashed_password
    })

    return jsonify({"msg": "User registered successfully"}), 201

# ===============================
# USER LOGIN ROUTE
# ===============================

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password required"}), 400

    # Find user
    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Check password
    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"msg": "Invalid password"}), 401

    # Create JWT token
    access_token = create_access_token(identity=str(user["_id"]))

    return jsonify({
        "msg": "Login successful",
        "access_token": access_token
    }), 200



if __name__ == "__main__":
    from waitress import serve
    print("🚀 Production server running on http://127.0.0.1:5000")
    serve(app, host="0.0.0.0", port=5000)


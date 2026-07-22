from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from bson import ObjectId

app = Flask(__name__)
CORS(app)

# connect to MongoDB
client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["ghost-worker-detector"]

def get_employee_features():
    employees = list(db.employees.find())
    attendance = list(db.attendances.find())
    payrolls = list(db.payrolls.find())

    data = []

    for emp in employees:
        emp_id = emp["_id"]

        # attendance features
        emp_attendance = [a for a in attendance if a["employee"] == emp_id]
        total_checkins = len(emp_attendance)
        suspicious_checkins = len([a for a in emp_attendance if a["status"] == "suspicious"])
        outside_geofence = len([a for a in emp_attendance if not a["isWithinGeofence"]])

        # device features
        devices_used = list(set([a["deviceId"] for a in emp_attendance]))
        unique_devices = len(devices_used)

        # payroll features
        emp_payroll = [p for p in payrolls if p["employee"] == emp_id]
        total_salary_paid = sum([p["amountPaid"] for p in emp_payroll])
        flagged_payroll = len([p for p in emp_payroll if p.get("flagged", False)])

        data.append({
            "employee_id": str(emp_id),
            "name": emp["name"],
            "total_checkins": total_checkins,
            "suspicious_checkins": suspicious_checkins,
            "outside_geofence": outside_geofence,
            "unique_devices": unique_devices,
            "total_salary_paid": total_salary_paid,
            "flagged_payroll": flagged_payroll,
        })

    return data

@app.route("/ml/analyze", methods=["GET"])
def analyze():
    try:
        data = get_employee_features()

        if len(data) < 2:
            return jsonify({"error": "Need at least 2 employees to run analysis"}), 400

        df = pd.DataFrame(data)

        # features for isolation forest
        features = df[[
            "total_checkins",
            "suspicious_checkins",
            "outside_geofence",
            "unique_devices",
            "total_salary_paid",
            "flagged_payroll"
        ]]

        # run isolation forest
        model = IsolationForest(contamination=0.2, random_state=42)
        df["anomaly_score"] = model.fit_predict(features)
        df["anomaly_score_raw"] = model.decision_function(features)

        # convert to 0-100 risk score
        raw_scores = df["anomaly_score_raw"].values
        normalized = (raw_scores - raw_scores.min()) / (raw_scores.max() - raw_scores.min() + 1e-10)
        df["ml_risk_score"] = ((1 - normalized) * 100).astype(int)

        results = []
        for _, row in df.iterrows():
            results.append({
                "employee_id": row["employee_id"],
                "name": row["name"],
                "ml_risk_score": int(row["ml_risk_score"]),
                "is_anomaly": row["anomaly_score"] == -1,
                "risk_level": "HIGH" if row["ml_risk_score"] >= 70 else "MEDIUM" if row["ml_risk_score"] >= 40 else "LOW",
                "features": {
                    "total_checkins": int(row["total_checkins"]),
                    "suspicious_checkins": int(row["suspicious_checkins"]),
                    "outside_geofence": int(row["outside_geofence"]),
                    "unique_devices": int(row["unique_devices"]),
                    "total_salary_paid": float(row["total_salary_paid"]),
                    "flagged_payroll": int(row["flagged_payroll"]),
                }
            })

        return jsonify({
            "message": "Isolation Forest analysis complete",
            "total_employees": len(results),
            "anomalies_detected": len([r for r in results if r["is_anomaly"]]),
            "results": results
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Ghost Worker ML Service is running"})

if __name__ == "__main__":
    app.run(port=5001, debug=True)
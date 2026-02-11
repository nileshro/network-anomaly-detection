import json
import joblib
import pandas as pd

model = joblib.load("ml/model.pkl")
scaler = joblib.load("ml/scaler.pkl")

FEATURES = ["duration", "src_bytes", "dst_bytes", "count", "srv_count"]

def handler(request):
    data = json.loads(request.body)

    df = pd.DataFrame([data])
    X = scaler.transform(df[FEATURES])
    pred = model.predict(X)[0]

    return {
        "statusCode": 200,
        "body": json.dumps({
            "result": "Anomaly" if pred == -1 else "Normal"
        })
    }

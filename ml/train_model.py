import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

df = pd.read_csv("live_network_data.csv")


features = ["duration", "src_bytes", "dst_bytes", "count", "srv_count"]
X = df[features]

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

model = IsolationForest(
    n_estimators=200,
    contamination=0.05,
    random_state=42
)

model.fit(X_scaled)

joblib.dump(model, "model.pkl")
joblib.dump(scaler, "scaler.pkl")


print("Model trained and saved")

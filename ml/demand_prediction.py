import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score


DATA_PATH = "data/medicine_demand.csv"
MODEL_PATH = "models/demand_model.pkl"


def load_data():
    return pd.read_csv(DATA_PATH)


def train_model():
    data = load_data()

    region_encoder = LabelEncoder()
    medicine_encoder = LabelEncoder()

    data["region_encoded"] = region_encoder.fit_transform(data["region"])
    data["medicine_encoded"] = medicine_encoder.fit_transform(data["medicine"])

    features = data[
        [
            "month",
            "region_encoded",
            "medicine_encoded",
            "previous_demand",
            "current_stock"
        ]
    ]

    target = data["demand"]

    X_train, X_test, y_train, y_test = train_test_split(
        features,
        target,
        test_size=0.2,
        random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    print("Model Evaluation")
    print("----------------")
    print(f"Mean Absolute Error: {mean_absolute_error(y_test, predictions):.2f}")
    print(f"R2 Score: {r2_score(y_test, predictions):.2f}")

    joblib.dump(
        {
            "model": model,
            "region_encoder": region_encoder,
            "medicine_encoder": medicine_encoder
        },
        MODEL_PATH
    )

    print(f"Model saved to {MODEL_PATH}")


def predict_demand(month, region, medicine, previous_demand, current_stock):
    saved_model = joblib.load(MODEL_PATH)

    model = saved_model["model"]
    region_encoder = saved_model["region_encoder"]
    medicine_encoder = saved_model["medicine_encoder"]

    input_data = pd.DataFrame([
        {
            "month": month,
            "region_encoded": region_encoder.transform([region])[0],
            "medicine_encoded": medicine_encoder.transform([medicine])[0],
            "previous_demand": previous_demand,
            "current_stock": current_stock
        }
    ])

    prediction = model.predict(input_data)[0]

    if current_stock < prediction * 0.3:
        risk = "High"
    elif current_stock < prediction * 0.6:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "medicine": medicine,
        "region": region,
        "predicted_demand": round(prediction),
        "current_stock": current_stock,
        "shortage_risk": risk
    }


if __name__ == "__main__":
    train_model()

    result = predict_demand(
        month=5,
        region="Tetovo",
        medicine="Paracetamol",
        previous_demand=1250,
        current_stock=240
    )

    print("\nSample Prediction")
    print("-----------------")
    print(result)
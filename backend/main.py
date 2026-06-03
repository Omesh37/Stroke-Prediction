from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("model.pkl")

class StrokeInput(BaseModel):
    gender: str
    age: float
    hypertension: int
    heart_disease: int
    ever_married: str
    work_type: str
    Residence_type: str
    avg_glucose_level: float
    bmi: float
    smoking_status: str

def build_dataframe(data: StrokeInput) -> pd.DataFrame:
    bmi     = data.bmi
    glucose = data.avg_glucose_level

    # BMI category — must match training exactly
    if bmi < 18.5:      bmi_category = "Underweight"
    elif bmi < 25:      bmi_category = "Normal"
    elif bmi < 30:      bmi_category = "Overweight"
    else:               bmi_category = "Obese"

    # Glucose category — must match training exactly
    if glucose < 100:   glucose_category = "Normal"
    elif glucose < 126: glucose_category = "Prediabetic"
    else:               glucose_category = "Diabetic"

    # Combined column — exact format from training
    bmi_glucose_combined = f"{bmi_category}_{glucose_category}"

    return pd.DataFrame([{
        "gender":                        data.gender,
        "age":                           data.age,
        "hypertension":                  data.hypertension,
        "heart_disease":                 data.heart_disease,
        "ever_married":                  data.ever_married,
        "work_type":                     data.work_type,
        "Residence_type":                data.Residence_type,
        "avg_glucose_level":             glucose,
        "bmi":                           bmi,
        "smoking_status":                data.smoking_status,
        "bmi_category":                  bmi_category,
        "glucose_category":              glucose_category,
        "age_heart_disease":             data.age * data.heart_disease,
        "age_hypertension":              data.age * data.hypertension,
        "bmi_category_glucose_category": bmi_glucose_combined,
    }])

@app.get("/")
def root():
    return {"status": "ok"}

@app.post("/predict")
def predict(data: StrokeInput):
    try:
        df          = build_dataframe(data)
        prediction  = model.predict(df)[0]
        probability = model.predict_proba(df)[0][1]
        return {
            "prediction":  int(prediction),
            "label":       "High Risk" if prediction == 1 else "Low Risk",
            "probability": round(float(probability) * 100, 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
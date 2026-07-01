import { useState } from "react";
import { predictStroke } from "../api";

const INITIAL = {
  gender: "Male",
  age: "",
  hypertension: 0,
  heart_disease: 0,
  ever_married: "Yes",
  work_type: "Private",
  Residence_type: "Urban",
  avg_glucose_level: "",
  bmi: "",
  smoking_status: "never smoked",
};

export default function PredictionForm() {
  const [form, setForm]       = useState(INITIAL);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  function handle(e) {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === "number" ? parseFloat(value) : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        ...form,
        age:               parseFloat(form.age),
        avg_glucose_level: parseFloat(form.avg_glucose_level),
        bmi:               parseFloat(form.bmi),
        hypertension:      parseInt(form.hypertension),
        heart_disease:     parseInt(form.heart_disease),
      };
      const data = await predictStroke(payload);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Assessment panel</h1>
        <p>Enter the patient profile and let the model generate a stroke-risk estimate.</p>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-grid">

          <div className="field">
            <label>Gender</label>
            <select name="gender" value={form.gender} onChange={handle}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="field">
            <label>Age</label>
            <input type="number" name="age" value={form.age}
              onChange={handle} placeholder="e.g. 45" min="1" max="120" required />
          </div>

          <div className="field">
            <label>Hypertension</label>
            <select name="hypertension" value={form.hypertension} onChange={handle}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>

          <div className="field">
            <label>Heart Disease</label>
            <select name="heart_disease" value={form.heart_disease} onChange={handle}>
              <option value={0}>No</option>
              <option value={1}>Yes</option>
            </select>
          </div>

          <div className="field">
            <label>Ever Married</label>
            <select name="ever_married" value={form.ever_married} onChange={handle}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div className="field">
            <label>Work Type</label>
            <select name="work_type" value={form.work_type} onChange={handle}>
              <option>Private</option>
              <option>Self-employed</option>
              <option>Govt_job</option>
              <option>children</option>
              <option>Never_worked</option>
            </select>
          </div>

          <div className="field">
            <label>Residence Type</label>
            <select name="Residence_type" value={form.Residence_type} onChange={handle}>
              <option>Urban</option>
              <option>Rural</option>
            </select>
          </div>

          <div className="field">
            <label>Avg Glucose Level (mg/dL)</label>
            <input type="number" name="avg_glucose_level" value={form.avg_glucose_level}
              onChange={handle} placeholder="e.g. 106.5" step="0.01" required />
          </div>

          <div className="field">
            <label>BMI</label>
            <input type="number" name="bmi" value={form.bmi}
              onChange={handle} placeholder="e.g. 28.9" step="0.1" required />
          </div>

          <div className="field">
            <label>Smoking Status</label>
            <select name="smoking_status" value={form.smoking_status} onChange={handle}>
              <option>never smoked</option>
              <option>formerly smoked</option>
              <option>smokes</option>
              <option>Unknown</option>
            </select>
          </div>

        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Analyzing..." : "Predict Stroke Risk"}
        </button>
      </form>

      {result && (
        <div className={`result ${result.prediction === 1 ? "high" : "low"}`}>
          <h2>{result.label}</h2>
          <p>Stroke probability: <strong>{result.probability}%</strong></p>
          <div className="bar-wrap">
            <div className="bar" style={{ width: `${result.probability}%` }} />
          </div>
          <p className="disclaimer">
            This is a model prediction only, not medical advice.
          </p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
    </div>
  );
}
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="page-container">
      <h1>Stroke Risk Predictor</h1>
      <p>An ML-powered tool to assess stroke risk based on patient data.</p>
      <button onClick={() => navigate("/predict")} className="submit-btn">
        Try the Predictor
      </button>
    </div>
  );
}
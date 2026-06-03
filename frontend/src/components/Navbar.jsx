import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="nav-brand">🧠 Stroke Predictor</span>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/predict">Predict</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}
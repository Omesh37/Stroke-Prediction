import "./Navbar.css";

export default function Navbar({ onNavigate, logoSrc, isScrolled = false }) {
  return (
    <nav className={`navbar ${isScrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-inner">
        <button type="button" className="nav-brand" onClick={() => onNavigate("home")}>
          <span className="brand-mark">
            <img src={logoSrc} alt="StrokeLens logo" className="brand-logo" />
          </span>
          <span className="brand-copy">
            <span className="brand-title">StrokeLens</span>
            <span className="brand-subtitle">AI screening</span>
          </span>
        </button>

        <div className="nav-links">
          <button type="button" onClick={() => onNavigate("home")}>Home</button>
          <button type="button" onClick={() => onNavigate("predict")}>Predict</button>
          <button type="button" onClick={() => onNavigate("about")}>About</button>
        </div>
      </div>
    </nav>
  );
}
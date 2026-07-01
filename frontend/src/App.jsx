import { useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import PredictionForm from "./components/PredictionForm";
import logoImage from "./assets/logo_img.svg";
import heroVideo from "./assets/Video Project.mp4";
import "./App.css";

function App() {
  const videoRef = useRef(null);
  const [showPredictCta, setShowPredictCta] = useState(false);
  const [revealedSections, setRevealedSections] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
      return;
    }

    const shouldShow = video.duration - video.currentTime <= 4;
    setShowPredictCta((current) => (current === shouldShow ? current : shouldShow));
  };

  useEffect(() => {
    const sections = document.querySelectorAll("[data-reveal-section]");

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const sectionId = entry.target.getAttribute("data-reveal-section");
          if (!sectionId) {
            return;
          }

          setRevealedSections((current) => {
            if (current[sectionId]) {
              return current;
            }

            return { ...current, [sectionId]: true };
          });
        });
      },
      { threshold: 0.22 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Navbar onNavigate={scrollToSection} logoSrc={logoImage} isScrolled={isScrolled} />
      <main className="app-shell">
        <section className="hero-section" id="home">
          <div className="hero-media">
            <video
              ref={videoRef}
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onTimeUpdate={handleVideoTimeUpdate}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="hero-overlay" />
          </div>

          <button
            type="button"
            className={`video-cta ${showPredictCta ? "is-visible" : ""}`}
            onClick={() => scrollToSection("predict")}
          >
            Predict now
          </button>
        </section>

        <section
          className={`content-section predict-section ${revealedSections.predict ? "is-visible" : ""}`}
          id="predict"
          data-reveal-section="predict"
        >
          <div className="section-copy">
            <div className="section-kicker">Prediction</div>
            <h2>Open the risk model when you are ready.</h2>
            <p>
              The form stays in the same visual language as the hero and uses the same
              scroll flow, so the page feels continuous from landing to assessment.
            </p>
          </div>
          <div className="predict-panel">
            <PredictionForm />
          </div>
        </section>

        <section
          className={`content-section about-section ${revealedSections.about ? "is-visible" : ""}`}
          id="about"
          data-reveal-section="about"
        >
          <div className="section-copy">
            <div className="section-kicker">About</div>
            <h2>Designed as a single guided experience.</h2>
            <p>
              The page keeps the story simple: video-led landing, a timed action button,
              a focused model panel, and a compact explanation of the project below.
            </p>
          </div>

          <div className="about-grid">
            <article className="info-card">
              <span className="info-label">Model</span>
              <h3>Risk scoring</h3>
              <p>Uses the existing classifier to turn patient data into a clear probability.</p>
            </article>
            <article className="info-card">
              <span className="info-label">Inputs</span>
              <h3>Clinical signals</h3>
              <p>Age, glucose, BMI, history, and lifestyle fields are all captured in one form.</p>
            </article>
            <article className="info-card">
              <span className="info-label">Flow</span>
              <h3>Scroll-first layout</h3>
              <p>The sections ease into view as you move down the page, instead of appearing flat.</p>
            </article>
          </div>
        </section>

        <footer className="site-footer">
          <p>
            Made with ❤️ by <a href="https://github.com/Omesh37" target="_blank" rel="noreferrer">Omesh37 :)</a>
          </p>
        </footer>
      </main>
    </>
  );
}

export default App;
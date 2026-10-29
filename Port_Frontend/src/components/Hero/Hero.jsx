
import "./Hero.css";
import axios from "axios";
import { useEffect, useState } from "react";
import heroBackground from "../../assets/images/Neon Eagle in Flight.png";
import heroPortrait from "../../assets/images/uttam.png";
import { FaArrowRight, FaDownload } from "react-icons/fa";

const headlineLines = ["सोच में स्पष्टता।", "निर्माण में उत्कृष्टता।"];

const headlineSegments = headlineLines.map((line) => {
  if (typeof Intl.Segmenter === "function") {
    return [
      ...new Intl.Segmenter("hi", {
        granularity: "grapheme",
      }).segment(line),
    ].map(({ segment }) => segment);
  }

  return Array.from(line);
});

function Hero() {
  const [visibleLines, setVisibleLines] = useState(["", ""]);
  const [typingLine, setTypingLine] = useState(0);
  const [resumeUrl, setResumeUrl] = useState("");

  // Fetch the current resume from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/resume")
      .then((response) => {
        console.log("Resume API response:", response.data);

        if (response.data.success && response.data.resume?.url) {
          setResumeUrl(response.data.resume.url);
        } else {
          setResumeUrl("");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch resume:", error);
        setResumeUrl("");
      });
  }, []);

  // Existing Hindi typing animation
  useEffect(() => {
    let timer;
    let lineIndex = 0;
    let characterIndex = 0;
    let deleting = false;
    const lines = ["", ""];

    const schedule = (delay) => {
      timer = window.setTimeout(animate, delay);
    };

    function animate() {
      const characters = headlineSegments[lineIndex];

      if (!deleting && characterIndex < characters.length) {
        characterIndex += 1;
        lines[lineIndex] = characters
          .slice(0, characterIndex)
          .join("");

        setVisibleLines([...lines]);
        schedule(95);
        return;
      }

      if (!deleting && lineIndex === 0) {
        lineIndex = 1;
        characterIndex = 0;
        setTypingLine(lineIndex);
        schedule(450);
        return;
      }

      if (!deleting) {
        deleting = true;
        schedule(1400);
        return;
      }

      if (characterIndex > 0) {
        characterIndex -= 1;
        lines[lineIndex] = characters
          .slice(0, characterIndex)
          .join("");

        setVisibleLines([...lines]);
        schedule(55);
        return;
      }

      if (lineIndex === 1) {
        lineIndex = 0;
        characterIndex = headlineSegments[lineIndex].length;
        setTypingLine(lineIndex);
        schedule(250);
        return;
      }

      deleting = false;
      characterIndex = 0;
      setTypingLine(0);
      schedule(450);
    }

    schedule(350);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      className="hero"
      id="home"
      style={{
        "--hero-background": `url("${heroBackground}")`,
      }}
    >
      <img
        className="hero-portrait"
        src={heroPortrait}
        alt="Uttam Pal"
      />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">
            Software Developer · Digital Creator
          </p>

          <h1 aria-label={headlineLines.join(" ")}>
            {visibleLines.map((line, index) => (
              <span
                className="hero-headline-line"
                key={headlineLines[index]}
              >
                {line}
                {typingLine === index && (
                  <span
                    className="hero-caret"
                    aria-hidden="true"
                  />
                )}
              </span>
            ))}
          </h1>

          <blockquote className="hero-shloka">
            <p>
              कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
              <br />
              मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
            </p>

            <p className="hero-description">
              Building responsive web applications with modern technologies
              and a focus on practical solutions.
            </p>
          </blockquote>

          <div className="d-flex flex-wrap gap-3 hero-buttons">
            <a
              href="#projects"
              className="btn hero-primary-btn"
            >
              Explore my work <FaArrowRight />
            </a>

            {resumeUrl && (
              <a
                href={resumeUrl}
                className="btn hero-secondary-btn"
                target="_blank"
                rel="noreferrer"
                download
              >
                <FaDownload /> Resume
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="hero-ribbon" aria-hidden="true"></div>
    </section>
  );
}

export default Hero;

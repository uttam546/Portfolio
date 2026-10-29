import "./Footer.css";

import {
  FaGithub,
  FaLinkedinIn,
  FaEnvelope,
  FaArrowUp,
  FaHeart,
  FaFileContract,
  FaMobile,
  FaPhone,
} from "react-icons/fa";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Top Footer */}

        <div className="footer-top">

          {/* Brand */}

          <div className="footer-brand">

            <h2>
              Uttam<span>.</span>
            </h2>

            <p>
              Software Developer passionate about building
              useful, modern and user-friendly applications.
            </p>

            <div className="footer-socials">

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>

              <a
                href="mailto:utmp5678@gmail.com"
                aria-label="Email"
              >
                <FaEnvelope />
              </a>

            </div>

          </div>


          {/* Quick Links */}

          <div className="footer-links">

            <h3>
              Quick Links
            </h3>

            <a href="#about">
              About
            </a>

            <a href="#skills">
              Skills
            </a>

            <a href="#projects">
              Projects
            </a>

            <a href="#education">
              Education
            </a>

          </div>


          {/* Contact */}

          <div className="footer-contact">

            <h3>
              Let's Connect
            </h3>

            <p>
              Have an opportunity or project in mind?
              I'd love to hear from you.
            </p>

            <a
              href="mailto:utmp5678@gmail.com"
              className="footer-email"
            >
              <FaEnvelope />
              utmp5678@gmail.com
            </a>
            <p>
            <FaPhone/> 91+  9336943935
            </p>

          </div>

        </div>


        {/* Divider */}

        <div className="footer-divider"></div>


        {/* Bottom */}

        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Uttam Pal.
            All Rights Reserved.
          </p>

          <p className="made-with">
            Made with <FaHeart /> and code
          </p>

          <button
            className="back-to-top"
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <FaArrowUp />
          </button>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
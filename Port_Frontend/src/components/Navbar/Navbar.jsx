import "./Navbar.css";
import { useEffect, useRef, useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navbarRef = useRef(null);

  // Close menu when clicking outside, pressing Escape,
  // or switching to desktop view.
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Projects", href: "#projects" },
    { label: "Education", href: "#education" },
    { label: "Comments", href: "#comments" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      ref={navbarRef}
      className="navbar navbar-expand-lg portfolio-navbar fixed-top"
    >
      <div className="container py-2">
        <a
          className="navbar-brand portfolio-brand"
          href="#home"
          onClick={closeMenu}
        >
          Uttam<span>.</span>
        </a>

        <button
          className="navbar-toggler"
          type="button"
          aria-controls="portfolioNav"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((previous) => !previous)}
        >
          {menuOpen ? (
            <span className="navbar-close-icon" aria-hidden="true">
              &times;
            </span>
          ) : (
            <span className="navbar-toggler-icon" aria-hidden="true" />
          )}
        </button>

        <div
          className={`collapse navbar-collapse${menuOpen ? " show" : ""}`}
          id="portfolioNav"
        >
          <ul className="navbar-nav mx-auto gap-lg-3">
            {navItems.map((item) => (
              <li className="nav-item" key={item.href}>
                <a
                  className="nav-link"
                  href={item.href}
                  onClick={(event) => {
                    if (item.href === "#comments") {
                      event.preventDefault();
                      window.dispatchEvent(new Event("portfolio:open-comments"));
                    }
                    closeMenu();
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            className="btn btn-sm portfolio-nav-cta"
            href="#contact"
            onClick={closeMenu}
          >
            Let's talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

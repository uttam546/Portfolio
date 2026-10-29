import "./Projects.css";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
} from "react-icons/fa";

function Projects() {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);


  // ======================================
  // FETCH PROJECTS
  // ======================================

  const fetchProjects = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/projects"
      );

      if (response.data.success) {
        setProjects(response.data.projects);
      }

    } catch (error) {

      console.error("Error fetching projects:", error);

    } finally {

      setLoading(false);

    }
  };


  // Fetch projects when page loads
  useEffect(() => {
    fetchProjects();
  }, []);


  return (
    <section
      className="projects-section"
      id="projects"
    >

      <div className="projects-container">

        {/* Heading */}

        <div className="projects-heading">

          <span className="section-label">
            MY WORK
          </span>

          <h2>
            Featured
            <span> Projects</span>
          </h2>

          <p>
            Some of the projects I've built while
            learning and developing my skills.
          </p>

        </div>


        {/* Loading */}

        {loading && (
          <p className="projects-status">
            Loading projects...
          </p>
        )}


        {/* No Projects */}

        {!loading && projects.length === 0 && (
          <p className="projects-status">
            No projects available yet.
          </p>
        )}


        {/* Projects */}

        {!loading && projects.length > 0 && (

          <div className="projects-grid">

            {projects.map((project) => (

              <div
                className="project-card"
                key={project._id}
              >

                {/* Image */}

                <div className={`project-image ${project.image ? "has-image" : "project-image-placeholder"}`}>
                  {project.image ? (

                    <img
                      src={project.image}
                      alt={project.title}
                    />
                  ) : (
                    <FaCode aria-hidden="true" />
                  )}
                  <span className="project-image-tag">{project.category}</span>
                </div>


                {/* Content */}

                <div className="project-content">

                  <h3>
                    {project.title}
                  </h3>

                  <p>
                    {project.description}
                  </p>


                  {/* Technologies */}

                  <div className="project-tech">

                    {(Array.isArray(project.technologies) ? project.technologies : []).map(
                      (technology, index) => (

                        <span key={index}>
                          {technology}
                        </span>

                      )
                    )}

                  </div>


                  {/* Links */}

                  <div className="project-links">

                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaGithub />
                        GitHub
                      </a>
                    )}


                    {project.liveLink && (
                      <a
                        className="live-link"
                        href={project.liveLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FaExternalLinkAlt />
                        Live Demo
                      </a>
                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}

export default Projects;
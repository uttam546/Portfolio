import "./Skills.css";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaJava,
  FaNodeJs,
  FaGitAlt,
  FaDatabase,
  FaCode,
} from "react-icons/fa";

const defaultSkills = [
  { name: "HTML5", level: "Advanced", percentage: 90 },
  { name: "CSS3", level: "Advanced", percentage: 85 },
  { name: "JavaScript", level: "Intermediate", percentage: 75 },
  { name: "React", level: "Intermediate", percentage: 70 },
  { name: "Java", level: "Intermediate", percentage: 75 },
  { name: "Node.js", level: "Intermediate", percentage: 65 },
  { name: "SQL", level: "Intermediate", percentage: 70 },
  { name: "Git & GitHub", level: "Intermediate", percentage: 70 },
];

const skillIcons = {
  HTML5: <FaHtml5 />,
  CSS3: <FaCss3Alt />,
  JavaScript: <FaJs />,
  React: <FaReact />,
  Java: <FaJava />,
  "Node.js": <FaNodeJs />,
  SQL: <FaDatabase />,
  "Git & GitHub": <FaGitAlt />,
};

function Skills() {
  const [skills, setSkills] = useState(defaultSkills);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/skills`);
        if (response.data.success && response.data.skills.length > 0) {
          setSkills(response.data.skills);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <section className="skills-section" id="skills">

      <div className="skills-container">

        {/* Heading */}
        <div className="skills-heading">

          <span className="section-label">
            MY SKILLS
          </span>

          <h2>
            Technologies I
            <span> Work With</span>
          </h2>

          <p>
            A collection of technologies and tools I use to
            build modern and reliable applications.
          </p>

        </div>


        {/* Skills */}
        <div className="skills-grid">

          {skills.map((skill, index) => (

            <div className="skill-card" key={index}>

              <div className="skill-top">

                <div className="skill-icon">
                  {skillIcons[skill.name] || <FaCode />}
                </div>

                <div className="skill-info">

                  <h3>{skill.name}</h3>

                  <span>{skill.level}</span>

                </div>

                <strong>
                  {skill.percentage}%
                </strong>

              </div>


              <div className="skill-bar">

                <div
                  className="skill-progress"
                  style={{
                    width: `${skill.percentage}%`,
                  }}
                ></div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Skills;
import "./Education.css";

import { FaGraduationCap, FaBookOpen, FaLaptopCode, FaTrophy,} from "react-icons/fa";

function Education() {
  const learning = [
    "Data Structures & Algorithms",
    "Spring Boot",
    "REST API Development",
    "Machine Learning",
    "System Design",
    "Git & GitHub",
  ];

  return (
    <section className="education-section" id="education">

      <div className="education-container">

        {/* Heading */}

        <div className="education-heading">

          <span className="section-label">
            MY JOURNEY
          </span>

          <h2>
            Education &
            <span> Learning</span>
          </h2>

          <p>
            My academic journey and the technologies I am
            currently learning to become a better software developer.
          </p>

        </div>


        {/* Main Content */}

        <div className="education-content">

          {/* Education Card */}

          <div className="education-card">

            <div className="education-icon">
              <FaGraduationCap />
            </div>

            <div className="education-info">

              <span className="education-date">
                2023 – 2027
              </span>

              <h3>
                Bachelor of Technology
              </h3>

              <h4>
                Computer Science & Engineering
              </h4>

              <p>
                Currently pursuing my B.Tech in Computer Science
                and Engineering, developing a strong foundation
                in programming, databases, algorithms and
                software development.
              </p>

              <div className="education-tags">

                <span>Computer Science</span>
                <span>Software Development</span>
                <span>Programming</span>

              </div>

            </div>

          </div>


          {/* Currently Learning */}

          <div className="learning-card">

            <div className="learning-header">

              <div className="learning-icon">
                <FaBookOpen />
              </div>

              <div>
                <h3>Currently Learning</h3>

                <p>
                  Technologies I'm focusing on right now
                </p>
              </div>

            </div>


            <div className="learning-list">

              {learning.map((item, index) => (

                <div
                  className="learning-item"
                  key={index}
                >

                  <FaLaptopCode />

                  <span>{item}</span>

                </div>

              ))}

            </div>

          </div>

        </div>


        {/* Bottom Achievement Area */}

        <div className="journey-box">

          <div className="journey-icon">
            <FaTrophy />
          </div>

          <div>

            <h3>
              Building My Career Step by Step
            </h3>

            <p>
              As a fresher, I am focusing on building strong
              technical fundamentals, developing real-world
              projects and continuously improving my problem
              solving skills.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Education;
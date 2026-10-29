import "./About.css";

import {
  FaUser,
  FaGraduationCap,
  FaCode,
  FaRocket,
  FaCheckCircle,
} from "react-icons/fa";

function About() {
  return (
    <section className="about-section" id="about">

      <div className="about-container">

        {/* Section Heading */}
        <div className="about-heading">

          <span className="section-label">
            ABOUT ME
          </span>

          <h2>
            Turning Ideas Into
            <span> Digital Solutions</span>
          </h2>

          <p>
            A little more about me, my journey and what
            drives me as a software developer.
          </p>

        </div>


        {/* Main About Content */}
        <div className="about-content">

          {/* Left Side */}
          <div className="about-text">

            <div className="about-icon">
              <FaUser />
            </div>

            <h3>
              Who Am I?
            </h3>

            <p>
              I'm Uttam Pal, a Computer Science and Engineering
              student passionate about software development,
              problem solving and building real-world applications.
            </p>

            <p>
              I enjoy learning new technologies and turning ideas
              into practical projects. My current focus is on
              full-stack development, Java and modern web technologies.
            </p>

            <p>
              Along with technical skills, I am continuously working
              on communication, creativity and becoming a better
              problem solver.
            </p>

          </div>


          {/* Right Side */}
          <div className="about-cards">

            {/* Education */}
            <div className="about-card">

              <div className="card-icon">
                <FaGraduationCap />
              </div>

              <div>
                <h4>Education</h4>

                <p>
                  B.Tech in Computer Science &
                  Engineering
                </p>
              </div>

            </div>


            {/* Development */}
            <div className="about-card">

              <div className="card-icon">
                <FaCode />
              </div>

              <div>
                <h4>Development</h4>

                <p>
                  Full Stack Web Development,
                  Java & React
                </p>
              </div>

            </div>


            {/* Goal */}
            <div className="about-card">

              <div className="card-icon">
                <FaRocket />
              </div>

              <div>
                <h4>My Goal</h4>

                <p>
                  Become a skilled software engineer
                  and build meaningful products.
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Bottom Highlights */}
        <div className="about-highlights">

          <div>
            <FaCheckCircle />
            <span>Problem Solver</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>Continuous Learner</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>Creative Thinker</span>
          </div>

          <div>
            <FaCheckCircle />
            <span>Team Player</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default About;
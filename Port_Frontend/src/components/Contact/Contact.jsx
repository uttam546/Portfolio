import "./Contact.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaPaperPlane,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa";

import axios from "axios";

function Contact() {

  // ==============================
  // HANDLE CONTACT FORM
  // ==============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      subject: e.target.subject.value,
      message: e.target.message.value,
    };

    try {

      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData
      );

      toast.success(response.data.message);

      e.target.reset();

    } catch (error) {

      console.error("Contact form error:", error);

      toast.error("Something went wrong. Please try again.");

    }
  };


  // ==============================
  // PAGE
  // ==============================

  return (
    <>
    <ToastContainer />
    <section className="contact-section" id="contact">

      <div className="contact-container">

        {/* Heading */}

        <div className="contact-heading">

          <span className="section-label">
            GET IN TOUCH
          </span>

          <h2>
            Let's Build Something
            <span> Together</span>
          </h2>

          <p>
            Have a project idea, job opportunity, or just want
            to connect? Feel free to send me a message.
          </p>

        </div>


        {/* Contact Content */}

        <div className="contact-content">

          {/* Left Side */}

          <div className="contact-info">

            <h3>
              Let's Talk
            </h3>

            <p>
              I'm always open to discussing software development,
              interesting projects, learning opportunities and
              potential career opportunities.
            </p>


            {/* Email */}

            <div className="contact-item">

              <div className="contact-icon">
                <FaEnvelope />
              </div>

              <div>

                <span>Email</span>

                <a href="mailto:utmp5678@gmail.com">
                  utmp5678@gmail.com
                </a>

              </div>

            </div>


            {/* Phone */}

            <div className="contact-item">

              <div className="contact-icon">
                <FaPhone />
              </div>

              <div>

                <span>Phone</span>

                <a href="tel:+919336943935">
                  +91 9336943935
                </a>

              </div>

            </div>


            {/* Location */}

            <div className="contact-item">

              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>

              <div>

                <span>Location</span>

                <p>
                  Raseora, Sitapur, Uttar Pradesh, India
                </p>

              </div>

            </div>


            {/* Social */}

            <div className="contact-socials">

              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
              >
                <FaGithub />
              </a>

              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                <FaLinkedinIn />
              </a>

            </div>

          </div>


          {/* Right Side - Form */}

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="form-row">

              {/* Name */}

              <div className="form-group">

                <label htmlFor="name">
                  Your Name
                </label>

                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  required
                />

              </div>


              {/* Email */}

              <div className="form-group">

                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required
                />

              </div>

            </div>


            {/* Subject */}

            <div className="form-group">

              <label htmlFor="subject">
                Subject
              </label>

              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="What is this about?"
                required
              />

            </div>


            {/* Message */}

            <div className="form-group">

              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Write your message..."
                required
              ></textarea>

            </div>


            {/* Submit */}

            <button
              type="submit"
              className="send-button"
            >
              Send Message
              <FaPaperPlane />
            </button>

          </form>

        </div>

      </div>

    </section>
    </>
  );
}

export default Contact;
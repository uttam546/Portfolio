import "./AdminDashboard.css";
import {FaEnvelope,FaProjectDiagram,FaTools,FaSignOutAlt,FaTrash,FaPlus,} from "react-icons/fa";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [projectLoading, setProjectLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [skillLoading, setSkillLoading] = useState(true);
  const [resume, setResume] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeDeleting, setResumeDeleting] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [skillForm, setSkillForm] = useState({name: "",level: "Intermediate",percentage: "",
});
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
   title: "",
   description: "",
   technologies: "",
   category: "",
   githubLink: "",
   liveLink: "",
   image: "",
  });

  const fetchResume = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/resume`);
      if (response.data.success) {
        setResume(response.data.resume);
      }
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Please select a PDF resume first.");
      return;
    }

    if (resumeFile.type !== "application/pdf" || !resumeFile.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a PDF file.");
      return;
    }

    if (resumeFile.size > 5 * 1024 * 1024) {
      toast.error("Resume must be 5 MB or smaller.");
      return;
    }

    try {
      setResumeUploading(true);
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/resume`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setResume(response.data.resume);
        setResumeFile(null);
        const fileInput = document.getElementById("resume-file-input");
        if (fileInput) fileInput.value = "";
        toast.success(response.data.message || "Resume uploaded successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload resume.");
    } finally {
      setResumeUploading(false);
    }
  };
/**=========================================== */
    //Delete resume
/**=========================================== */
  const handleDeleteResume = async () => {
    if (!resume) {
      toast.info("There is no resume to delete.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete the current resume? This cannot be undone.");
    if (!confirmed) return;
    try {
      setResumeDeleting(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/resume`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setResume(null);
        setResumeFile(null);

        const fileInput = document.getElementById("resume-file-input");
        if (fileInput) fileInput.value = "";

        toast.success(response.data.message || "Resume deleted successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete resume."
      );
    } finally {
      setResumeDeleting(false);
    }
  };

  const handleProjectChange = (e) => {
  const { name, value } = e.target;

  setProjectForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setSkillForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/skills`,
        {
          ...skillForm,
          percentage: Number(skillForm.percentage),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSkills((previousSkills) => [response.data.skill, ...previousSkills]);
        setSkillForm({ name: "", level: "Intermediate", percentage: "" });
        setShowSkillForm(false);
        toast.success("Skill added successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add skill.");
    }
  };

  const handleProjectSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("adminToken");

    const projectData = {
      title: projectForm.title,
      description: projectForm.description,
      technologies: projectForm.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech !== ""),
      category: projectForm.category,
      githubLink: projectForm.githubLink,
      liveLink: projectForm.liveLink,
      image: projectForm.image,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/admin/projects`,
      projectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success("Project added successfully!");

      setProjects((previousProjects) => [
        response.data.project,
        ...previousProjects,
      ]);
      setShowProjectForm(false);

      setProjectForm({
        title: "",
        description: "",
        technologies: "",
        category: "",
        githubLink: "",
        liveLink: "",
        image: "",
      });
    }

  } catch (error) {
    console.error("Project creation error:", error);

    toast.error(
      error.response?.data?.message ||
      "Failed to add project."
    );
  }
};

  // ======================================
  // FETCH CONTACT MESSAGES
  // ======================================

  const fetchMessages = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setMessages(response.data.messages);
      }

    } catch (error) {

      console.error("Error fetching messages:", error);

      if (error.response?.status === 401) {

        localStorage.removeItem("adminToken");

        navigate("/admin/login");

      } else {

        toast.error("Failed to load messages.");

      }

    } finally {

      setLoading(false);

    }
  };

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/comments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments.");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/messages/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message);

      // Remove deleted message from screen
      setMessages((previousMessages) =>
        previousMessages.filter(
          (message) => message._id !== id
        )
      );
    }

  } catch (error) {
    console.error("Delete error:", error);

    toast.error(
      error.response?.data?.message ||
      "Failed to delete message."
    );
  }
};

  const handleDeleteComment = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this comment? This cannot be undone.");
    if (!confirmed) return;

    try {
      setDeletingCommentId(id);
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/comments/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setComments((previousComments) =>
          previousComments.filter((comment) => comment._id !== id)
        );
        toast.success(response.data.message || "Comment deleted successfully.");
      }
    } catch (error) {
      console.error("Comment delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete comment.");
    } finally {
      setDeletingCommentId(null);
    }
  };


  // ======================================
  // RUN WHEN DASHBOARD OPENS
  // ======================================

  useEffect(() => {
    fetchMessages();
    fetchProjects();
    fetchSkills();
    fetchResume();
    fetchComments();
  }, []);


  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {

    localStorage.removeItem("adminToken");

    navigate("/admin/login");

  };

  const fetchProjects = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/projects`
    );

    if (response.data.success) {
      setProjects(response.data.projects);
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    toast.error("Failed to load projects.");
  } finally {
    setProjectLoading(false);
  }
};

const fetchSkills = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/skills`);
    if (response.data.success) {
      setSkills(response.data.skills);
    }
  } catch (error) {
    console.error("Error fetching skills:", error);
    toast.error("Failed to load skills.");
  } finally {
    setSkillLoading(false);
  }
};

const handleDeleteSkill = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/skills/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      setSkills((previousSkills) => previousSkills.filter((skill) => skill._id !== id));
      toast.success(response.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to delete skill.");
  }
};

const handleEditProject = (project) => {
  setEditingProject({
    ...project,
    technologies: (project.technologies || []).join(", "),
  });
};

const handleUpdateProject = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("adminToken");

    const projectData = {
      title: editingProject.title,
      description: editingProject.description,
      technologies: editingProject.technologies
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech !== ""),
      category: editingProject.category,
      githubLink: editingProject.githubLink,
      liveLink: editingProject.liveLink,
      image: editingProject.image,
    };

    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/projects/${editingProject._id}`,
      projectData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success("Project updated successfully!");

      setProjects((previousProjects) =>
        previousProjects.map((project) =>
          project._id === editingProject._id
            ? response.data.project
            : project
        )
      );

      setEditingProject(null);
    }
  } catch (error) {
    console.error("Update project error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to update project."
    );
  }
};

const handleDeleteProject = async (id) => {
  try {
    const token = localStorage.getItem("adminToken");

    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/admin/projects/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message);

      setProjects((previousProjects) =>
        previousProjects.filter(
          (project) => project._id !== id
        )
      );
    }
  } catch (error) {
    console.error("Delete project error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to delete project."
    );
  }
};


  return (
    <div className="admin-dashboard">
      <ToastContainer />
      <aside className="admin-sidebar">
        <h2>Smart Portfolio</h2>
        <p className="admin-label">ADMIN PANEL</p>
        <nav>
          <button type="button" onClick={() => document.getElementById("messages-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            <FaEnvelope /> Messages
          </button>
          <button type="button" onClick={() => document.getElementById("projects-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            <FaProjectDiagram /> Projects
          </button>
          <button type="button" onClick={() => document.getElementById("skills-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            <FaTools /> Skills
          </button>
          <button type="button" onClick={() => document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            <FaEnvelope /> Comments
          </button>
        </nav>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Dashboard</h1>
            <p>Welcome to your Smart Portfolio Admin Panel.</p>
          </div>
        </div>

        <div className="admin-stats">
          <div className="stat-card"><FaEnvelope /><div><h3>{messages.length}</h3><p>Messages</p></div></div>
          <div className="stat-card"><FaProjectDiagram /><div><h3>{projects.length}</h3><p>Projects</p></div></div>
          <div className="stat-card"><FaTools /><div><h3>{skills.length}</h3><p>Skills</p></div></div>
          <div className="stat-card"><FaEnvelope /><div><h3>{comments.length}</h3><p>Comments</p></div></div>
        </div>

        <section id="comments-section" className="dashboard-card">
          <h2>Appreciation &amp; Feedback Comments</h2>
          {commentsLoading ? (
            <p>Loading comments...</p>
          ) : comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <div className="messages-list">
              {comments.map((comment) => (
                <article className="message-card" key={comment._id}>
                  <h3>{comment.name || "Anonymous"}</h3>
                  <p>{comment.text}</p>
                  <small>{new Date(comment.createdAt).toLocaleString()}</small>
                  <button
                    className="delete-message-button"
                    type="button"
                    onClick={() => handleDeleteComment(comment._id)}
                    disabled={deletingCommentId !== null}
                    aria-label={`Delete comment from ${comment.name || "Anonymous"}`}
                  >
                    <FaTrash />
                    {deletingCommentId === comment._id ? "Deleting..." : "Delete"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* MESSAGES */}

        <div id="messages-section" className="dashboard-card">

          <h2>
            Contact Messages
          </h2>


          {loading ? (

            <p>
              Loading messages...
            </p>

          ) : messages.length === 0 ? (

            <p>
              No messages yet.
            </p>

          ) : (

            <div className="messages-list">

              {messages.map((message) => (

                <div
                  className="message-card"
                  key={message._id}
                >

                  <div className="message-header">

                    <div>

                      <h3>
                        {message.name}
                      </h3>

                      <span>
                        {message.email}
                      </span>

                    </div>

                    <small>
                      {new Date(
                        message.createdAt
                      ).toLocaleString()}
                    </small>

                  </div>


                  <h4>
                    {message.subject}
                  </h4>

                  <p>
                    {message.message}
                  </p>
                  <button className="delete-message-button"
                    onClick={() => handleDeleteMessage(message._id)}
                  >
                  <FaTrash />
                    Delete
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

        <div id="projects-section" className="dashboard-card project-admin-card">
          <div className="dashboard-card-heading">
            <h2>My Projects</h2>
            <button
              className="add-project-button"
              type="button"
              onClick={() => setShowProjectForm((visible) => !visible)}
            >
              <FaPlus />
              {showProjectForm ? "Cancel" : "Add Project"}
            </button>
          </div>

          {showProjectForm && (
            <form className="project-form" onSubmit={handleProjectSubmit}>
              <input name="title" value={projectForm.title} onChange={handleProjectChange} placeholder="Project title" required />
              <input name="category" value={projectForm.category} onChange={handleProjectChange} placeholder="Category" required />
              <input name="technologies" value={projectForm.technologies} onChange={handleProjectChange} placeholder="Technologies, comma separated" required />
              <input name="image" type="url" value={projectForm.image} onChange={handleProjectChange} placeholder="Cover image URL (optional)" />
              {projectForm.image && (
                <div className="project-image-preview">
                  <p>Cover image preview</p>
                  <img src={projectForm.image} alt="Project cover preview" />
                </div>
              )}
              <input name="githubLink" value={projectForm.githubLink} onChange={handleProjectChange} placeholder="GitHub URL (optional)" type="url" />
              <input name="liveLink" value={projectForm.liveLink} onChange={handleProjectChange} placeholder="Live demo URL (optional)" type="url" />
              <textarea name="description" value={projectForm.description} onChange={handleProjectChange} placeholder="Project description" rows="4" required />
              <button className="save-project-button" type="submit">Save Project</button>
            </form>
          )}

          {editingProject && (
            <form className="project-form" onSubmit={handleUpdateProject}>
              <input name="title" value={editingProject.title} onChange={(event) => setEditingProject({ ...editingProject, title: event.target.value })} placeholder="Project title" required />
              <input name="category" value={editingProject.category} onChange={(event) => setEditingProject({ ...editingProject, category: event.target.value })} placeholder="Category" required />
              <input name="technologies" value={editingProject.technologies} onChange={(event) => setEditingProject({ ...editingProject, technologies: event.target.value })} placeholder="Technologies, comma separated" required />
              <input name="image" type="url" value={editingProject.image || ""} onChange={(event) => setEditingProject({ ...editingProject, image: event.target.value })} placeholder="Cover image URL (optional)" />
              {editingProject.image && (
                <div className="project-image-preview">
                  <p>Cover image preview</p>
                  <img src={editingProject.image} alt="Project cover preview" />
                </div>
              )}
              <input name="githubLink" value={editingProject.githubLink || ""} onChange={(event) => setEditingProject({ ...editingProject, githubLink: event.target.value })} placeholder="GitHub URL (optional)" type="url" />
              <input name="liveLink" value={editingProject.liveLink || ""} onChange={(event) => setEditingProject({ ...editingProject, liveLink: event.target.value })} placeholder="Live demo URL (optional)" type="url" />
              <textarea name="description" value={editingProject.description} onChange={(event) => setEditingProject({ ...editingProject, description: event.target.value })} placeholder="Project description" rows="4" required />
              <div className="project-form-actions">
                <button className="save-project-button" type="submit">Update Project</button>
                <button className="cancel-project-button" type="button" onClick={() => setEditingProject(null)}>Cancel</button>
              </div>
            </form>
          )}

          {projectLoading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects added yet.</p>
          ) : (
            <div className="messages-list">
              {projects.map((project) => (
                <div className="message-card" key={project._id}>
                  {project.image && (
                    <a className="project-cover-link" href={project.image} target="_blank" rel="noopener noreferrer">
                      <img className="project-cover-image" src={project.image} alt={`${project.title} cover`} loading="lazy" />
                    </a>
                  )}
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p><strong>Category:</strong> {project.category}</p>
                  <p><strong>Technologies:</strong> {project.technologies.join(", ")}</p>
                  <div className="project-admin-actions">
                    {project.githubLink && <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>}
                    {project.liveLink && <a href={project.liveLink} target="_blank" rel="noopener noreferrer">Live Demo</a>}
                    <button className="edit-project-button" type="button" onClick={() => handleEditProject(project)}>Edit</button>
                    <button className="delete-message-button" type="button" onClick={() => handleDeleteProject(project._id)}>
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-card skill-admin-card">
          <div className="dashboard-card-heading">
            <h2>My Skills</h2>
            <button
              className="add-project-button"
              type="button"
              onClick={() => setShowSkillForm((visible) => !visible)}
            >
              <FaPlus />
              {showSkillForm ? "Cancel" : "Add Skill"}
            </button>
          </div>

          {showSkillForm && (
            <form className="skill-form" onSubmit={handleSkillSubmit}>
              <input name="name" value={skillForm.name} onChange={handleSkillChange} placeholder="Skill name" required />
              <select name="level" value={skillForm.level} onChange={handleSkillChange}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
              </select>
              <input name="percentage" value={skillForm.percentage} onChange={handleSkillChange} placeholder="Proficiency (0-100)" type="number" min="0" max="100" required />
              <button className="save-project-button" type="submit">Save Skill</button>
            </form>
          )}

          {skillLoading ? (
            <p>Loading skills...</p>
          ) : skills.length === 0 ? (
            <p>No custom skills added yet.</p>
          ) : (
            <div className="admin-skill-list">
              {skills.map((skill) => (
                <div className="admin-skill-row" key={skill._id}>
                  <div>
                    <strong>{skill.name}</strong>
                    <span>{skill.level}</span>
                  </div>
                  <b>{skill.percentage}%</b>
                  <button className="delete-message-button" type="button" onClick={() => handleDeleteSkill(skill._id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RESUME MANAGEMENT */}
        <div className="dashboard-card resume-admin-card">
          <div className="dashboard-card-heading">
            <h2>Resume Management</h2>
          </div>

          {resume ? (
            <div className="current-resume-info">
              <p><strong>Current resume:</strong> {resume.filename}</p>
              <div className="resume-actions">
                <a href={resume.url} target="_blank" rel="noreferrer">
                  View current resume
                </a>
                <button
                  className="delete-message-button"
                  type="button"
                  onClick={handleDeleteResume}
                  disabled={resumeDeleting || resumeUploading}
                >
                  <FaTrash />
                  {resumeDeleting ? "Deleting..." : "Delete Resume"}
                </button>
              </div>
            </div>
          ) : (
            <p>No resume uploaded yet. Choose a PDF file to upload your first resume.</p>
          )}

          <form className="resume-form" onSubmit={handleResumeUpload}>
            <label htmlFor="resume-file-input">Choose resume (PDF, maximum 5 MB)</label>
            <input
              id="resume-file-input"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
            {resumeFile && <p>Selected file: {resumeFile.name}</p>}
            <button
              className="save-project-button"
              type="submit"
              disabled={resumeUploading}
            >
              {resumeUploading ? "Uploading..." : resume ? "Replace Resume" : "Upload Resume"}
            </button>
          </form>
        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;
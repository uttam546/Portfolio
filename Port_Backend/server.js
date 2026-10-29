
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const { Readable } = require("stream");

const Contact = require("./models/Contact");
const Comment = require("./models/Comment");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
const Project = require("./models/Project");
const Skill = require("./models/Skill");
const Resume = require("./models/Resume");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = process.env.PORT || 5000;

// ======================================
// CLOUDINARY CONFIGURATION
// ======================================

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ======================================
// MULTER CONFIGURATION
// ======================================

const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/pdf" &&
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed."));
    }
  },
});

// ======================================
// MIDDLEWARE
// ======================================

app.use(cors());
app.use(express.json());

// ======================================
// TEST PROTECTED API
// ======================================

app.get("/api/admin/protected", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "You accessed a protected API!",
    admin: req.admin,
  });
});

// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {
  res.send("Smart Portfolio Backend is running!");
});

// ======================================
// COMMENTS API
// ======================================

app.get("/api/comments", async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments.",
    });
  }
});

app.get("/api/admin/comments", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch comments.",
    });
  }
});

app.delete("/api/admin/comments/:id", authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid comment ID.",
      });
    }

    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete comment.",
    });
  }
});

app.post("/api/comments", async (req, res) => {
  try {
    const { name, text } = req.body;
    if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
      return res.status(400).json({
        success: false,
        message: "A name of 80 characters or fewer is required.",
      });
    }
    if (typeof text !== "string" || !text.trim() || text.trim().length > 1000) {
      return res.status(400).json({
        success: false,
        message: "A comment of 1,000 characters or fewer is required.",
      });
    }
    const newComment = await Comment.create({ name: name.trim(), text: text.trim() });
    res.status(201).json({
      success: true,
      message: "Thank you for your feedback!",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error saving comment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit comment.",
    });
  }
});

// ======================================
// SKILLS API
// ======================================

app.get("/api/skills", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      skills,
    });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch skills.",
    });
  }
});

app.post("/api/admin/skills", authMiddleware, async (req, res) => {
  try {
    const { name, level, percentage } = req.body;

    if (!name || !level || percentage === undefined || percentage === "") {
      return res.status(400).json({
        success: false,
        message: "Skill name, level, and percentage are required.",
      });
    }

    const skill = await Skill.create({ name, level, percentage });

    res.status(201).json({
      success: true,
      message: "Skill added successfully!",
      skill,
    });
  } catch (error) {
    console.error("Error creating skill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add skill.",
    });
  }
});

app.put("/api/admin/skills/:id", authMiddleware, async (req, res) => {
  try {
    const { name, level, percentage } = req.body;

    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { name, level, percentage },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill updated successfully!",
      skill,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update skill.",
    });
  }
});

app.delete("/api/admin/skills/:id", authMiddleware, async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting skill:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete skill.",
    });
  }
});

// ======================================
// GET CONTACT MESSAGES
// ======================================

app.get("/api/admin/messages", authMiddleware, async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages.",
    });
  }
});

// ======================================
// DELETE CONTACT MESSAGE
// ======================================

app.delete("/api/admin/messages/:id", authMiddleware, async (req, res) => {
  try {
    const deletedMessage = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message.",
    });
  }
});

// ======================================
// CONTACT API
// ======================================

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const newContact = new Contact({
      name,
      email,
      subject,
      message,
    });

    await newContact.save();

    console.log("New contact message saved!");

    res.status(201).json({
      success: true,
      message: "Your message has been sent successfully!",
    });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send your message.",
    });
  }
});

// ======================================
// CREATE PROJECT API
// ======================================

app.post("/api/admin/projects", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      category,
      githubLink,
      liveLink,
      image,
    } = req.body;

    if (!title || !description || !technologies || !category) {
      return res.status(400).json({
        success: false,
        message: "Required project fields are missing.",
      });
    }

    const newProject = new Project({
      title,
      description,
      technologies,
      category,
      githubLink,
      liveLink,
      image,
    });

    const savedProject = await newProject.save();

    console.log("Project created successfully!");

    res.status(201).json({
      success: true,
      message: "Project created successfully!",
      project: savedProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
});

// ======================================
// GET ALL PROJECTS API
// ======================================

app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects.",
    });
  }
});

// ======================================
// DELETE PROJECT API
// ======================================

app.delete("/api/admin/projects/:id", authMiddleware, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
});

// ======================================
// UPDATE PROJECT API
// ======================================

app.put("/api/admin/projects/:id", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      category,
      githubLink,
      liveLink,
      image,
    } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        technologies,
        category,
        githubLink,
        liveLink,
        image,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully!",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project.",
    });
  }
});

// ======================================
// ADMIN REGISTER API
// ======================================

app.post("/api/admin/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();

    console.log("Admin registered successfully!");

    res.status(201).json({
      success: true,
      message: "Admin registered successfully!",
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register admin.",
    });
  }
});

// ======================================
// ADMIN LOGIN API
// ======================================

app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("Admin logged in successfully!");

    res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed.",
    });
  }
});

// ======================================
// RESUME API - GET CURRENT RESUME
// ======================================

app.get("/api/resume", async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch resume.",
    });
  }
});

// ======================================
// RESUME API - UPLOAD OR REPLACE
// ======================================

app.post(
  "/api/admin/resume",
  authMiddleware,
  resumeUpload.single("resume"),
  async (req, res) => {
    let uploadedFile = null;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a PDF resume.",
        });
      }

      // Check the PDF file signature
      if (
        req.file.buffer.length < 5 ||
        req.file.buffer.subarray(0, 5).toString() !== "%PDF-"
      ) {
        return res.status(400).json({
          success: false,
          message: "The selected file is not a valid PDF.",
        });
      }

      // Upload the PDF to Cloudinary
      uploadedFile = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            type:"upload",
            folder: "smart-portfolio/resume",
            public_id: `resume-${Date.now()}.pdf`,
            use_filename: false,
            access_mode:"public",
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }

            resolve(result);
          }
        );

        stream.end(req.file.buffer);
      });

      // Save the new resume in MongoDB
      const newResume = await Resume.create({
        url: uploadedFile.secure_url,
        publicId: uploadedFile.public_id,
        filename: req.file.originalname,
      });

      // Delete old resume records and files
      const oldResumes = await Resume.find({
        _id: { $ne: newResume._id },
      });

      for (const oldResume of oldResumes) {
        try {
          await cloudinary.uploader.destroy(oldResume.publicId, {
            resource_type: "raw",
          });

          await Resume.deleteOne({ _id: oldResume._id });
        } catch (cleanupError) {
          console.error(
            "Old resume cleanup failed:",
            cleanupError.message
          );
        }
      }

      return res.status(201).json({
        success: true,
        message: "Resume uploaded successfully!",
        resume: newResume,
      });
    } catch (error) {
      console.error("Resume upload error:", error);

      // Remove newly uploaded file if saving failed
      if (uploadedFile) {
        try {
          await cloudinary.uploader.destroy(uploadedFile.public_id, {
            resource_type: "raw",
          });
        } catch (cleanupError) {
          console.error(
            "Upload cleanup failed:",
            cleanupError.message
          );
        }
      }

      return res.status(500).json({
        success: false,
        message: "Failed to upload resume.",
      });
    }
  }
);

/* ======================================
   DELETE RESUME API
====================================== */

app.delete("/api/admin/resume", authMiddleware, async (req, res) => {
  try {
    const resume = await Resume.findOne().sort({ createdAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "No resume found to delete.",
      });
    }

    // Delete from Cloudinary first
    await cloudinary.uploader.destroy(resume.publicId, {
      resource_type: "raw",
    });

    // Delete from MongoDB
    await Resume.deleteMany({});

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully!",
    });
  } catch (error) {
    console.error("Resume deletion error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete resume.",
    });
  }
});

// ======================================
// MULTER ERROR HANDLER
// ======================================

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Resume must be 5 MB or smaller."
        : error.message;

    return res.status(400).json({
      success: false,
      message,
    });
  }

  if (error.message === "Only PDF files are allowed.") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next(error);
});

// ======================================
// MONGODB CONNECTION
// ======================================

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed: ❌");
    console.error(error);
  });

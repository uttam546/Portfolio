
import { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

// Add the information you want visitors to know.
// Replace the examples with accurate, public information.
const profile = {
  name: "Uttam Pal",
  role: "Software Developer",
  about:
    "Hi! I'm Uttam Pal, a Computer Science Engineering student and aspiring software developer. I enjoy building web applications and exploring technologies like Java, React, and the MERN stack. I'm passionate about learning, solving problems, and creating useful digital experiences.",
  education:
    "I have done Schooling From Regency Public School, ICSE Board,Currently persueing Bachelor of technology in Computer Science Engineering, AKTU University, 2023-27.",
  skills:
    "Programming Languages are Java, Python, Javascript, HTML, CSS, SQL, frameworks, databases, and tools: Postman, git, Github, Vs code, etc.",
  projects:
    "Projects are Job-Portal, Student Management System, Heart-Guard-Ai, Data Analysis etc.,.",
  career:
    "I want to work as a software developer and contribute to innovative projects.",
  interests:
    "I enjoy reading books, Writing some imagination thinking, and exploring new technologies.",
  strengths:
    "I am always ready to solve new challenges, adaptable to new environments, and have strong problem-solving skills.",
  experience:
    "I have done summer internship from Edrealm by MERN Stack as fullstack devloper.",
  contact:
    "Visit the Contact section of this portfolio to find my available contact links.",
  github:
    "github.com/uttam546.",
  linkedin:
    "linkedin.com/in/uttam-pal-86897832b .",
  resume:
    "Visit the Resume section or use the resume link on this portfolio.",
};

const knowledge = [
  {
    keys: ["hello", "hi", "hey", "नमस्ते", "हेलो", "प्रणाम"],
    field: null,
    en: `Hi! 👋 I'm ${profile.name}'s portfolio assistant. Ask me about their background, education, skills, projects, career, or interests.`,
    hi: `नमस्ते! 👋 मैं ${profile.name} का पोर्टफोलियो असिस्टेंट हूँ। आप उनकी शिक्षा, स्किल्स, प्रोजेक्ट्स, करियर और रुचियों के बारे में पूछ सकते हैं।`,
  },
  {
    keys: ["who are you", "your name", "name", "नाम", "कौन हो", "आपका नाम"],
    field: "name",
  },
  {
    keys: ["about", "introduction", "introduce", "yourself", "परिचय", "अपने बारे", "बताओ"],
    field: "about",
  },
  {
    keys: ["education", "college", "degree", "study", "शिक्षा", "कॉलेज", "पढ़ाई", "डिग्री"],
    field: "education",
  },
  {
    keys: ["skills", "skill", "technology", "tech stack", "कौशल", "स्किल", "तकनीक"],
    field: "skills",
  },
  {
    keys: ["projects", "project", "built", "प्रोजेक्ट", "परियोजना"],
    field: "projects",
  },
  {
    keys: ["career", "goal", "future", "job", "career goal", "करियर", "लक्ष्य", "भविष्य", "नौकरी"],
    field: "career",
  },
  {
    keys: ["hobby", "hobbies", "interest", "interests", "शौक", "रुचि", "पसंद"],
    field: "interests",
  },
  {
    keys: ["strength", "strengths", "quality", "qualities", "खूबी", "खूबियां", "ताकत"],
    field: "strengths",
  },
  {
    keys: ["achievement", "achievements", "certificate", "certifications", "award", "उपलब्धि", "सर्टिफिकेट", "पुरस्कार"],
    field: "achievements",
  },
  {
    keys: ["experience", "internship", "work experience", "अनुभव", "इंटर्नशिप"],
    field: "experience",
  },
  {
    keys: ["contact", "email", "reach", "hire", "संपर्क", "ईमेल", "हायर"],
    field: "contact",
  },
  {
    keys: ["github", "गिटहब", "source code", "सोर्स कोड"],
    field: "github",
  },
  {
    keys: ["linkedin", "लिंक्डइन"],
    field: "linkedin",
  },
  {
    keys: ["resume", "cv", "रिज्यूमे", "रिज़्यूमे"],
    field: "resume",
  },
];

function getAnswer(message) {
  const text = message.toLowerCase().trim();
  const isHindi = /[\u0900-\u097f]/.test(text);

  // Prefer the longest matching keyword.
  const matches = knowledge
    .flatMap((item) =>
      item.keys
        .filter((key) => text.includes(key.toLowerCase()))
        .map((key) => ({ ...item, matchedKey: key }))
    )
    .sort((a, b) => b.matchedKey.length - a.matchedKey.length);

  if (matches.length === 0) {
    return isHindi
      ? "माफ़ कीजिए, इस सवाल का जवाब मेरी जानकारी में नहीं है। आप मेरी शिक्षा, स्किल्स, प्रोजेक्ट्स, करियर या रुचियों के बारे में पूछ सकते हैं।"
      : "I don't have that information yet. You can ask about my education, skills, projects, career, interests, or experience.";
  }

  const match = matches[0];

  if (match.en) {
    return isHindi ? match.hi : match.en;
  }

  const value = profile[match.field];

  if (!value || value.startsWith("YOUR ") || value.startsWith("Add ") || value.startsWith("Write ")) {
    return isHindi
      ? "इस जानकारी को अभी पोर्टफोलियो में जोड़ा नहीं गया है। कृपया दूसरे विषय के बारे में पूछें।"
      : "This information hasn't been added to the portfolio yet. Please ask about another topic.";
  }

  if (match.field === "name") {
    return isHindi
      ? `मेरा नाम ${value} है।`
      : `My name is ${value}.`;
  }

  return value;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: `Hi! 👋 नमस्ते! I'm ${profile.name}'s portfolio assistant. Ask me about the developer in English or Hindi.`,
    },
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isOpen]);

  function sendMessage(value = input) {
    const text = value.trim();
    if (!text) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text },
      { role: "bot", text: getAnswer(text) },
    ]);

    setInput("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  const suggestions = [
    "Tell me about yourself",
    "आपकी स्किल्स क्या हैं?",
    "What are your projects?",
    "आपके शौक क्या हैं?",
  ];

  return (
    <div className="portfolio-chatbot">
      {isOpen && (
        <section
          className="chat-window"
          role="dialog"
          aria-label="Portfolio assistant"
        >
          <header className="chat-header">
            <div className="chat-avatar" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3a8 8 0 0 0-8 8v3a3 3 0 0 0 3 3h1v-6H7a8 8 0 0 1 10 0h-1v6h1a3 3 0 0 0 3-3v-3a8 8 0 0 0-8-8Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 20h6M12 17v3"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="chat-header-text">
              <h3>Portfolio Assistant</h3>
              <span>
                <span className="online-dot" />
                हिंदी / English
              </span>
            </div>

            <button
              className="chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </header>

          <div className="chat-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.role}`}
              >
                {message.text.split("\n").map((line, i) => (
                  <div key={i}>{line || "\u00A0"}</div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="chat-suggestions">
              <p>Try asking / पूछें</p>
              {suggestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          <form className="chat-input-area" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask me / अपना सवाल लिखें..."
              aria-label="Type your message"
              maxLength={500}
            />

            <button
              type="submit"
              className="chat-send"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <div className="chat-footer">
            Portfolio Assistant · FAQ mode
          </div>
        </section>
      )}

      <button
        className="chat-launcher"
        onClick={() => setIsOpen((previous) => !previous)}
        aria-label={isOpen ? "Close chat" : "Open portfolio chat"}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="m6 6 12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
    </div>
  );
}

import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import About from "../components/About/About";
import Skills from "../components/Skills/Skills";
import Projects from "../components/Projects/Projects";
import Education from "../components/Education/Education";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import CommentBox from "../components/CommentBox";
import axios from "axios";

function Home() {
	// Submit comment to backend
	const handleCommentSubmit = async (name, commentText) => {
		const response = await axios.post("http://localhost:5000/api/comments", { name, text: commentText });
		if (!response.data.success) throw new Error("Comment submission failed.");
		return response.data.comment;
	};

	return (
		<div className="app-shell">
			<Navbar />
			<Hero />
			<About />
			<Skills />
			<Projects />
			<Education />
			<CommentBox onCommentSubmit={handleCommentSubmit} />
			<Contact />
			<Footer />
		</div>
	);
}

export default Home;

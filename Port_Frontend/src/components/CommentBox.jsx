import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CommentBox.css';

const CommentBox = ({ onCommentSubmit }) => {
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const openDrawer = () => setIsOpen(true);
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/comments');
        setComments(response.data.comments || []);
      } catch (fetchError) {
        setError('Comments are temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
    window.addEventListener('portfolio:open-comments', openDrawer);
    return () => window.removeEventListener('portfolio:open-comments', openDrawer);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const author = name.trim();
    const text = comment.trim();
    if (!author || !text) return;

    try {
      const savedComment = await onCommentSubmit(author, text);
      if (!savedComment) throw new Error('Comment was not saved.');
      setComments((currentComments) => [savedComment, ...currentComments]);
      setName('');
      setComment('');
      setError('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (submitError) {
      setError('Could not submit your comment. Please try again.');
    }
  };

  return (
    <>
      {isOpen && (
        <div className="comments-drawer-layer">
          <button
            className="comments-drawer-backdrop"
            type="button"
            aria-label="Close comments"
            onClick={() => setIsOpen(false)}
          />
          <aside
            className="comments-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comments-title"
          >
            <header className="comments-drawer-header">
              <div>
                <p>PORTFOLIO GUESTBOOK</p>
                <h2 id="comments-title">Comments <span>{comments.length}</span></h2>
              </div>
              <button
                className="comments-close-button"
                type="button"
                aria-label="Close comments"
                onClick={() => setIsOpen(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </header>

            <div className="comments-drawer-content">
              <form className="comment-box" onSubmit={handleSubmit}>
                <h3>Leave a comment</h3>
                <label htmlFor="comment-author">Your name</label>
                <input
                  id="comment-author"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name shown with your comment"
                  maxLength={80}
                  autoComplete="name"
                  required
                />
                <label htmlFor="comment-text">Your comment</label>
                <textarea
                  id="comment-text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  maxLength={1000}
                  required
                />
                <button type="submit">Post comment</button>
                {success && <div className="success-msg" role="status">Thanks for sharing your thoughts.</div>}
                {error && <div className="comment-error" role="alert">{error}</div>}
              </form>

              <section className="public-comment-list" aria-live="polite">
                <h3>From visitors</h3>
                {loading ? (
                  <p className="comments-empty">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="comments-empty">No comments yet.</p>
                ) : (
                  <ul>
                    {comments.map((item) => (
                      <li key={item._id}>
                        <div className="comment-meta">
                          <strong>{item.name || 'Anonymous'}</strong>
                          <time dateTime={item.createdAt}>
                            {new Date(item.createdAt).toLocaleDateString()}
                          </time>
                        </div>
                        <p>{item.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </aside>
        </div>
      )}
    </>
  );
};

export default CommentBox;

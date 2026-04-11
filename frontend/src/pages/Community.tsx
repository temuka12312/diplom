import { useEffect, useState } from "react";
import {
  getCommunityPosts,
  createCommunityPost,
  createCommunityComment,
  type CommunityPost,
} from "../api/community";
import { getApiErrorMessage } from "../api/axios";

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getCommunityPosts();
      setPosts(data);
    } catch {
      setError("Failed to load community posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!content.trim()) return;

    try {
      await createCommunityPost({
        title: title.trim(),
        content: content.trim(),
        lesson: null,
      });
      setTitle("");
      setContent("");
      loadPosts();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to create post"));
    }
  };

  const handleAddComment = async (postId: number) => {
    const value = commentInputs[postId]?.trim();
    if (!value) return;

    try {
      await createCommunityComment({
        post: postId,
        content: value,
      });

      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      loadPosts();
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, "Failed to add comment"));
    }
  };

  if (loading) {
    return <div className="container page-shell"><p>Loading community...</p></div>;
  }

  return (
    <div className="container page-shell">
      <div className="page-header">
        <span className="page-kicker">Community</span>
        <h1 className="page-title">Learning Community</h1>
        <p className="page-subtitle">
          Web development, programming болон хичээлтэй холбоотой асуулт, санал энд бичнэ.
        </p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginTop: 0 }}>Create a Post</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <input
            className="chat-input"
            placeholder="Post title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="chat-input"
            placeholder="Ask a question or share an idea..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />

          <div>
            <button className="button" onClick={handleCreatePost}>
              Publish Post
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 18 }}>
        {posts.length === 0 ? (
          <div className="card">
            <p>No posts yet.</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card">
              <div style={{ marginBottom: 10 }}>
                <h3 style={{ margin: "0 0 8px" }}>
                  {post.title || "Community Discussion"}
                </h3>
                <p style={{ margin: 0, fontSize: 14, color: "#6b7f99" }}>
                  By <strong>{post.author_username}</strong>
                </p>
              </div>

              <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

              <div style={{ marginTop: 18 }}>
                <h4 style={{ marginBottom: 10 }}>Comments</h4>

                <div style={{ display: "grid", gap: 10 }}>
                  {post.comments.length === 0 ? (
                    <p style={{ color: "#6b7f99" }}>No comments yet.</p>
                  ) : (
                    post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          background: "rgba(255,255,255,0.55)",
                          border: "1px solid rgba(167,191,220,0.26)",
                        }}
                      >
                        <p style={{ margin: "0 0 6px", fontWeight: 700 }}>
                          {comment.author_username}
                        </p>
                        <p style={{ margin: 0 }}>{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                  <input
                    className="chat-input"
                    placeholder="Write a comment..."
                    value={commentInputs[post.id] || ""}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <button className="button" onClick={() => handleAddComment(post.id)}>
                    Comment
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

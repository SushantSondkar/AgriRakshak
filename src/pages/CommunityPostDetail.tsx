import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  MapPin, 
  Stethoscope, 
  Send, 
  UserCheck 
} from 'lucide-react';
import { 
  getStoredPosts, 
  getStoredReplies, 
  saveStoredReply, 
  togglePostHelpful 
} from '../services/communityService';
import type { CommunityPost, CommunityReply } from '../types/community';
import './CommunityPostDetail.css';

export const CommunityPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<CommunityPost | null>(null);
  const [replies, setReplies] = useState<CommunityReply[]>([]);
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isExpertReply, setIsExpertReply] = useState(false);

  useEffect(() => {
    if (!id) return;
    const allPosts = getStoredPosts();
    const found = allPosts.find(p => p.id === id);
    if (found) {
      setPost(found);
      const postReplies = getStoredReplies(id);
      setReplies(postReplies);
    }
  }, [id]);

  if (!post) {
    return (
      <div className="detail-container">
        <button className="back-btn" onClick={() => navigate('/community')}>
          <ArrowLeft size={18} />
          <span>Back to Community</span>
        </button>
        <div className="empty-feed-card">
          <h2>Discussion Not Found</h2>
          <p>The requested post could not be loaded.</p>
        </div>
      </div>
    );
  }

  const handleHelpful = () => {
    const updated = togglePostHelpful(post.id);
    if (updated) setPost(updated);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyContent.trim() || !id) return;

    const reply: CommunityReply = {
      id: `rep-${Date.now()}`,
      post_id: id,
      author_name: isExpertReply ? 'Dr. Ramesh Sharma' : 'Farmer User',
      author_role: isExpertReply ? 'Agriculture Officer' : 'Farmer',
      author_location: 'Pune Region',
      is_expert: isExpertReply,
      is_verified_expert: isExpertReply,
      content: newReplyContent,
      helpful_count: 0,
      created_at: new Date().toISOString()
    };

    saveStoredReply(id, reply);
    setReplies(prev => [...prev, reply]);
    setNewReplyContent('');
  };

  const verifiedExpertAnswer = replies.find(r => r.is_verified_expert);

  return (
    <div className="detail-container animate-fade-in">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate('/community')}>
        <ArrowLeft size={18} />
        <span>Back to Community Forum</span>
      </button>

      {/* Main Post Card */}
      <div className="detail-post-card">
        <div className="post-author-row">
          <div className="post-author-avatar">{post.author_name.charAt(0)}</div>
          <div className="post-author-meta">
            <div className="author-name-box">
              <h4>{post.author_name}</h4>
              {post.is_verified_expert && (
                <span className="verified-expert-badge">
                  <CheckCircle2 size={13} /> Verified Expert
                </span>
              )}
            </div>
            <span className="author-subtext">
              <MapPin size={12} /> {post.author_location} • {post.time_ago}
            </span>
          </div>
        </div>

        <h1 className="detail-post-title">{post.title}</h1>

        <div className="post-tags-row">
          <span className="tag-chip crop-chip">🌱 {post.crop}</span>
          <span className="tag-chip category-chip">{post.category}</span>
        </div>

        <p className="detail-post-content">{post.content}</p>

        {/* Attached Photo + Crop Doctor Shortcut */}
        {post.image_url && (
          <div className="detail-image-box">
            <img src={post.image_url} alt="Crop" />
            <button className="btn-crop-doctor-link" onClick={() => navigate('/crop-doctor')}>
              <Stethoscope size={16} />
              <span>Analyze with Crop Doctor</span>
            </button>
          </div>
        )}

        <div className="post-bottom-bar">
          <div className="post-stats">
            <span><ThumbsUp size={14} /> {post.helpful_count} Helpful</span>
            <span><MessageSquare size={14} /> {replies.length} Replies</span>
            <span>{post.views_count} Views</span>
          </div>

          <div className="post-action-buttons">
            <button className={`btn-post-action ${post.is_helpful_by_me ? 'active' : ''}`} onClick={handleHelpful}>
              <ThumbsUp size={16} />
              <span>Helpful</span>
            </button>
            <button className="btn-post-action">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Verified Expert Answer Highlight Card */}
      {verifiedExpertAnswer && (
        <div className="verified-expert-answer-card">
          <div className="expert-answer-header">
            <UserCheck size={20} color="#2e7d32" />
            <span>✓ VERIFIED EXPERT ANSWER</span>
          </div>
          <div className="expert-author">
            <strong>{verifiedExpertAnswer.author_name}</strong> — {verifiedExpertAnswer.author_role}
          </div>
          <p>{verifiedExpertAnswer.content}</p>
        </div>
      )}

      {/* Replies List */}
      <div className="replies-section-card">
        <h2>💬 Community Replies ({replies.length})</h2>

        <div className="replies-list">
          {replies.map(rep => (
            <div key={rep.id} className={`reply-item ${rep.is_verified_expert ? 'expert-reply' : ''}`}>
              <div className="reply-avatar">{rep.author_name.charAt(0)}</div>
              <div className="reply-body">
                <div className="reply-meta">
                  <strong>{rep.author_name}</strong>
                  {rep.is_verified_expert && <span className="verified-tag">✓ Verified Expert</span>}
                  <span className="reply-time">{new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p>{rep.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Add Reply Form */}
        <form onSubmit={handleAddReply} className="reply-form">
          <div className="form-group">
            <label>Share your experience or advice</label>
            <textarea 
              rows={3} 
              placeholder="Write a helpful reply..."
              value={newReplyContent}
              onChange={e => setNewReplyContent(e.target.value)}
              required 
            />
          </div>

          <div className="reply-form-footer">
            <label className="expert-toggle-lbl">
              <input 
                type="checkbox" 
                checked={isExpertReply} 
                onChange={e => setIsExpertReply(e.target.checked)} 
              />
              <span>Post as Agriculture Extension Expert</span>
            </label>

            <button type="submit" className="btn-primary-action">
              <Send size={16} />
              <span>Post Reply</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

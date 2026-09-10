import { MessageSquare, ThumbsUp } from 'lucide-react';
import './Community.css';

const MOCK_POSTS = [
  { id: 1, author: 'Suresh Desai', region: 'Pune', time: '2 hours ago', content: 'Has anyone tried the new organic pesticide for Onion crops? Seeing good results.', likes: 12, comments: 4 },
  { id: 2, author: 'Expert: Dr. Sharma', region: 'Agri Inst.', time: '5 hours ago', content: 'Due to the sudden spike in humidity, please ensure your cotton fields are well drained to prevent root rot.', likes: 45, comments: 8 },
];

export const Community = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Community Forum</h1>
        <p>Discuss with fellow farmers and experts</p>
      </div>

      <div className="posts-list">
        {MOCK_POSTS.map(post => (
          <div key={post.id} className="glass-panel post-card">
            <div className="post-header">
              <div className="post-avatar">{post.author.charAt(0)}</div>
              <div className="post-meta">
                <h4>{post.author}</h4>
                <span>{post.region} • {post.time}</span>
              </div>
            </div>
            <p className="post-content">{post.content}</p>
            <div className="post-actions">
              <button><ThumbsUp size={16} /> {post.likes}</button>
              <button><MessageSquare size={16} /> {post.comments}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

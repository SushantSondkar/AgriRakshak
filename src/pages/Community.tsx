import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  MessageSquare, 
  Radio, 
  Plus, 
  Search, 
  ArrowUpDown, 
  Pin, 
  MapPin, 
  ThumbsUp, 
  Eye, 
  Share2, 
  CheckCircle2, 
  Sprout, 
  Stethoscope, 
  Flame, 
  ShieldAlert, 
  X,
  ChevronRight
} from 'lucide-react';
import { 
  getStoredPosts, 
  createNewPost, 
  togglePostHelpful 
} from '../services/communityService';
import type { CommunityPost, CommunityCategory, CreatePostInput } from '../types/community';
import { useLanguage } from '../i18n/LanguageContext';
import './Community.css';

const CATEGORIES: Array<{ key: CommunityCategory; label: string; icon: string }> = [
  { key: 'All', label: 'All Discussions', icon: '💬' },
  { key: 'Crops', label: 'Crops', icon: '🌾' },
  { key: 'Pest & Disease', label: 'Pest & Disease', icon: '🐛' },
  { key: 'Irrigation', label: 'Irrigation', icon: '💧' },
  { key: 'Soil', label: 'Soil Health', icon: '🌱' },
  { key: 'Weather', label: 'Weather Impact', icon: '🌦️' },
  { key: 'Market Prices', label: 'Market Prices', icon: '💰' },
  { key: 'Crop Protection', label: 'Crop Protection', icon: '🧪' },
  { key: 'Government Schemes', label: 'Govt Schemes', icon: '🏛️' }
];

const CROPS_LIST = ['Tomato', 'Cotton', 'Soybean', 'Onion', 'Grapes', 'Wheat', 'Rice', 'General'];

export const Community = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<CommunityCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'latest' | 'discussed' | 'helpful'>('latest');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCrop, setNewCrop] = useState('Onion');
  const [newCategory, setNewCategory] = useState<CommunityCategory>('Pest & Disease');
  const [newContent, setNewContent] = useState('');
  const [newLocation, setNewLocation] = useState('Pune');
  const [newImage, setNewImage] = useState<string | null>(null);

  useEffect(() => {
    const data = getStoredPosts();
    setPosts(data);
  }, []);

  const handleHelpfulClick = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = togglePostHelpful(postId);
    if (updated) {
      setPosts(prev => prev.map(p => p.id === postId ? updated : p));
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const input: CreatePostInput = {
      title: newTitle,
      crop: newCrop,
      category: newCategory,
      content: newContent,
      location: newLocation,
      image_url: newImage || undefined
    };

    const created = createNewPost(input);
    setPosts(prev => [created, ...prev]);
    setShowCreateModal(false);

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewImage(null);
  };

  // Filter & Sort
  const filteredPosts = posts.filter(post => {
    const matchesCat = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'latest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    if (sortBy === 'discussed') return b.reply_count - a.reply_count;
    if (sortBy === 'helpful') return b.helpful_count - a.helpful_count;
    return 0;
  });

  const pinnedPost = posts.find(p => p.is_pinned);

  return (
    <div className="community-container animate-fade-in">
      {/* 1. PAGE HEADER & STATS ROW */}
      <div className="community-header-card">
        <div className="header-top-row">
          <div className="title-block">
            <div className="community-icon-box">
              <Sprout size={32} color="#1b5e20" />
            </div>
            <div>
              <h1>{t('community.title')}</h1>
              <p>{t('community.subtitle')}</p>
            </div>
          </div>

          <button className="btn-ask-community" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            <span>{t('community.btnAskCommunity')}</span>
          </button>
        </div>

        {/* Telemetry Stats Pills */}
        <div className="stats-pills-row">
          <div className="stat-pill">
            <Users size={16} color="var(--color-primary-light)" />
            <span><strong>1,240+</strong> {t('community.activeFarmers')}</span>
          </div>
          <div className="stat-pill">
            <UserCheck size={16} color="#0288d1" />
            <span><strong>48</strong> {t('community.expertsCount')}</span>
          </div>
          <div className="stat-pill">
            <MessageSquare size={16} color="#b45309" />
            <span><strong>3,150</strong> {t('community.discussionsCount')}</span>
          </div>
          <div className="stat-pill online">
            <Radio size={14} color="#2e7d32" />
            <span><strong>182</strong> {t('community.onlineNow')}</span>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTERS BAR */}
      <div className="category-scroll-bar">
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            className={`category-chip ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.key)}
          >
            <span className="chip-icon">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 3. SEARCH & SORT BAR */}
      <div className="community-controls-card">
        <div className="comm-search-box">
          <Search size={18} color="var(--color-text-muted)" />
          <input 
            type="text" 
            placeholder={t('community.searchDiscussionsPlaceholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="comm-sort-dropdown">
          <ArrowUpDown size={16} />
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="latest">{t('community.sortLatest')}</option>
            <option value="discussed">{t('community.sortDiscussed')}</option>
            <option value="helpful">{t('community.sortHelpful')}</option>
          </select>
        </div>
      </div>

      {/* TWO-COLUMN LAYOUT: 70% MAIN FEED / 30% RIGHT SIDEBAR */}
      <div className="community-layout-grid">
        {/* LEFT COLUMN: POST FEED */}
        <div className="community-feed-col">
          {/* 6. PINNED DISCUSSION BANNER */}
          {pinnedPost && (
            <div className="pinned-post-card" onClick={() => navigate(`/community/post/${pinnedPost.id}`)}>
              <div className="pinned-header">
                <Pin size={18} color="#c2410c" />
                <span>Important Community Announcement</span>
              </div>
              <h3>{pinnedPost.title}</h3>
              <p>{pinnedPost.content}</p>
              <div className="pinned-footer">
                <span>By {pinnedPost.author_name} ({pinnedPost.author_role}) • {pinnedPost.reply_count} Replies</span>
                <span className="view-link">View Discussion <ChevronRight size={14} /></span>
              </div>
            </div>
          )}

          {/* POSTS LIST */}
          {filteredPosts.length === 0 ? (
            <div className="empty-feed-card">
              <Sprout size={48} color="var(--color-primary-light)" />
              <h3>Start the Conversation</h3>
              <p>No discussions found for this topic yet. Be the first farmer to ask a question.</p>
              <button className="btn-ask-community" onClick={() => setShowCreateModal(true)}>
                <Plus size={18} />
                <span>Ask Community</span>
              </button>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="post-item-card" onClick={() => navigate(`/community/post/${post.id}`)}>
                {/* Author Info */}
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

                {/* Question Title & Tags */}
                <h3 className="post-title-text">{post.title}</h3>

                <div className="post-tags-row">
                  <span className="tag-chip crop-chip">🌱 {post.crop}</span>
                  <span className="tag-chip category-chip">{post.category}</span>
                </div>

                {/* Content */}
                <p className="post-content-preview">{post.content}</p>

                {/* Attached Image + Crop Doctor CTA */}
                {post.image_url && (
                  <div className="post-image-container">
                    <img src={post.image_url} alt="Attached Crop" />
                    <button 
                      className="btn-crop-doctor-link" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/crop-doctor');
                      }}
                    >
                      <Stethoscope size={16} />
                      <span>Analyze with Crop Doctor</span>
                    </button>
                  </div>
                )}

                {/* Bottom Bar Stats & Action Buttons */}
                <div className="post-bottom-bar">
                  <div className="post-stats">
                    <span className="stat-item"><ThumbsUp size={14} /> {post.helpful_count} Helpful</span>
                    <span className="stat-item"><MessageSquare size={14} /> {post.reply_count} Replies</span>
                    <span className="stat-item"><Eye size={14} /> {post.views_count} Views</span>
                  </div>

                  <div className="post-action-buttons">
                    <button 
                      className={`btn-post-action ${post.is_helpful_by_me ? 'active' : ''}`}
                      onClick={e => handleHelpfulClick(post.id, e)}
                    >
                      <ThumbsUp size={16} />
                      <span>Helpful</span>
                    </button>
                    <button className="btn-post-action">
                      <MessageSquare size={16} />
                      <span>Reply</span>
                    </button>
                    <button className="btn-post-action" onClick={e => e.stopPropagation()}>
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 7. RIGHT SIDEBAR */}
        <aside className="community-sidebar-col">
          {/* Trending Discussions */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <Flame size={20} color="#c2410c" />
              <h3>Trending Discussions</h3>
            </div>
            <div className="trending-list">
              <div className="trending-item" onClick={() => navigate('/community/post/post-1')}>
                <h4>Onion disease management in foggy weather</h4>
                <span>💬 24 replies • Pune Region</span>
              </div>
              <div className="trending-item" onClick={() => navigate('/community/post/post-2')}>
                <h4>Cotton pest problem after rainfall</h4>
                <span>💬 18 replies • High Priority</span>
              </div>
              <div className="trending-item" onClick={() => navigate('/community/post/post-3')}>
                <h4>Soybean yellow leaf rust control</h4>
                <span>💬 15 replies • Baramati</span>
              </div>
            </div>
          </div>

          {/* Agriculture Experts */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <UserCheck size={20} color="var(--color-primary-light)" />
              <h3>Agriculture Experts</h3>
            </div>
            <div className="experts-list">
              <div className="expert-item">
                <div className="expert-avatar">DS</div>
                <div>
                  <h4>Dr. Ramesh Sharma</h4>
                  <span className="verified-tag">✓ Verified Expert</span>
                  <p>Senior Pathologist, KVK Nashik</p>
                </div>
              </div>

              <div className="expert-item">
                <div className="expert-avatar">SD</div>
                <div>
                  <h4>Dr. Sunita Deshmukh</h4>
                  <span className="verified-tag">✓ Verified Expert</span>
                  <p>Cotton Extension Officer</p>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Crops */}
          <div className="sidebar-card">
            <div className="sidebar-card-title">
              <Sprout size={20} color="var(--color-primary)" />
              <h3>Popular Crops</h3>
            </div>
            <div className="popular-crops-grid">
              <span onClick={() => setActiveCategory('Crops')}>🧅 Onion</span>
              <span onClick={() => setActiveCategory('Crops')}>🌿 Cotton</span>
              <span onClick={() => setActiveCategory('Crops')}>🌱 Soybean</span>
              <span onClick={() => setActiveCategory('Crops')}>🍅 Tomato</span>
              <span onClick={() => setActiveCategory('Crops')}>🍇 Grapes</span>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="sidebar-card guidelines-card">
            <div className="sidebar-card-title">
              <ShieldAlert size={20} color="#b45309" />
              <h3>Community Guidelines</h3>
            </div>
            <ul>
              <li>Keep discussions respectful and supportive.</li>
              <li>Share accurate, field-tested farming advice.</li>
              <li>Do not promote unverified chemical products.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* CREATE NEW DISCUSSION MODAL */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-box comm-modal-box animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="comm-modal-header">
              <h2>Create New Discussion</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="comm-modal-form">
              <div className="form-group">
                <label>Discussion Title *</label>
                <input 
                  type="text" 
                  placeholder="e.g. Why are my onion leaves turning yellow?"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Select Crop</label>
                  <select value={newCrop} onChange={e => setNewCrop(e.target.value)}>
                    {CROPS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value as any)}>
                    {CATEGORIES.filter(c => c.key !== 'All').map(c => (
                      <option key={c.key} value={c.key}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Discussion Details *</label>
                <textarea 
                  rows={4} 
                  placeholder="Describe your crop condition, symptoms, or question in detail..."
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location (District / Village)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Pune, Baramati"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Crop Photo (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="Paste Image URL or sample..."
                    value={newImage || ''}
                    onChange={e => setNewImage(e.target.value)} 
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary-action" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary-action">
                  Post Discussion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

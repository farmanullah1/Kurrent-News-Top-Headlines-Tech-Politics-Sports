import React, { useState } from 'react';

const FALLBACK_IMG = 'https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg';

const NewsItems = ({ title, description, imageUrl, newsUrl, author, date, source }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const handleImageError = (e) => {
    e.target.src = FALLBACK_IMG;
    e.target.onerror = null;
  };

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Recent';

  const readTime = Math.max(1, Math.ceil((description?.length || 100) / 50));
  const commentCount = Math.floor(Math.random() * 99) + 1;

  const encodedUrl   = encodeURIComponent(newsUrl  || '');
  const encodedTitle = encodeURIComponent(title    || '');

  const shareLinks = {
    twitter:  `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <div className="my-2 h-100">
      <div className="card news-card d-flex flex-column">

        {/* Image */}
        <div className="img-wrapper">
          <span className="source-badge">{source || 'News'}</span>
          <img
            src={imageUrl || FALLBACK_IMG}
            alt={title || 'news thumbnail'}
            onError={handleImageError}
          />
        </div>

        {/* Body */}
        <div className="card-body d-flex flex-column">

          {/* Meta */}
          <div className="d-flex justify-content-between align-items-center mb-2 card-meta">
            <span className="read-time">
              <i className="fa-solid fa-clock me-1"></i>{readTime} min read
            </span>
            <span style={{ color: 'var(--text-3)' }}>
              <i className="fa-regular fa-calendar me-1"></i>{formattedDate}
            </span>
          </div>

          {/* Title */}
          <h5 className="card-title mb-3">{title?.slice(0, 80) || 'Untitled'}</h5>

          {/* Description */}
          <p className="card-text mb-3 flex-grow-1">
            {description?.slice(0, 115) || 'Click to read the full story on the original source.'}
          </p>

          {/* Author + Actions */}
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              {/* Author */}
              <div className="d-flex align-items-center gap-2">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author || 'News Desk')}&background=f11946&color=fff&size=64&bold=true`}
                  className="rounded-circle"
                  width="28" height="28"
                  alt="author"
                  style={{ border: '2px solid var(--border)' }}
                />
                <small className="fw-bold text-truncate" style={{ maxWidth: 110, fontSize: '.78rem', color: 'var(--text-1)' }}>
                  {author || 'News Desk'}
                </small>
              </div>

              {/* Icon actions */}
              <div className="d-flex align-items-center gap-3 fs-6">
                {/* Comments */}
                <span className="action-icon" title={`${commentCount} comments`}>
                  <i className="fa-regular fa-comment"></i>
                  <span style={{ fontSize: '.58rem', position: 'relative', top: '-7px', fontWeight: 700 }}>{commentCount}</span>
                </span>

                {/* Share toggle */}
                <span
                  className="action-icon"
                  title="Share"
                  onClick={() => setShareOpen(s => !s)}
                >
                  <i className={`fa-solid fa-share-nodes ${shareOpen ? 'grad-text' : ''}`}></i>
                </span>

                {/* Bookmark */}
                <span
                  className={`action-icon ${bookmarked ? 'bookmarked' : ''}`}
                  onClick={() => setBookmarked(b => !b)}
                  title={bookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  <i className={bookmarked ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark'}></i>
                </span>
              </div>
            </div>

            {/* Social share row */}
            {shareOpen && (
              <div
                className="share-section d-flex flex-wrap gap-2 pt-3 pb-1"
                style={{ animation: 'cardEnter .3s var(--spring) both' }}
              >
                <a
                  href={shareLinks.twitter}
                  target="_blank" rel="noopener noreferrer"
                  className="share-btn tw"
                >
                  <i className="fa-brands fa-x-twitter"></i>Twitter
                </a>
                <a
                  href={shareLinks.linkedin}
                  target="_blank" rel="noopener noreferrer"
                  className="share-btn li"
                >
                  <i className="fa-brands fa-linkedin-in"></i>LinkedIn
                </a>
                <a
                  href={shareLinks.facebook}
                  target="_blank" rel="noopener noreferrer"
                  className="share-btn fb"
                >
                  <i className="fa-brands fa-facebook-f"></i>Facebook
                </a>
                <a
                  href={shareLinks.whatsapp}
                  target="_blank" rel="noopener noreferrer"
                  className="share-btn wa"
                >
                  <i className="fa-brands fa-whatsapp"></i>WhatsApp
                </a>
              </div>
            )}

            {/* CTA */}
            <a
              rel="noreferrer"
              href={newsUrl}
              target="_blank"
              className="btn btn-outline-danger w-100 mt-3 rounded-pill fw-bold"
              style={{ fontSize: '.82rem' }}
            >
              <span>Read Full Article</span>{' '}
              <i className="fa-solid fa-arrow-right ms-1"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsItems;
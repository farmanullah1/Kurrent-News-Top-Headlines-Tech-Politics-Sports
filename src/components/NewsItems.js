import React, { useState } from 'react';

const NewsItems = (props) => {
  let { title, description, imageUrl, newsUrl, author, date, source } = props;
  
  // Feature: Local Bookmark State
  const [bookmarked, setBookmarked] = useState(false);

  const handleImageError = (e) => {
    e.target.src = 'https://images.macrumors.com/t/RQPLZ_3_iMyj3evjsWnMLVwPdyA=/1600x/article-new/2023/11/apple-pay-feature-dynamic-island.jpg';
    e.target.onerror = null;
  }

  const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  // Feature: Calculate mock read time based on description length
  const readTime = Math.max(1, Math.ceil((description?.length || 100) / 50)); 
  const comments = Math.floor(Math.random() * 150); // Mock comment counter

  return (
    <div className='my-2 h-100'>
      <div className='card news-card d-flex flex-column'>
        
        {/* Floating Category Badge */}
        <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: '2' }}>
          <span className='badge rounded-pill bg-danger shadow px-3 py-2 fw-bold text-uppercase' style={{ letterSpacing: '1px', fontSize: '0.65rem'}}> {source} </span>
        </div>

        {/* Animated Image Wrapper */}
        <div className="img-wrapper">
          <img src={!imageUrl ? 'https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg' : imageUrl} alt='news thumbnail' onError={handleImageError} />
        </div>

        <div className='card-body d-flex flex-column p-4'>
          
          <div className="d-flex justify-content-between text-muted mb-2" style={{ fontSize: '0.8rem' }}>
            <span className="fw-semibold text-danger"><i className="fa-solid fa-clock me-1"></i> {readTime} min read</span>
            <span><i className="fa-regular fa-calendar me-1"></i> {formattedDate}</span>
          </div>

          <h5 className='card-title fw-bolder mb-3 lh-base' style={{ fontSize: '1.15rem' }}>{title}</h5>
          <p className='card-text text-secondary mb-4 flex-grow-1' style={{ fontSize: '0.9rem' }}>{description}</p>
          
          <div className="mt-auto border-top pt-3">
            <div className="d-flex justify-content-between align-items-center">
              
              <div className="d-flex align-items-center gap-2">
                 <img src={`https://ui-avatars.com/api/?name=${author || 'User'}&background=random&color=fff`} className="rounded-circle" width="30" height="30" alt="author avatar"/>
                 <small className='fw-bold text-truncate' style={{ maxWidth: '100px' }}>{!author ? 'News Desk' : author}</small>
              </div>
              
              {/* Feature: Interaction Bar */}
              <div className="d-flex gap-3 fs-5">
                {/* Mock Comments */}
                <span className="action-icon" title="Comments"><i className="fa-regular fa-comment"></i><span style={{fontSize:'0.6rem', position:'relative', top:'-8px'}}>{comments}</span></span>
                
                {/* SOCIAL SHARING Dropdown */}
                <div className="dropdown">
                  <span className="action-icon" data-bs-toggle="dropdown"><i className="fa-solid fa-share-nodes"></i></span>
                  <ul className="dropdown-menu dropdown-menu-end shadow-sm min-w-0">
                    <li><a className="dropdown-item" href="/"><i className="fa-brands fa-twitter text-info"></i> Twitter</a></li>
                    <li><a className="dropdown-item" href="/"><i className="fa-brands fa-whatsapp text-success"></i> WhatsApp</a></li>
                  </ul>
                </div>

                {/* BOOKMARK */}
                <span className={`action-icon ${bookmarked ? 'bookmarked' : ''}`} onClick={() => setBookmarked(!bookmarked)} title="Bookmark Story">
                  <i className={bookmarked ? "fa-solid fa-bookmark" : "fa-regular fa-bookmark"}></i>
                </span>
              </div>

            </div>

            <a rel='noreferrer' href={newsUrl} target='_blank' className='btn btn-outline-danger w-100 mt-3 rounded-pill fw-bold'>
              Read Full Article <i className="fa-solid fa-arrow-right ms-1"></i>
            </a>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NewsItems;
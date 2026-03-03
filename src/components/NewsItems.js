import React from 'react'

const NewsItems = (props) => {
  let { title, description, imageUrl, newsUrl, author, date, source } = props;

  const handleImageError = (e) => {
    e.target.src = 'https://images.macrumors.com/t/RQPLZ_3_iMyj3evjsWnMLVwPdyA=/1600x/article-new/2023/11/apple-pay-feature-dynamic-island.jpg';
    e.target.onerror = null;
  }

  // Format date elegantly
  const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className='my-3 h-100'>
      <div className='card news-card h-100 d-flex flex-column'>
        
        {/* Floating Source Badge */}
        <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: '2' }}>
          <span className='badge rounded-pill bg-danger shadow-sm px-3 py-2'> {source} </span>
        </div>

        {/* Animated Image Wrapper */}
        <div className="img-wrapper">
          <img
            src={!imageUrl ? 'https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg' : imageUrl}
            alt='news thumbnail'
            onError={handleImageError}
          />
        </div>

        <div className='card-body d-flex flex-column'>
          <h5 className='card-title fw-bold mb-3 lh-base'>{title}</h5>
          <p className='card-text text-secondary mb-4'>{description}</p>
          
          <div className="mt-auto">
            <p className='card-text mb-3'>
              <small className='text-muted fw-medium'>
                ✍️ {!author ? 'Unknown Desk' : author} <br/> 📅 {formattedDate}
              </small>
            </p>
            
            <div className="d-flex justify-content-between align-items-center">
              <a rel='noreferrer' href={newsUrl} target='_blank' className='btn btn-danger btn-sm px-4 rounded-pill fw-bold shadow-sm'>
                Read Story &rarr;
              </a>
              <div className="d-flex gap-2 text-muted fs-5">
                <span style={{cursor: 'pointer'}} title="Bookmark">🔖</span>
                <span style={{cursor: 'pointer'}} title="Share">📤</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default NewsItems;
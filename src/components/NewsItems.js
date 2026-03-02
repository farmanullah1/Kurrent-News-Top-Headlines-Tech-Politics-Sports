import React, { Component } from 'react'

export default class NewsItems extends Component {
  // Function to handle image load errors
  handleImageError = (e) => {
    // If the original image fails, replace it with this fallback
    e.target.src = "https://images.macrumors.com/t/RQPLZ_3_iMyj3evjsWnMLVwPdyA=/1600x/article-new/2023/11/apple-pay-feature-dynamic-island.jpg";
    // Optional: prevent infinite loop if the fallback also fails
    e.target.onerror = null; 
  }

  render() {
    let { title, description, imageUrl, newsUrl,author, date } = this.props
    return (
      <div className='my-3'>
        <div className='card'>
          <img 
            src={imageUrl ? imageUrl : "https://images.macrumors.com/t/RQPLZ_3_iMyj3evjsWnMLVwPdyA=/1600x/article-new/2023/11/apple-pay-feature-dynamic-island.jpg"} 
            className='card-img-top' 
            alt='news' 
            onError={this.handleImageError} // <--- THIS IS THE MAGIC LINE
            style={{ height: '200px', objectFit: 'cover' }} 
          />
          <div className='card-body'>
            <h5 className='card-title'>{title}...</h5>
            <p className='card-text'>{description}...</p>
            <p className="card-text"><small className="text-muted">By {!author ? "Unknown" : author} on  {new Date(date).toGMTString()}</small></p>
            <a href={newsUrl} target='_blank' className='btn btn-sm btn-dark' rel="noreferrer">
              Read More
            </a>
          </div>
        </div>
      </div>
    )
  }
}
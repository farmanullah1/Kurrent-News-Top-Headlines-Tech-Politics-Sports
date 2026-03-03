import React, { Component } from 'react'

export default class NewsItems extends Component {
  // Function to handle image load errors
  handleImageError = e => {
    // If the original image fails, replace it with this fallback
    e.target.src =
      'https://images.macrumors.com/t/RQPLZ_3_iMyj3evjsWnMLVwPdyA=/1600x/article-new/2023/11/apple-pay-feature-dynamic-island.jpg'
    // Optional: prevent infinite loop if the fallback also fails
    e.target.onerror = null
  }

  render () {
    let { title, description, imageUrl, newsUrl, author, date, source } =
      this.props
    return (
      <div className='my-3'>
        <div className='card'>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              position: 'absolute',
              right: '0'
            }}
          >
            <span className='badge rounded-pill bg-danger'> {source} </span>
          </div>
          <img
            src={
              !imageUrl
                ? 'https://fdn.gsmarena.com/imgroot/news/21/08/xiaomi-smart-home-india-annoucnements/-476x249w4/gsmarena_00.jpg'
                : imageUrl
            }
            className='card-img-top'
            alt='...'
          />
          <div className='card-body'>
            <h5 className='card-title'>{title}... </h5>
            <p className='card-text'>{description}...</p>
            <p className='card-text'>
              <small className='text-muted'>
                By {!author ? 'Unknown' : author} on{' '}
                {new Date(date).toGMTString()}
              </small>
            </p>
            <a
              rel='noreferrer'
              href={newsUrl}
              target='_blank'
              className='btn btn-sm btn-dark'
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    )
  }
}

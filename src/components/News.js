import React, { useEffect, useState } from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showScroll, setShowScroll] = useState(false);

  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);

    let data = await fetch(url);
    props.setProgress(30);

    let parsedData = await data.json();
    props.setProgress(70);

    setArticles(parsedData.articles || []);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - Kurrent News`;
    updateNews();
    
    // Logic for Scroll-To-Top button visibility
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400){ setShowScroll(true) } 
      else if (showScroll && window.pageYOffset <= 400){ setShowScroll(false) }
    };
    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
    // eslint-disable-next-line
  }, []); 

  const fetchMoreData = async () => {
    const nextPage = page + 1; 
    setPage(nextPage);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;

    let data = await fetch(url);
    let parsedData = await data.json();

    setArticles(articles.concat(parsedData.articles || []));
    setTotalResults(parsedData.totalResults);
  }

  const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className='container-fluid px-4 my-3' style={{ paddingTop: '80px' }}>
      
      {/* Header & Stats Tracker */}
      <div className="d-flex justify-content-between align-items-end mb-4 border-bottom pb-3">
        <h2 className='fw-bolder m-0' style={{ letterSpacing: '-1px' }}>
          Top <span className="text-danger">{capitalizeFirstLetter(props.category)}</span> Headlines
        </h2>
        <span className="badge bg-secondary rounded-pill py-2 px-3 shadow-sm d-none d-md-block">
          Showing {articles.length} of {totalResults}
        </span>
      </div>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
        endMessage={<p className="text-center text-muted fw-bold mt-4">✅ You have caught up on all the news!</p>}
      >
        <div className='row g-4'>
          {articles.map((element, index) => {
            // Assign stagger delay classes based on grid position (0, 1, 2)
            const delayClass = `delay-${index % 3}`;
            return (
              <div className={`col-md-4 col-sm-6 animate-card ${delayClass}`} key={`${element.url}-${index}`}>
                <NewsItems
                  title={element.title ? element.title.slice(0, 50) : ''}
                  description={element.description ? element.description.slice(0, 95) : 'Click to read the full story on the original source...'}
                  imageUrl={element.urlToImage}
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source ? element.source.name : 'Unknown'}
                />
              </div>
            )
          })}
        </div>
      </InfiniteScroll>

      {/* Floating Action Button */}
      {showScroll && (
        <button className="scroll-to-top" onClick={scrollToTop} title="Go to top">
          <i style={{ border: 'solid white', borderWidth: '0 3px 3px 0', display: 'inline-block', padding: '3px', transform: 'rotate(-135deg)', marginBottom: '-3px' }}></i>
        </button>
      )}
    </div>
  )
}

News.defaultProps = { country: 'us', category: 'general', pageSize: 6 }
News.propTypes = { country: PropTypes.string, category: PropTypes.string, apiKey: PropTypes.string, pageSize: PropTypes.number }

export default News;
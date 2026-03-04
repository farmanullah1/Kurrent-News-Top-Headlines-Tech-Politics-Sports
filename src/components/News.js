import React, { useEffect, useState } from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner'
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [viewLayout, setViewLayout] = useState('grid'); 
  
  // Dual Pagination States
  const [page, setPage] = useState(1); // Used by NewsAPI
  const [nextPageToken, setNextPageToken] = useState(null); // Used by NewsData.io
  const [activeApi, setActiveApi] = useState(null); // Tracks which API won the race

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  // --- THE DUAL FETCH ENGINE ---
  const updateNews = async () => {
    props.setProgress(10);
    setLoading(true);

    const searchParam1 = props.searchQuery ? `&q=${props.searchQuery}` : '';
    const urlNewsApi = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}${searchParam1}&apiKey=${props.newsApiKey}&page=1&pageSize=${props.pageSize}`;
    
    try {
      // ATTEMPT 1: Try NewsAPI First
      let response1 = await fetch(urlNewsApi);
      let data1 = await response1.json();

      if (data1.status === "error" || !response1.ok) {
        throw new Error("NewsAPI Blocked"); // Force the catch block to run
      }

      props.setProgress(70);
      setArticles(data1.articles || []);
      setTotalResults(data1.totalResults);
      setActiveApi('newsapi'); // Lock in NewsAPI for infinite scroll

    } catch (error) {
      console.warn("NewsAPI failed. Seamlessly switching to NewsData.io Fallback...");
      props.setProgress(40);
      
      // ATTEMPT 2: Fallback to NewsData.io
      const mappedCategory = props.category === 'general' ? 'top' : props.category;
      const searchParam2 = props.searchQuery ? `&q=${props.searchQuery}` : '';
      const urlNewsData = `https://newsdata.io/api/1/latest?apikey=${props.newsDataKey}&country=${props.country}&category=${mappedCategory}${searchParam2}`;
      
      try {
        let response2 = await fetch(urlNewsData);
        let data2 = await response2.json();

        if (data2.status === "success") {
          props.setProgress(70);
          setArticles(data2.results || []);
          setTotalResults(data2.totalResults);
          setNextPageToken(data2.nextPage);
          setActiveApi('newsdata'); // Lock in NewsData for infinite scroll
        }
      } catch (fallbackError) {
        console.error("Both APIs failed. Check your network or API keys.");
      }
    }
    
    setLoading(false);
    props.setProgress(100);
  }

  useEffect(() => {
    const titleStatus = props.searchQuery ? `Results for "${props.searchQuery}"` : `${capitalize(props.category)}`;
    document.title = `${titleStatus} - Kurrent News`;
    updateNews();
    // eslint-disable-next-line
  }, []); 

  // --- INFINITE SCROLL ROUTER ---
  const fetchMoreData = async () => {
    if (activeApi === 'newsapi') {
      const nextPage = page + 1; 
      setPage(nextPage);
      const searchParam = props.searchQuery ? `&q=${props.searchQuery}` : '';
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}${searchParam}&apiKey=${props.newsApiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
      
      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(articles.concat(parsedData.articles || []));
      setTotalResults(parsedData.totalResults);
      
    } else if (activeApi === 'newsdata') {
      if (!nextPageToken) return;
      const mappedCategory = props.category === 'general' ? 'top' : props.category;
      const searchParam = props.searchQuery ? `&q=${props.searchQuery}` : '';
      const url = `https://newsdata.io/api/1/latest?apikey=${props.newsDataKey}&country=${props.country}&category=${mappedCategory}${searchParam}&page=${nextPageToken}`;

      let data = await fetch(url);
      let parsedData = await data.json();
      setArticles(articles.concat(parsedData.results || []));
      setNextPageToken(parsedData.nextPage); 
    }
  }

  return (
    <div className='container-fluid px-md-5 my-3' style={{ paddingTop: '110px' }}>
      
      <div className="d-flex justify-content-end mb-3 fs-4">
        <i className={`fa-solid fa-border-all layout-btn me-3 ${viewLayout === 'grid' ? 'active' : ''}`} onClick={() => setViewLayout('grid')} title="Grid View"></i>
        <i className={`fa-solid fa-list layout-btn ${viewLayout === 'list' ? 'active' : ''}`} onClick={() => setViewLayout('list')} title="List View"></i>
      </div>

      <div className="mb-4 d-flex justify-content-between align-items-end border-bottom pb-3">
        <h1 className='fw-bolder m-0' style={{ fontSize: '2.5rem', letterSpacing: '-1.5px' }}>
          {props.searchQuery ? `Search Results for ` : `${capitalize(props.category)} `} 
          <span className="text-danger">{props.searchQuery ? `"${props.searchQuery}"` : "News"}</span>
        </h1>
        <div className="text-end d-none d-md-block">
          <p className="text-muted fw-semibold m-0 mb-1">Showing {articles.length} of {totalResults} Stories</p>
          {/* Debug badge to show which API is currently running */}
          {activeApi && <span className="badge bg-secondary rounded-pill" style={{fontSize: '0.65rem'}}>Powered by {activeApi === 'newsapi' ? 'NewsAPI' : 'NewsData.io'}</span>}
        </div>
      </div>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={activeApi === 'newsapi' ? articles.length !== totalResults : nextPageToken !== null}
        loader={<Spinner />}
        endMessage={
          <div className="text-center my-5 p-4 bg-secondary bg-opacity-10 rounded-4">
            <h4 className="fw-bold"><i className="fa-solid fa-circle-check text-success me-2"></i>You're all caught up!</h4>
            <p className="text-muted">You've seen all the latest news for this section.</p>
          </div>
        }
      >
        <div className={`row g-4 ${viewLayout === 'list' ? 'list-view' : ''}`}>
          {articles.map((element, index) => {
            const delayClass = `delay-${index % 3}`;
            // Intelligently map properties depending on which API won
            const isNewsData = activeApi === 'newsdata';
            return (
              <div className={`col-md-4 col-sm-6 animate-card ${delayClass}`} key={`${index}`}>
                <NewsItems
                  title={element.title ? element.title.slice(0, 65) : ''}
                  description={element.description ? element.description.slice(0, 100) : 'Click to read the full story on the original source...'}
                  imageUrl={isNewsData ? element.image_url : element.urlToImage}
                  newsUrl={isNewsData ? element.link : element.url}
                  author={isNewsData ? (element.creator ? element.creator[0] : null) : element.author}
                  date={isNewsData ? element.pubDate : element.publishedAt}
                  source={isNewsData ? element.source_id : (element.source ? element.source.name : 'Unknown')}
                />
              </div>
            )
          })}
        </div>
      </InfiniteScroll>

      <button className="btn btn-danger position-fixed rounded-circle shadow-lg d-flex justify-content-center align-items-center hover-lift" 
        style={{ bottom: '30px', right: '30px', width: '50px', height: '50px', zIndex: 1000 }} 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <i className="fa-solid fa-arrow-up fs-5"></i>
      </button>

    </div>
  )
}

News.defaultProps = { country: 'us', category: 'general', pageSize: 9, searchQuery: '' }
News.propTypes = { country: PropTypes.string, category: PropTypes.string, newsApiKey: PropTypes.string, newsDataKey: PropTypes.string, pageSize: PropTypes.number, searchQuery: PropTypes.string }

export default News;
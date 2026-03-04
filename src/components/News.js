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
  const [activeTab, setActiveTab] = useState('headlines');
  
  // Pagination & Tracking States
  const [page, setPage] = useState(1); 
  const [nextPageToken, setNextPageToken] = useState(null); 
  const [activeApi, setActiveApi] = useState(null); // Tracks the winning API

  const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  // --- TRIPLE-FETCH ENGINE ---
  const updateNews = async () => {
    props.setProgress(10);
    setLoading(true);

    // 1. NewsAPI Preparation
    const searchParam1 = props.searchQuery ? `&q=${props.searchQuery}` : '';
    const urlNewsApi = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}${searchParam1}&apiKey=${props.newsApiKey}&page=1&pageSize=${props.pageSize}`;
    
    try {
      // ATTEMPT 1: Try NewsAPI
      let response1 = await fetch(urlNewsApi);
      let data1 = await response1.json();

      if (data1.status === "error" || !response1.ok) {
        throw new Error("NewsAPI Blocked or Limit Reached"); 
      }

      props.setProgress(70);
      setArticles(data1.articles || []);
      setTotalResults(data1.totalResults);
      setActiveApi('newsapi');

    } catch (error1) {
      console.warn("NewsAPI failed. Switching to NewsData.io...");
      props.setProgress(40);
      
      // 2. NewsData.io Preparation
      const mappedCategory = props.category === 'general' ? 'top' : props.category;
      const searchParam2 = props.searchQuery ? `&q=${props.searchQuery}` : '';
      const urlNewsData = `https://newsdata.io/api/1/latest?apikey=${props.newsDataKey}&country=${props.country}&category=${mappedCategory}${searchParam2}`;
      
      try {
        // ATTEMPT 2: Try NewsData.io
        let response2 = await fetch(urlNewsData);
        let data2 = await response2.json();

        if (data2.status === "success") {
          props.setProgress(70);
          setArticles(data2.results || []);
          setTotalResults(data2.totalResults);
          setNextPageToken(data2.nextPage);
          setActiveApi('newsdata');
        } else {
          throw new Error("NewsData.io Blocked or Limit Reached");
        }
      } catch (error2) {
        console.warn("NewsData.io failed. Switching to GNews...");
        props.setProgress(60);

        // 3. GNews Preparation
        let urlGNews;
        if (props.searchQuery) {
          urlGNews = `https://gnews.io/api/v4/search?q=${props.searchQuery}&lang=en&country=${props.country}&max=${props.pageSize}&apikey=${props.gNewsKey}`;
        } else {
          urlGNews = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&max=${props.pageSize}&apikey=${props.gNewsKey}`;
        }

        try {
          // ATTEMPT 3: Try GNews
          let response3 = await fetch(urlGNews);
          let data3 = await response3.json();

          if (data3.errors || !response3.ok) {
            throw new Error("GNews Blocked or Limit Reached");
          }

          props.setProgress(70);
          setArticles(data3.articles || []);
          setTotalResults(data3.totalArticles);
          setActiveApi('gnews');
        } catch (error3) {
          console.error("CRITICAL: All 3 APIs failed. Check your network or API keys.");
        }
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
    const nextPage = page + 1;

    if (activeApi === 'newsapi') {
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

    } else if (activeApi === 'gnews') {
      setPage(nextPage);
      let urlGNews;
      if (props.searchQuery) {
        urlGNews = `https://gnews.io/api/v4/search?q=${props.searchQuery}&lang=en&country=${props.country}&max=${props.pageSize}&page=${nextPage}&apikey=${props.gNewsKey}`;
      } else {
        urlGNews = `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&max=${props.pageSize}&page=${nextPage}&apikey=${props.gNewsKey}`;
      }
      let data = await fetch(urlGNews);
      let parsedData = await data.json();
      setArticles(articles.concat(parsedData.articles || []));
      setTotalResults(parsedData.totalArticles);
    }
  }

  // Helper function to figure out if infinite scroll has more data
  const checkHasMore = () => {
    if (activeApi === 'newsapi' || activeApi === 'gnews') return articles.length !== totalResults;
    if (activeApi === 'newsdata') return nextPageToken !== null;
    return false;
  }

  return (
    <div className='container-fluid px-md-5 my-3 trending-bar'>
      
      {/* Filters & Layout Toggles */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 bg-secondary bg-opacity-10 p-3 rounded-4">
        <div className="d-flex gap-3 mb-2 mb-md-0">
          <button className={`btn btn-sm rounded-pill fw-bold px-4 ${activeTab === 'headlines' ? 'btn-danger' : 'btn-outline-secondary border-0'}`} onClick={() => setActiveTab('headlines')}>Top Headlines</button>
        </div>

        <div className="d-flex gap-3 fs-4">
          <i className={`fa-solid fa-border-all layout-btn ${viewLayout === 'grid' ? 'active' : ''}`} onClick={() => setViewLayout('grid')} title="Grid View"></i>
          <i className={`fa-solid fa-list layout-btn ${viewLayout === 'list' ? 'active' : ''}`} onClick={() => setViewLayout('list')} title="List View"></i>
        </div>
      </div>

      <div className="mb-4 d-flex justify-content-between align-items-end">
        <h1 className='fw-bolder m-0' style={{ fontSize: '2.5rem', letterSpacing: '-1.5px' }}>
          {props.searchQuery ? `Search Results for ` : `${capitalize(props.category)} `} 
          <span className="text-danger">{props.searchQuery ? `"${props.searchQuery}"` : "News"}</span>
        </h1>
        <div className="text-end d-none d-md-block">
          <p className="text-muted fw-semibold m-0 mb-1">Showing {articles.length} of {totalResults} Stories</p>
          {activeApi && <span className="badge bg-secondary rounded-pill" style={{fontSize: '0.65rem'}}>Powered by {activeApi.toUpperCase()}</span>}
        </div>
      </div>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={checkHasMore()}
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
            
            // DYNAMIC MAPPING: Translate data shapes depending on which API is running
            const isNewsData = activeApi === 'newsdata';
            const isGNews = activeApi === 'gnews';
            
            const imgUrl = isNewsData ? element.image_url : (isGNews ? element.image : element.urlToImage);
            const articleUrl = isNewsData ? element.link : element.url;
            const author = isNewsData ? (element.creator ? element.creator[0] : null) : (isGNews ? element.source?.name : element.author);
            const pubDate = isNewsData ? element.pubDate : element.publishedAt;
            const source = isNewsData ? element.source_id : (element.source ? element.source.name : 'Unknown');

            return (
              <div className={`col-md-4 col-sm-6 animate-card ${delayClass}`} key={`${articleUrl}-${index}`}>
                <NewsItems
                  title={element.title ? element.title.slice(0, 65) : ''}
                  description={element.description ? element.description.slice(0, 100) : 'Click to read the full story on the original source...'}
                  imageUrl={imgUrl}
                  newsUrl={articleUrl}
                  author={author}
                  date={pubDate}
                  source={source}
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
News.propTypes = { 
  country: PropTypes.string, 
  category: PropTypes.string, 
  newsApiKey: PropTypes.string, 
  newsDataKey: PropTypes.string, 
  gNewsKey: PropTypes.string, 
  pageSize: PropTypes.number, 
  searchQuery: PropTypes.string 
}

export default News;
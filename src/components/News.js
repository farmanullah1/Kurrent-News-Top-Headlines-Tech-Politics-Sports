import React, { useEffect, useState } from 'react';
import NewsItems from './NewsItems';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

const CATEGORY_FILTERS = [
  { label: 'All',           icon: 'fa-border-all' },
  { label: 'Politics',      icon: 'fa-landmark' },
  { label: 'Technology',    icon: 'fa-microchip' },
  { label: 'Business',      icon: 'fa-chart-line' },
  { label: 'Sports',        icon: 'fa-futbol' },
  { label: 'Entertainment', icon: 'fa-film' },
  { label: 'Health',        icon: 'fa-heart-pulse' },
  { label: 'Science',       icon: 'fa-flask' },
  { label: 'World',         icon: 'fa-earth-americas' },
];

const News = (props) => {
  const [articles, setArticles]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [viewLayout, setViewLayout]     = useState('grid');
  const [activeFilter, setActiveFilter] = useState('All');

  const [page, setPage]                   = useState(1);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [activeApi, setActiveApi]         = useState(null);

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // ── Triple-Fetch Engine ───────────────────────────
  const updateNews = async () => {
    props.setProgress(10);
    setLoading(true);

    const q1 = props.searchQuery ? `&q=${props.searchQuery}` : '';
    const urlNewsApi = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}${q1}&apiKey=${props.newsApiKey}&page=1&pageSize=${props.pageSize}`;

    try {
      const r1 = await fetch(urlNewsApi);
      const d1 = await r1.json();
      if (d1.status === 'error' || !r1.ok) throw new Error('NewsAPI failed');
      props.setProgress(70);
      setArticles(d1.articles || []);
      setTotalResults(d1.totalResults);
      setActiveApi('newsapi');
    } catch {
      props.setProgress(40);
      const cat2 = props.category === 'general' ? 'top' : props.category;
      const q2   = props.searchQuery ? `&q=${props.searchQuery}` : '';
      const urlNewsData = `https://newsdata.io/api/1/latest?apikey=${props.newsDataKey}&country=${props.country}&category=${cat2}${q2}`;
      try {
        const r2 = await fetch(urlNewsData);
        const d2 = await r2.json();
        if (d2.status === 'success') {
          props.setProgress(70);
          setArticles(d2.results || []);
          setTotalResults(d2.totalResults);
          setNextPageToken(d2.nextPage);
          setActiveApi('newsdata');
        } else throw new Error('NewsData failed');
      } catch {
        props.setProgress(60);
        const urlGNews = props.searchQuery
          ? `https://gnews.io/api/v4/search?q=${props.searchQuery}&lang=en&country=${props.country}&max=${props.pageSize}&apikey=${props.gNewsKey}`
          : `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&max=${props.pageSize}&apikey=${props.gNewsKey}`;
        try {
          const r3 = await fetch(urlGNews);
          const d3 = await r3.json();
          if (d3.errors || !r3.ok) throw new Error('GNews failed');
          props.setProgress(70);
          setArticles(d3.articles || []);
          setTotalResults(d3.totalArticles);
          setActiveApi('gnews');
        } catch {
          console.error('All 3 APIs failed.');
        }
      }
    }

    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    const titleStatus = props.searchQuery
      ? `Results for "${props.searchQuery}"`
      : capitalize(props.category);
    document.title = `${titleStatus} — Kurrent News`;
    updateNews();
    // eslint-disable-next-line
  }, []);

  // ── Infinite Scroll ───────────────────────────────
  const fetchMoreData = async () => {
    const nextPage = page + 1;
    if (activeApi === 'newsapi') {
      setPage(nextPage);
      const q = props.searchQuery ? `&q=${props.searchQuery}` : '';
      const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}${q}&apiKey=${props.newsApiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
      const d = await (await fetch(url)).json();
      setArticles(prev => prev.concat(d.articles || []));
      setTotalResults(d.totalResults);
    } else if (activeApi === 'newsdata') {
      if (!nextPageToken) return;
      const cat = props.category === 'general' ? 'top' : props.category;
      const q   = props.searchQuery ? `&q=${props.searchQuery}` : '';
      const url = `https://newsdata.io/api/1/latest?apikey=${props.newsDataKey}&country=${props.country}&category=${cat}${q}&page=${nextPageToken}`;
      const d   = await (await fetch(url)).json();
      setArticles(prev => prev.concat(d.results || []));
      setNextPageToken(d.nextPage);
    } else if (activeApi === 'gnews') {
      setPage(nextPage);
      const url = props.searchQuery
        ? `https://gnews.io/api/v4/search?q=${props.searchQuery}&lang=en&country=${props.country}&max=${props.pageSize}&page=${nextPage}&apikey=${props.gNewsKey}`
        : `https://gnews.io/api/v4/top-headlines?category=${props.category}&lang=en&country=${props.country}&max=${props.pageSize}&page=${nextPage}&apikey=${props.gNewsKey}`;
      const d = await (await fetch(url)).json();
      setArticles(prev => prev.concat(d.articles || []));
      setTotalResults(d.totalArticles);
    }
  };

  const hasMore = () => {
    if (activeApi === 'newsapi' || activeApi === 'gnews') return articles.length < totalResults;
    if (activeApi === 'newsdata') return nextPageToken !== null;
    return false;
  };

  // ── Normalize article fields across 3 APIs ────────
  const normalizeArticle = (el) => {
    const isNewsData = activeApi === 'newsdata';
    const isGNews    = activeApi === 'gnews';
    return {
      imgUrl:     isNewsData ? el.image_url  : (isGNews ? el.image     : el.urlToImage),
      articleUrl: isNewsData ? el.link       : el.url,
      author:     isNewsData ? (el.creator?.[0] ?? null) : (isGNews ? el.source?.name : el.author),
      pubDate:    isNewsData ? el.pubDate    : el.publishedAt,
      source:     isNewsData ? el.source_id  : (el.source?.name ?? 'Unknown'),
    };
  };

  return (
    <div className="container-fluid px-md-5 my-3 trending-bar">

      {/* ── Filters & Layout Bar ── */}
      <div className="filters-row d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        {/* Category chips — scrollable on mobile */}
        <div className="d-flex gap-2 flex-wrap" style={{ flex: 1, minWidth: 0 }}>
          {CATEGORY_FILTERS.map(({ label, icon }) => (
            <button
              key={label}
              className={`filter-chip ${activeFilter === label ? 'active' : ''}`}
              onClick={() => setActiveFilter(label)}
            >
              <span><i className={`fa-solid ${icon} me-1`}></i>{label}</span>
            </button>
          ))}
        </div>

        {/* Layout toggle */}
        <div className="d-flex gap-2 flex-shrink-0">
          <span
            className={`layout-btn fs-5 ${viewLayout === 'grid' ? 'active' : ''}`}
            onClick={() => setViewLayout('grid')}
            title="Grid View"
          >
            <i className="fa-solid fa-border-all"></i>
          </span>
          <span
            className={`layout-btn fs-5 ${viewLayout === 'list' ? 'active' : ''}`}
            onClick={() => setViewLayout('list')}
            title="List View"
          >
            <i className="fa-solid fa-list"></i>
          </span>
        </div>
      </div>

      {/* ── Section Heading ── */}
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4 gap-2">
        <h1 className="section-heading">
          {props.searchQuery
            ? <>Results for <span className="grad-text">"{props.searchQuery}"</span></>
            : <>{capitalize(props.category)} <span className="grad-text">News</span></>
          }
        </h1>
        <div className="text-end d-none d-md-block">
          <p style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--text-2)', marginBottom: 4 }}>
            Showing {articles.length} of {totalResults || '—'} stories
          </p>
          {activeApi && (
            <span
              style={{
                fontSize: '.62rem', fontWeight: 700, letterSpacing: '.08em',
                textTransform: 'uppercase', padding: '3px 10px', borderRadius: 999,
                background: 'var(--surface-2)', color: 'var(--text-3)',
                border: '1px solid var(--border)'
              }}
            >
              via {activeApi.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={hasMore()}
        loader={<Spinner />}
        endMessage={
          <div className="end-message my-5">
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>✓</div>
            <h5 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, marginBottom: 6 }}>
              You're all caught up!
            </h5>
            <p style={{ color: 'var(--text-2)', fontSize: '.875rem', marginBottom: 0 }}>
              You've read all the latest stories for this section.
            </p>
          </div>
        }
      >
        <div className={`row g-4 ${viewLayout === 'list' ? 'list-view' : ''}`}>
          {articles.map((el, index) => {
            const { imgUrl, articleUrl, author, pubDate, source } = normalizeArticle(el);
            const delayClass = `delay-${index % 3}`;
            return (
              <div
                className={`col-md-4 col-sm-6 animate-card ${delayClass}`}
                key={`${articleUrl}-${index}`}
              >
                <NewsItems
                  title={el.title?.slice(0, 80) || ''}
                  description={el.description?.slice(0, 115) || ''}
                  imageUrl={imgUrl}
                  newsUrl={articleUrl}
                  author={author}
                  date={pubDate}
                  source={source}
                />
              </div>
            );
          })}
        </div>
      </InfiniteScroll>

      {/* Scroll to top */}
      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </div>
  );
};

News.defaultProps = { country: 'us', category: 'general', pageSize: 9, searchQuery: '' };
News.propTypes = {
  country:      PropTypes.string,
  category:     PropTypes.string,
  newsApiKey:   PropTypes.string,
  newsDataKey:  PropTypes.string,
  gNewsKey:     PropTypes.string,
  pageSize:     PropTypes.number,
  searchQuery:  PropTypes.string,
};

export default News;
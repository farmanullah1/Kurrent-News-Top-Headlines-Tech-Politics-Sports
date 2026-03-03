import React, { Component } from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
import LoadingBar from "react-top-loading-bar";

export default class News extends Component {
    static defaultProps = {
        country: 'us',
        category: 'general',
        apiKey: '2e66700f670c47da992598c2989ac04f',
        pageSize: 5
    }

    static propTypes = {
        country: PropTypes.string,
        category: PropTypes.string,
        apiKey: PropTypes.string,
        pageSize: PropTypes.number
    }

  capitalizeFirstLetter = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  } 

  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      loading: true, // Start as true for the initial load
      page: 1,
      totalResults: 0
    }
    document.title = `${this.capitalizeFirstLetter(this.props.category)} - Kurrent News`;
  }

  // This runs ONLY for the very first page load
  async updateNews() {
    this.props.setProgress(10); 
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`; 
    this.setState({ loading: true });
    
    let data = await fetch(url);
    this.props.setProgress(30);
    
    let parsedData = await data.json();
    this.props.setProgress(70);
    
    this.setState({
      articles: parsedData.articles || [],
      totalResults: parsedData.totalResults,
      loading: false
    });
    
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  // NEW FUNCTION: This fetches data silently in the background when you scroll down
  fetchMoreData = async () => {
    // 1. Increment the page number
    this.setState({ page: this.state.page + 1 }, async () => {
      // 2. Fetch the new page
      const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`; 
      
      let data = await fetch(url);
      let parsedData = await data.json();
      
      // 3. Concat (attach) the new articles to the existing articles!
      this.setState({
        articles: this.state.articles.concat(parsedData.articles || []),
        totalResults: parsedData.totalResults
      });
    });
  };

  render() {
    return (
      // Removed the 'container' class from this outer div to prevent scrollbar issues
      <div className='my-3'> 
        <h2 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>
          Kurrent News - Top {this.capitalizeFirstLetter(this.props.category)} Headlines
        </h2>
        
        {/* Top spinner for the initial load ONLY */}
        {this.state.loading && <Spinner />}

        {/* 4. Properly wrapped InfiniteScroll around the grid */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className='row'>
              {this.state.articles.map((element, index) => {
                return (
                  <div className='col-md-4' key={element.url || index}>
                    <NewsItems
                      title={element.title ? element.title.slice(0, 45) : ""}
                      description={element.description ? element.description.slice(0, 88) : ""}
                      imageUrl={element.urlToImage ? element.urlToImage : "https://images.macrumors.com/t/RQPLZ_3_iMyj3evjsWnMLVwPdyA=/1600x/article-new/2023/11/apple-pay-feature-dynamic-island.jpg"}
                      newsUrl={element.url} 
                      author={element.author}
                      date={element.publishedAt} 
                      source={element.source ? element.source.name : "Unknown"}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </InfiniteScroll>
      </div>
    )
  }
}
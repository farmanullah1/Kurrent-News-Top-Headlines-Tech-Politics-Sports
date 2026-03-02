import React, { Component } from 'react'
import NewsItems from './NewsItems'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export default class News extends Component {
    static defaultProps = {
        country: 'sa',
        category: 'general',
        apiKey: '2e66700f670c47da992598c2989ac04f',
        pageSize: 20
    }

    static propTypes = {
        country: PropTypes.string,
        category: PropTypes.string,
        apiKey: PropTypes.string,
        pageSize: PropTypes.number
    }

  constructor(props) {
    super(props)
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalResults: 0,
      pageSize: this.props.pageSize || 20
    }
  }

  // Refactored update logic into one function to avoid repeating code
  async updateNews() {
    // 1. Start the loading bar at 10%
    this.props.setProgress(10); 
    
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`; 
    this.setState({ loading: true });
    
    // 2. Fetch the data, bump to 30%
    let data = await fetch(url);
    this.props.setProgress(30);
    
    // 3. Parse the JSON, bump to 70%
    let parsedData = await data.json();
    this.props.setProgress(70);
    
    this.setState({
      articles: parsedData.articles || [],
      totalResults: parsedData.totalResults,
      loading: false
    });
    
    // 4. Finish the loading bar at 100%
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  handlePrevClick = async () => {
    this.setState({ page: this.state.page - 1 }, () => {
      this.updateNews();
    });
  }

  handleNextClick = async () => {
    // Check if there's actually a next page available
    if (this.state.page + 1 <= Math.ceil(this.state.totalResults / this.state.pageSize)) {
      this.setState({ page: this.state.page + 1 }, () => {
        this.updateNews();
      });
    }
  }

  render() {
    return (
      <div className='container my-3'>
        <h2 className="text-center" style={{ margin: '35px 0px' }}>Kurrent News - Top Headlines</h2>
        {this.state.loading && <Spinner />}
        {/* {this.state.loading && <div className="text-center"><h4>Loading...</h4></div>} */}

        <div className='row'>
          {!this.state.loading && this.state.articles.map((element, index) => {
            return (
              <div className='col-md-4' key={element.url || index}>
                <NewsItems
                  title={element.title ? element.title.slice(0, 45) : ""}
                  description={element.description ? element.description.slice(0, 88) : ""}
                  imageUrl={element.urlToImage ? element.urlToImage : "https://images.macrumors.com/t/RQPLZ_3_iMyj3evjsWnMLVwPdyA=/1600x/article-new/2023/11/apple-pay-feature-dynamic-island.jpg"}
                  newsUrl={element.url} 
                  author={element.author}
                  date={element.publishedAt}
                />
              </div>
            )
          })}
        </div>

        {/* Pagination Buttons */}
        <div className="container d-flex justify-content-between my-4">
          <button 
            disabled={this.state.page <= 1} 
            type="button" 
            className="btn btn-dark" 
            onClick={this.handlePrevClick}
          > 
            &larr; Previous 
          </button>
          
          <button 
            disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.state.pageSize)} 
            type="button" 
            className="btn btn-dark" 
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    )
  }
}

// business  
// entertainment 
// general 
// health 
// science 
// sports 
// technology
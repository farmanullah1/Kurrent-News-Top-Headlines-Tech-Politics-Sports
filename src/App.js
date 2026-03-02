import './App.css';
import React, { Component } from 'react';
import Navbar from './components/Navbar';
import News from './components/News';
// 1. We import 'Routes' instead of 'Switch'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default class App extends Component {
  pageSize = 20;
  apiKey = '2e66700f670c47da992598c2989ac04f';
  country = 'us'; 

  state = {
    progress: 0
  }

  setProgress = (progress) => {
    this.setState({ progress: progress })
  }

  render() {
    return (
      <Router>
        <div>
          <Navbar />
          {/* 2. We wrap everything in <Routes> instead of <Switch> */}
          <Routes>
            {/* 3. We pass the component into the element={...} prop */}
            <Route exact path="/" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="general" pageSize={this.pageSize} country={this.country} category="general"/>} /> 
            <Route exact path="/business" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="business" pageSize={this.pageSize} country={this.country} category="business"/>} /> 
            <Route exact path="/entertainment" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="entertainment" pageSize={this.pageSize} country={this.country} category="entertainment"/>} /> 
            <Route exact path="/general" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="general" pageSize={this.pageSize} country={this.country} category="general"/>} /> 
            <Route exact path="/health" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="health" pageSize={this.pageSize} country={this.country} category="health"/>} /> 
            <Route exact path="/science" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="science" pageSize={this.pageSize} country={this.country} category="science"/>} /> 
            <Route exact path="/sports" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="sports" pageSize={this.pageSize} country={this.country} category="sports"/>} /> 
            <Route exact path="/technology" element={<News setProgress={this.setProgress} apiKey={this.apiKey} key="technology" pageSize={this.pageSize} country={this.country} category="technology"/>} />
          </Routes>
        </div>
      </Router>
    )
  }
}
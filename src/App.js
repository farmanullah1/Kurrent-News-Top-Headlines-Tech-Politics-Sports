import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import News from './components/News';
import LoadingBar from "react-top-loading-bar";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const pageSize = 9;
  
  // ALL 3 API KEYS STORED HERE
  const newsApiKey = "2e66700f670c47da992598c2989ac04f";
  const newsDataKey = "pub_83af34deccd54eea83ddf3d221e93526";
  const gNewsKey = "0066682908ed1f1be9b7a82b03ba3906";
  
  const [progress, setProgress] = useState(0);
  const [country, setCountry] = useState('pk'); 
  const [searchQuery, setSearchQuery] = useState(''); 

  return (
    <Router>
      <div>
        <LoadingBar height={5} color='#f11946' progress={progress} />
        
        <Navbar 
          setCountry={setCountry} 
          setSearchQuery={setSearchQuery} 
          currentCountry={country} 
        />
    
        <Routes>
          <Route exact path="/" element={<News setProgress={setProgress} newsApiKey={newsApiKey} newsDataKey={newsDataKey} gNewsKey={gNewsKey} key={`general-${country}-${searchQuery}`} pageSize={pageSize} country={country} category="general" searchQuery={searchQuery} />} /> 
          <Route exact path="/business" element={<News setProgress={setProgress} newsApiKey={newsApiKey} newsDataKey={newsDataKey} gNewsKey={gNewsKey} key={`bus-${country}-${searchQuery}`} pageSize={pageSize} country={country} category="business" searchQuery={searchQuery} />} /> 
          <Route exact path="/entertainment" element={<News setProgress={setProgress} newsApiKey={newsApiKey} newsDataKey={newsDataKey} gNewsKey={gNewsKey} key={`ent-${country}-${searchQuery}`} pageSize={pageSize} country={country} category="entertainment" searchQuery={searchQuery} />} /> 
          <Route exact path="/general" element={<News setProgress={setProgress} newsApiKey={newsApiKey} newsDataKey={newsDataKey} gNewsKey={gNewsKey} key={`gen-${country}-${searchQuery}`} pageSize={pageSize} country={country} category="general" searchQuery={searchQuery} />} /> 
          <Route exact path="/health" element={<News setProgress={setProgress} newsApiKey={newsApiKey} newsDataKey={newsDataKey} gNewsKey={gNewsKey} key={`hea-${country}-${searchQuery}`} pageSize={pageSize} country={country} category="health" searchQuery={searchQuery} />} /> 
          <Route exact path="/science" element={<News setProgress={setProgress} newsApiKey={newsApiKey} newsDataKey={newsDataKey} gNewsKey={gNewsKey} key={`sci-${country}-${searchQuery}`} pageSize={pageSize} country={country} category="science" searchQuery={searchQuery} />} /> 
          <Route exact path="/sports" element={<News setProgress={setProgress} newsApiKey={newsApiKey} newsDataKey={newsDataKey} gNewsKey={gNewsKey} key={`spo-${country}-${searchQuery}`} pageSize={pageSize} country={country} category="sports" searchQuery={searchQuery} />} /> 
          <Route exact path="/technology" element={<News setProgress={setProgress} newsApiKey={newsApiKey} newsDataKey={newsDataKey} gNewsKey={gNewsKey} key={`tech-${country}-${searchQuery}`} pageSize={pageSize} country={country} category="technology" searchQuery={searchQuery} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
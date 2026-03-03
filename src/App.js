import './App.css';
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import News from './components/News';
import LoadingBar from "react-top-loading-bar";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const pageSize = 10;
  const apiKey = "2e66700f670c47da992598c2989ac04f";
  const country = 'us'; 

  // Replace state object with useState hook
  const [progress, setProgress] = useState(0);

  return (
    <Router>
      <div>
        <LoadingBar
          height={5}
          color='#f11946'
          progress={progress}
        />
        <Navbar />
    
        <Routes>
          {/* Removed 'this.' from all variables */}
          <Route exact path="/" element={<News setProgress={setProgress} apiKey={apiKey} key="general" pageSize={pageSize} country={country} category="general"/>} /> 
          <Route exact path="/business" element={<News setProgress={setProgress} apiKey={apiKey} key="business" pageSize={pageSize} country={country} category="business"/>} /> 
          <Route exact path="/entertainment" element={<News setProgress={setProgress} apiKey={apiKey} key="entertainment" pageSize={pageSize} country={country} category="entertainment"/>} /> 
          <Route exact path="/general" element={<News setProgress={setProgress} apiKey={apiKey} key="general" pageSize={pageSize} country={country} category="general"/>} /> 
          <Route exact path="/health" element={<News setProgress={setProgress} apiKey={apiKey} key="health" pageSize={pageSize} country={country} category="health"/>} /> 
          <Route exact path="/science" element={<News setProgress={setProgress} apiKey={apiKey} key="science" pageSize={pageSize} country={country} category="science"/>} /> 
          <Route exact path="/sports" element={<News setProgress={setProgress} apiKey={apiKey} key="sports" pageSize={pageSize} country={country} category="sports"/>} /> 
          <Route exact path="/technology" element={<News setProgress={setProgress} apiKey={apiKey} key="technology" pageSize={pageSize} country={country} category="technology"/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
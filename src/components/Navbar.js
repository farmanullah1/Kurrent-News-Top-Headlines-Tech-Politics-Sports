import React, { Component } from 'react'
// You MUST import Link from react-router-dom
import { Link } from 'react-router-dom'

export default class Navbar extends Component {
  render() {
    return (
      <nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
        <div className='container-fluid'>
          {/* Notice the capital 'L' in Link */}
          <Link className='navbar-brand' to='/'>Kurrent News</Link>
          <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent'>
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarSupportedContent'>
            <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
              <li className='nav-item'><Link className='nav-link active' to='/'>Home</Link></li>
              <li className='nav-item'><Link className='nav-link' to='/about'>About</Link></li>
              <li className='nav-item'><Link className='nav-link' to='/business'>Business</Link></li>
              <li className='nav-item'><Link className='nav-link' to='/entertainment'>Entertainment</Link></li>
              <li className='nav-item'><Link className='nav-link' to='/general'>General</Link></li>
              <li className='nav-item'><Link className='nav-link' to='/health'>Health</Link></li>
              <li className='nav-item'><Link className='nav-link' to='/science'>Science</Link></li>
              <li className='nav-item'><Link className='nav-link' to='/sports'>Sports</Link></li>
              <li className='nav-item'><Link className='nav-link' to='/technology'>Technology</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}
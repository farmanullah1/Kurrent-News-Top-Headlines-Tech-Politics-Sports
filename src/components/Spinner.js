import React, { Component } from 'react'
import loading from './loading.gif'

// Simplified to a single default export
export default class Spinner extends Component {
  render() {
    return (
      <div className="text-center my-3">
        <img src={loading} alt="loading spinner" />
      </div>
    )
  }
}
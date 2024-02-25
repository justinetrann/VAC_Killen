import React from 'react';
import Navbar from '../components/Navbar';
import './Sermon.css';

function Sermon() {

  return (
    <div className='Sermon'>
      <Navbar />
      <div className="sermon-content">
      </div>
      <div style={{ height: '200px' }}/>
    </div>
  );
}

export default Sermon;
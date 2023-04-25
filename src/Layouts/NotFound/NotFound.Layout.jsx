import React from 'react';
import './NotFound.scss';

const NotFoundLayout = () => {
  return (
    navigator.onLine && (
      <div className='no-data-result'>
        <div item className='no-data-text'>
          <h1 className='no-data-title'>404</h1>
          <h3 className='no-data-result-subtitle'>Page Not Found</h3>
        </div>
      </div>
    )
  );
};
export default NotFoundLayout;

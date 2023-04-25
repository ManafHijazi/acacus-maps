import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress, Backdrop } from '@mui/material';
import './Loader.Style.scss';

export const LoaderComponent = ({ isLoading }) =>
  isLoading && (
    <div className='loader-wrapper'>
      <Backdrop open>
        <CircularProgress size={60} />
      </Backdrop>
    </div>
  );

LoaderComponent.propTypes = {
  isLoading: PropTypes.bool,
};
LoaderComponent.defaultProps = {
  isLoading: false,
};

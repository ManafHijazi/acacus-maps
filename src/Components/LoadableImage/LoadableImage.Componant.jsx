import React, { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';
import './LoadableImage.Style.scss';

export const LoadableImageComponant = memo(
  ({
    src,
    alt,
    type,
    defaultImage,
    variant,
    classes,
    withOverlay,
    overlayText,
    overlayImage,
    onFinishLoading,
    style,
    skeltonClasses,
  }) => {
    const [state, setState] = useState(false);
    const [localSrc, setLocalSrc] = useState(null);
    const mounted = useRef(true);

    useEffect(() => {
      if (type === 'div') {
        const bgImg = new Image();
        bgImg.src = localSrc;
        bgImg.onload = () => {
          if (mounted.current) {
            setState(true);
            if (onFinishLoading) onFinishLoading();
          }
        };
        bgImg.onerror = () => {
          if (mounted.current && defaultImage) {
            setState(true);
            setLocalSrc(defaultImage);
            if (onFinishLoading) onFinishLoading();
          }
        };
      }
    }, [mounted, onFinishLoading, localSrc, type, defaultImage]);

    useEffect(() => {
      setLocalSrc(src);
    }, [src]);

    useEffect(
      () => () => {
        mounted.current = false;
      },
      []
    );

    return (
      <>
        {type === 'image' && (
          <img
            src={localSrc}
            alt={alt}
            className={`loadable-image-wrapper ${classes} ${state ? ' show' : ' hidden'}`}
            onLoad={() => {
              setState(true);
              if (onFinishLoading) onFinishLoading();
            }}
            onError={() => {
              setState(true);
            }}
          />
        )}
        {type === 'div' && state && (
          <div
            className={`loadable-image-div-wrapper ${classes}`}
            aria-label={alt}
            role='img'
            style={{
              ...(style || {}),
              backgroundImage: `url(${localSrc})`,
            }}
          />
        )}
        {!state && src && (
          <div className={`loadable-skelton-wrapper ${skeltonClasses || ''}`}>
            <Skeleton variant={variant} style={{ width: '100%', height: '100%' }} />
          </div>
        )}
        {withOverlay && (
          <div className='loadable-overlay'>
            {overlayText && <span>{overlayText}</span>}
            {overlayImage && <span className={overlayImage} />}
          </div>
        )}
      </>
    );
  }
);

LoadableImageComponant.displayName = 'LoadableImageComponent';

LoadableImageComponant.propTypes = {
  src: PropTypes.string,
  defaultImage: PropTypes.string,
  alt: PropTypes.string.isRequired,
  type: PropTypes.string,
  classes: PropTypes.string,
  onFinishLoading: PropTypes.func,
  withOverlay: PropTypes.bool,
  overlayText: PropTypes.string,
  variant: PropTypes.string,
  skeltonClasses: PropTypes.string,
  overlayImage: PropTypes.string,
  style: PropTypes.instanceOf(Object),
};
LoadableImageComponant.defaultProps = {
  src: undefined,
  type: 'div',
  defaultImage: undefined,
  withOverlay: false,
  overlayText: undefined,
  overlayImage: undefined,
  onFinishLoading: undefined,
  variant: undefined,
  skeltonClasses: undefined,
  style: undefined,
  classes: undefined,
};

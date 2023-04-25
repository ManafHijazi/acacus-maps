import React, { memo, useRef } from 'react';
import Collapse from '@mui/material/Collapse';
import { PropTypes } from 'prop-types';
import { useOnClickOutside } from '../../Hooks';
import './Collapse.Style.scss';

export const CollapseComponent = memo(
  ({ isOpen, top, component, onClickOutside, classes, isCentered, isAbsolute }) => {
    const collapseRef = useRef(null);
    useOnClickOutside(collapseRef, () => {
      if (onClickOutside) onClickOutside();
    });

    return (
      <Collapse
        in={isOpen}
        ref={collapseRef}
        className={`collapse-wrapper ${classes}${isCentered ? ' is-centered' : ''}${
          (isAbsolute && ' is-absolute') || ''
        }`}
        style={{ top }}>
        {component}
      </Collapse>
    );
  }
);
CollapseComponent.displayName = 'CollapseComponent';
export default CollapseComponent;
CollapseComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  component: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node])
    .isRequired,
  onClickOutside: PropTypes.func,
  top: PropTypes.number,
  classes: PropTypes.string,
  isCentered: PropTypes.bool,
  isAbsolute: PropTypes.bool,
};
CollapseComponent.defaultProps = {
  onClickOutside: undefined,
  top: 0,
  classes: '',
  isCentered: false,
  isAbsolute: false,
};

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { SelectComponent } from '../Select/Select.Component';
import { Inputs } from '../Inputs/Inputs.Component';
import { PaginationEnum } from '../../enums';
import './Pagination.Style.scss';

export const PaginationComponent = ({
  idRef,
  ofText,
  pageSize,
  pagesText,
  pageIndex,
  totalCount,
  perPageText,
  isRemoveTexts,
  translationPath,
  onPageSizeChanged,
  isReversedSections,
  onPageIndexChanged,
  isButtonsNavigation,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [pageNumber, setPageNumber] = useState(pageIndex + 1);

  const pageChangeHandler = (keyValue) => () => {
    let value = pageIndex;

    if (keyValue === 'leftLast') value = 0;
    else if (keyValue === 'left') value -= 1;
    else if (keyValue === 'right') value += 1;
    else if (keyValue === 'rightLast') value = Math.floor(totalCount / pageSize);

    setPageNumber(value + 1);

    if (onPageIndexChanged && value !== pageIndex) onPageIndexChanged(value);
  };

  const onPageNumberChange = useMemo(
    () => (newValue) => {
      let localValue = newValue;
      if (+localValue * pageSize >= totalCount) localValue = Math.ceil(totalCount / pageSize);
      setPageNumber(+localValue);
      if (Number.isNaN(+localValue) || +localValue < 1) return;
      if (onPageIndexChanged && localValue !== pageIndex + 1) onPageIndexChanged(+localValue - 1);
    },
    [onPageIndexChanged, pageIndex, pageSize, totalCount],
  );

  return (
    <div
      className={`pagination-component-wrapper${
        (isReversedSections && ' is-reversed-section') || ''
      }`}
    >
      <div className='pagination-section'>
        {!isRemoveTexts && (
          <span className='fz-14px fw-medium pages-text'>
            {t(`${translationPath}${pagesText}`)}:
          </span>
        )}
        <ButtonBase
          className='btns-icon mx-2 theme-outline bc-secondary'
          disabled={pageIndex === 0}
          onClick={pageChangeHandler('leftLast')}
        >
          <span className='mdi mdi-chevron-double-left' />
        </ButtonBase>
        <ButtonBase
          className='btns-icon mx-2 theme-outline bc-secondary'
          disabled={pageIndex === 0}
          onClick={pageChangeHandler('left')}
        >
          <span className='mdi mdi-chevron-left' />
        </ButtonBase>
        {!isButtonsNavigation && (
          <Inputs
            idRef={`${idRef}input`}
            value={pageNumber}
            type='number'
            wrapperClasses='pagination-input'
            themeClass='theme-solid'
            onInputChanged={(event) => {
              const { value } = event.target;
              onPageNumberChange(value);
            }}
            min={1}
          />
        )}
        {isButtonsNavigation &&
          Array.from(
            {
              length:
                (Math.ceil(totalCount / pageSize) <= 5 && Math.ceil(totalCount / pageSize)) || 5,
            },
            (data, index) => (
              <ButtonBase
                key={`paginationButtonsKey${idRef}${index + 1}`}
                className={`btns-icon ${
                  (pageNumber - 1 === index && 'theme-solid bg-primary') || 'theme-transparent'
                }`}
                onClick={() =>
                  onPageNumberChange(
                    (Math.ceil(totalCount / pageSize) <= 5 && index + 1) || pageNumber + index,
                  )
                }
              >
                <span>
                  {(Math.ceil(totalCount / pageSize) <= 5 && index + 1) || pageNumber + index}
                </span>
              </ButtonBase>
            ),
          )}
        <ButtonBase
          className='btns-icon mx-2 theme-outline bc-secondary'
          disabled={pageNumber * pageSize >= totalCount}
          onClick={pageChangeHandler('right')}
        >
          <span className='mdi mdi-chevron-right' />
        </ButtonBase>
        <ButtonBase
          className='btns-icon mx-2 theme-outline bc-secondary'
          disabled={pageNumber * pageSize >= totalCount}
          onClick={pageChangeHandler('rightLast')}
        >
          <span className='mdi mdi-chevron-double-right' />
        </ButtonBase>
      </div>
      <div className='pagination-section'>
        {!isRemoveTexts && (
          <span className='fz-14px fw-medium per-page-text'>
            {t(`${translationPath}${perPageText}`)}
          </span>
        )}
        <SelectComponent
          value={pageSize}
          valueInput='key'
          textInput='value'
          wrapperClasses='mx-1'
          idRef={`${idRef}select`}
          onSelectChanged={onPageSizeChanged}
          data={Object.values(PaginationEnum)}
        />
        <span className='details-wrapper'>
          <span className='px-1'>{pageIndex || pageIndex + 1}</span>
          <span className='mdi mdi-minus' />
          <span className='px-1'>{pageSize}</span>
          <span>{t(`${translationPath}${ofText}`)}</span>
          <span className='px-1'>{totalCount}</span>
        </span>
      </div>
    </div>
  );
};

PaginationComponent.propTypes = {
  idRef: PropTypes.string,
  ofText: PropTypes.string,
  pagesText: PropTypes.string,
  isRemoveTexts: PropTypes.bool,
  perPageText: PropTypes.string,
  translationPath: PropTypes.string,
  isReversedSections: PropTypes.bool,
  isButtonsNavigation: PropTypes.bool,
  pageIndex: PropTypes.number.isRequired,
  parentTranslationPath: PropTypes.string,
  totalCount: PropTypes.number.isRequired,
  onPageSizeChanged: PropTypes.func.isRequired,
  onPageIndexChanged: PropTypes.func.isRequired,
  pageSize: PropTypes.oneOf(Object.keys(PaginationEnum).map((item) => +item)),
};
PaginationComponent.defaultProps = {
  ofText: 'of',
  pagesText: 'pages',
  translationPath: '',
  isRemoveTexts: false,
  idRef: 'paginationRef',
  isReversedSections: false,
  isButtonsNavigation: false,
  perPageText: 'item-per-page',
  parentTranslationPath: 'Shared',
  pageSize: PaginationEnum[10].key,
};

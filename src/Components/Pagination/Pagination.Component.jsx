import React, { useState, useMemo } from 'react';
import { ButtonBase } from '@mui/material';
import { PaginationEnum } from '../../enums';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../Inputs/Inputs.Component';
import { SelectComponent } from '../Select/Select.Component';
import './Pagination.Style.scss';

export const PaginationComponent = ({
  idRef,
  ofText,
  pageSize,
  pageIndex,
  pagesText,
  totalCount,
  page_count,
  page_limit,
  perPageText,
  current_page,
  isRemoveTexts,
  translationPath,
  isWithoutNumbers,
  isWithoutLastPage,
  onPageSizeChanged,
  isReversedSections,
  onPageIndexChanged,
  isButtonsNavigation,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [pageNumber, setPageNumber] = useState(pageIndex);
  const [localPageSize, setLocalPageSize] = useState(5);

  const pageChangeHandler = (keyValue) => () => {
    let value = pageIndex;

    if (keyValue === 'leftLast') value = 1;
    else if (keyValue === 'left') {
      value -= 1;
      setLocalPageSize((items) => items - 5);
    } else if (keyValue === 'right') {
      value += 1;
      setLocalPageSize((items) => items + 5);
    } else if (keyValue === 'rightLast')
      value = page_count ? page_count : Math.floor(totalCount / +pageSize + 1);

    setPageNumber(value);

    if (onPageIndexChanged && value !== pageIndex) onPageIndexChanged(value);
  };

  const onPageNumberChange = useMemo(
    () => (newValue) => {
      let localValue = newValue;
      //   if (+localValue * +pageSize >= totalCount) localValue = Math.ceil(totalCount / +pageSize);
      setPageNumber(+localValue);
      if (Number.isNaN(+localValue) || +localValue < 1) return;
      if (onPageIndexChanged && localValue !== pageIndex + 1) onPageIndexChanged(+localValue - 1);
    },
    [onPageIndexChanged, pageIndex, +pageSize, totalCount]
  );

  const pageIndexValueHandler = () => {
    let start = 0;
    let end = 0;

    if (current_page == 1) {
      start = 1;
      end = page_limit;
    }

    if (current_page > 1 && current_page < page_count) {
      start = page_limit;
      end = page_limit + page_limit;
    }

    if (current_page == page_count) {
      start = totalCount;
      end = totalCount;
    }

    return { start, end };
  };

  return (
    <div
      className={`pagination-component-wrapper${
        (isReversedSections && ' is-reversed-section') || ''
      }`}>
      <div className='pagination-section'>
        {!isRemoveTexts && (
          <span className='fz-14px fw-medium pages-text'>
            {t(`${translationPath}${pagesText}`)}:
          </span>
        )}
        {!isWithoutLastPage && (
          <ButtonBase
            className='btns-icon mx-2 theme-outline'
            disabled={pageIndex === 1}
            onClick={pageChangeHandler('leftLast')}>
            <span className='mdi mdi-chevron-double-left' />
          </ButtonBase>
        )}
        <ButtonBase
          className='btns-icon mx-2 theme-outline'
          disabled={pageIndex === 1}
          onClick={pageChangeHandler('left')}>
          <span className='mdi mdi-chevron-left' />
        </ButtonBase>
        {!isButtonsNavigation && !isWithoutNumbers && (
          <Inputs
            min={1}
            idRef={`${idRef}input`}
            value={pageNumber}
            type='number'
            wrapperClasses='pagination-input'
            themeClass='theme-solid'
            onInputChanged={(event) => {
              const { value } = event.target;
              onPageNumberChange(value);
            }}
          />
        )}
        {isButtonsNavigation &&
          Array.from(
            {
              length:
                (Math.ceil(totalCount / +pageSize) <= 5 && Math.ceil(totalCount / +pageSize)) || 5,
            },
            (data, index) => (
              <ButtonBase
                key={`paginationButtonsKey${idRef}${index + 1}`}
                className={`btns-icon ${
                  (pageNumber === index + 1 && 'theme-solid bg-secondary') || 'theme-transparent'
                }`}
                onClick={() =>
                  onPageNumberChange(
                    (Math.ceil(totalCount / +pageSize) <= 5 && index + 1) ||
                      pageNumber - 2 + index + 1
                  )
                }>
                <span>
                  {(Math.ceil(totalCount / +pageSize) <= 5 && index + 1) ||
                    pageNumber - 2 + index + 1}
                </span>
              </ButtonBase>
            )
          )}
        <ButtonBase
          className='btns-icon mx-2 theme-outline'
          disabled={+pageIndex >= totalCount / +pageSize}
          onClick={pageChangeHandler('right')}>
          <span className='mdi mdi-chevron-right' />
        </ButtonBase>
        {!isWithoutLastPage && (
          <ButtonBase
            className='btns-icon mx-2 theme-outline '
            disabled={+pageIndex >= totalCount / +pageSize}
            onClick={pageChangeHandler('rightLast')}>
            <span className='mdi mdi-chevron-double-right' />
          </ButtonBase>
        )}
      </div>
      <div className='pagination-section'>
        {!isRemoveTexts && (
          <span className='fz-14px fw-medium per-page-text'>
            {t(`${translationPath}${perPageText}`)}
          </span>
        )}
        {onPageSizeChanged && (
          <SelectComponent
            valueInput='key'
            textInput='value'
            value={+pageSize}
            wrapperClasses='mx-1'
            idRef={`${idRef}select`}
            onSelectChanged={onPageSizeChanged}
            data={Object.values(PaginationEnum)}
          />
        )}

        {current_page && page_limit && page_count ? (
          <span className='details-wrapper'>
            <span className='px-1'>{pageIndexValueHandler()?.start || 0}</span>
            <span className='mdi mdi-minus' />
            <span className='px-1'>{pageIndexValueHandler()?.end || 0}</span>
            <span>{ofText}</span>
            <span className='px-1'>{totalCount}</span>
          </span>
        ) : (
          <span className='details-wrapper'>
            <span className='px-1'>{pageNumber}</span>
            <span className='mdi mdi-minus' />
            <span className='px-1'>{localPageSize}</span>
            <span>{ofText}</span>
            <span className='px-1'>{totalCount}</span>
          </span>
        )}
      </div>
    </div>
  );
};

PaginationComponent.defaultProps = {
  pageSize: 5,
  ofText: 'of',
  page_limit: 0,
  page_count: 0,
  current_page: 0,
  pagesText: 'pages',
  isRemoveTexts: false,
  idRef: 'paginationRef',
  isWithoutNumbers: false,
  isWithoutLastPage: false,
  isReversedSections: false,
  isButtonsNavigation: false,
  perPageText: 'item-per-page',
  onPageSizeChanged: undefined,
  translationPath: 'pagination.',
  parentTranslationPath: 'Shared',
};

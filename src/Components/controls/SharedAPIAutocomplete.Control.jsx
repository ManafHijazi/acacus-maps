/**
 * @author Manaf Hijazi (manafhijazii@gmail.com)
 */
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import { AutocompleteComponent, LoaderComponent } from '../../Components';
import { GlobalSearchDelay } from '../../Helpers';
import { DynamicFormTypesEnum } from '../../enums';

export const SharedAPIAutocompleteControl = memo(
  ({
    getDataAPI,
    editValue,
    extraProps,
    dataKey,
    searchKey,
    titleKey,
    uniqueKey,
    savingKey,
    onValueChanged,
    idRef,
    stateKey,
    parentId,
    subParentId,
    parentIndex,
    subParentIndex,
    max,
    title,
    placeholder,
    errorPath,
    isRequired,
    type,
    errors,
    isSubmitted,
    isDisabled,
    isEntireObject,
    isFullWidth,
    isTwoThirdsWidth,
    isHalfWidth,
    isQuarterWidth,
    getOptionLabel,
    getItemByIdAPI,
    byIdDataKey,
    parentTranslationPath,
    translationPath,
    labelValue,
    tabIndex,
    isDataObject,
    endAdornment,
    inputEndAdornment,
    wrapperClasses,
    getAPIProperties,
  }) => {
    const { t } = useTranslation('Shared');
    const localExtraPropsRef = useRef(extraProps);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(() => ({
      results: [],
      totalCount: 0,
    }));
    // eslint-disable-next-line max-len
    const [localEditValue, setLocalEditValue] = useState(() =>
      type === DynamicFormTypesEnum.select.key ? null : []
    );
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState({
      page: 1,
      limit: 10,
    });
    const searchTimerRef = useRef(null);
    const searchHandler = (event) => {
      const { value } = event.target;
      if (!searchKey) return;

      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        setSearch(value);
        setFilter((items) => ({ ...items, page: 1 }));
      }, GlobalSearchDelay);
    };

    /**
     * @author Manaf Hijazi (manafhijazii@gmail.com)
     * @Description to get autocomplete data on search or init
     */
    const getAllData = useCallback(async () => {
      setIsLoading(true);
      const response = await getDataAPI(
        (getAPIProperties &&
          getAPIProperties({
            apiFilter: filter,
            apiSearch: search,
            apiExtraProps: localExtraPropsRef.current,
          })) || {
          ...((searchKey && filter) || {}),
          ...((searchKey && {
            [searchKey]: search,
          }) ||
            {}),
          ...(localExtraPropsRef.current || {}),
        }
      );
      setIsLoading(false);
      if (response && response.status === 200)
        if (filter.page === 1)
          setData({
            results:
              (isDataObject && Object.values(response.data.results)) ||
              (dataKey && response.data.results[dataKey]) ||
              response.data.results ||
              [],
            totalCount:
              (response.data.paginate && response.data.paginate.total) ||
              (
                (isDataObject && Object.values(response.data.results)) ||
                response.data.results ||
                []
              ).length ||
              ((dataKey && response.data.results[dataKey]) || response.data.results || []).length,
          });
        else
          setData((items) => ({
            ...items,
            results: items.results.concat(
              (dataKey && response.data.results[dataKey]) || response.data.results || []
            ),
          }));
      else setData({ results: [], totalCount: 0 });
    }, [getDataAPI, getAPIProperties, searchKey, filter, search, isDataObject, dataKey]);

    /**
     * @author Manaf Hijazi (manafhijazii@gmail.com)
     * @Description to get item by id the item selected but not exists in data
     */
    const getItemByIdHandler = useCallback(
      async (arrayItemUUID = null) => {
        setIsLoading(true);
        const response = await getItemByIdAPI({
          [uniqueKey]: arrayItemUUID || (savingKey && editValue[savingKey]) || editValue,
        });
        setIsLoading(false);
        if (response && response.status === 200)
          return (
            (byIdDataKey && response.data.results[byIdDataKey]) || response.data.results || null
          );

        return null;
      },
      [byIdDataKey, editValue, getItemByIdAPI, savingKey, uniqueKey]
    );

    /**
     * @author Manaf Hijazi (manafhijazii@gmail.com)
     * @Description to init selected data for array autocomplete
     */
    const getArrayEditInit = useCallback(async () => {
      if (type !== DynamicFormTypesEnum.array.key) return;
      if (editValue && data.results.length > 0) {
        const toAddData = [];
        const notFoundInDataItems = [];
        await Promise.all(
          editValue.map(async (value) => {
            let currentItem = data.results.find(
              (item) =>
                (savingKey && item[uniqueKey] === value[savingKey]) || item[uniqueKey] === value
            );
            if (!currentItem && getItemByIdAPI) {
              currentItem = await getItemByIdHandler((savingKey && value[savingKey]) || value);
              if (currentItem) notFoundInDataItems.push(currentItem);
            }
            if (currentItem) toAddData.push(currentItem);

            return undefined;
          })
        );
        if (notFoundInDataItems.length > 0)
          setData((items) => {
            const localItems = { ...items };
            localItems.results = localItems.results.concat(notFoundInDataItems);

            return localItems;
          });
        setLocalEditValue((items) => {
          if (!items || items.length !== toAddData.length) return toAddData;

          return items;
        });
        if (toAddData.length !== editValue.length && onValueChanged)
          onValueChanged({
            parentId,
            parentIndex,
            subParentId,
            subParentIndex,
            id: stateKey,
            value: (isEntireObject && toAddData) || toAddData.map((item) => item[uniqueKey]),
          });
      }
    }, [
      type,
      editValue,
      data.results,
      onValueChanged,
      parentId,
      parentIndex,
      subParentId,
      subParentIndex,
      stateKey,
      isEntireObject,
      getItemByIdAPI,
      savingKey,
      uniqueKey,
      getItemByIdHandler,
    ]);

    /**
     * @author Manaf Hijazi (manafhijazii@gmail.com)
     * @Description to init selected data for select autocomplete
     */
    const getSelectEditInit = useCallback(async () => {
      if (type !== DynamicFormTypesEnum.select.key) return;
      if (editValue && data.results.length > 0) {
        let currentItem = data.results.find(
          (item) =>
            (savingKey && item[uniqueKey] === editValue[savingKey]) || item[uniqueKey] === editValue
        );
        if (!currentItem && getItemByIdAPI) {
          currentItem = await getItemByIdHandler();
          if (currentItem)
            setData((items) => {
              const localItems = { ...items };
              localItems.results.push(currentItem);

              return localItems;
            });
        }

        if (currentItem) setLocalEditValue(currentItem);
        else if (onValueChanged)
          onValueChanged({
            parentId,
            parentIndex,
            subParentId,
            subParentIndex,
            id: stateKey,
            value: null,
          });
      }
    }, [
      type,
      editValue,
      data,
      getItemByIdAPI,
      getItemByIdHandler,
      onValueChanged,
      parentId,
      parentIndex,
      subParentId,
      subParentIndex,
      stateKey,
      uniqueKey,
      savingKey,
    ]);

    /**
     * @author Manaf Hijazi (manafhijazii@gmail.com)
     * @Description this method to load more data on scroll to the end of autocomplete
     * if there is more data to load
     */
    const onScrollEndHandler = useCallback(() => {
      if (data.totalCount > data.results.length)
        setFilter((items) => ({ ...items, page: items.page + 1 }));
    }, [data.results.length, data.totalCount]);

    /**
     * @author Manaf Hijazi (manafhijazii@gmail.com)
     * @Description to init selected data for select autocomplete
     */
    const paperComponentHandler = useMemo(
      // eslint-disable-next-line react/prop-types,react/display-name
      () =>
        ({ children, className }) =>
          (
            <Paper className={className}>
              {children}
              <ButtonBase
                className='btns mx-0 theme-transparent w-100 br-0'
                disabled={isDisabled || isLoading}
                onMouseDown={(event) => event.preventDefault()}
                onClick={onScrollEndHandler}>
                <LoaderComponent
                  isLoading={isLoading}
                  isSkeleton
                  wrapperClasses='position-absolute w-100 h-100'
                  skeletonStyle={{ width: '100%', height: '100%' }}
                />
                <span>{t('load-more')}</span>
              </ButtonBase>
            </Paper>
          ),
      [isDisabled, isLoading, onScrollEndHandler, t]
    );

    // to init array autocomplete edit value
    useEffect(() => {
      if (type === DynamicFormTypesEnum.array.key);
      getArrayEditInit();
    }, [type, getArrayEditInit]);

    // to init select autocomplete edit value
    useEffect(() => {
      if (type === DynamicFormTypesEnum.select.key);
      getSelectEditInit();
    }, [type, getSelectEditInit]);

    // to all data on search or init
    useEffect(() => {
      getAllData();
    }, [getAllData, filter]);

    // to prevent memory leak if component destroyed before time finish
    useEffect(
      () => () => {
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      },
      []
    );

    // This is to handle updating the localExtraProps locally
    useEffect(() => {
      if (
        extraProps &&
        Object.entries(extraProps).findIndex(
          (item) =>
            !localExtraPropsRef.current ||
            (typeof item[1] !== 'function' &&
              ((typeof localExtraPropsRef.current[item[0]] === 'object' &&
                Array.isArray(localExtraPropsRef.current[item[0]]) &&
                JSON.stringify(item[1]) !== JSON.stringify(localExtraPropsRef.current[item[0]])) ||
                (typeof localExtraPropsRef.current[item[0]] !== 'object' &&
                  !Array.isArray(localExtraPropsRef.current[item[0]]) &&
                  localExtraPropsRef.current[item[0]] !== item[1])))
        ) !== -1
      ) {
        localExtraPropsRef.current = { ...extraProps };
        getAllData();
      }
    }, [extraProps, getAllData]);

    return (
      <div
        className={`${
          (type === DynamicFormTypesEnum.array.key && 'shared-api-autocomplete-wrapper') ||
          'shared-api-select-wrapper'
        }${(isFullWidth && ' is-full-width') || ''}${
          (isTwoThirdsWidth && ' is-two-thirds-width') || ''
        }${(isHalfWidth && ' is-half-width') || ''}${
          (isQuarterWidth && ' is-quarter-width') || ''
        } shared-control-wrapper`}>
        <AutocompleteComponent
          idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${subParentId || ''}-${
            subParentIndex || 0
          }-${stateKey}`}
          isRequired={isRequired}
          endAdornment={endAdornment}
          inputEndAdornment={inputEndAdornment}
          getOptionLabel={getOptionLabel || ((option) => option[titleKey] || '')}
          chipsLabel={getOptionLabel || ((option) => option[titleKey] || '')}
          value={localEditValue}
          getOptionSelected={(option, value) => option?.[uniqueKey] === value?.[uniqueKey]}
          data={data.results}
          inputLabel={title}
          multiple={type === DynamicFormTypesEnum.array.key}
          maxNumber={(max && type === DynamicFormTypesEnum.array.key && max) || undefined}
          isDisabled={
            isDisabled ||
            (max && type === DynamicFormTypesEnum.array.key && localEditValue.length >= max) ||
            undefined
          }
          error={(errorPath && errors[errorPath] && errors[errorPath].error) || undefined}
          isSubmitted={isSubmitted}
          tabIndex={tabIndex}
          helperText={(errorPath && errors[errorPath] && errors[errorPath].message) || undefined}
          onInputKeyUp={searchHandler}
          inputPlaceholder={placeholder}
          labelValue={labelValue}
          isLoading={isLoading}
          themeClass='theme-solid'
          paperComponent={
            (data.totalCount > data.results.length && paperComponentHandler) || undefined
          }
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          withExternalChips={type === DynamicFormTypesEnum.array.key}
          onScrollEnd={onScrollEndHandler}
          onChange={(e, newValue) => {
            setLocalEditValue(newValue);
            if (onValueChanged)
              onValueChanged({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                id: stateKey,
                value:
                  (type === DynamicFormTypesEnum.array.key &&
                    ((newValue &&
                      ((isEntireObject && newValue) ||
                        newValue.map(
                          (item) =>
                            (savingKey && { [savingKey]: item[uniqueKey] }) || item[uniqueKey]
                        ))) ||
                      [])) ||
                  (type === DynamicFormTypesEnum.select.key &&
                    newValue &&
                    ((isEntireObject && newValue) ||
                      (savingKey && { [savingKey]: newValue[uniqueKey] }) ||
                      newValue[uniqueKey])) ||
                  null,
              });
          }}
          wrapperClasses={wrapperClasses}
        />
        {type === DynamicFormTypesEnum.array.key && localEditValue.length > 0 && (
          <div className={`separator-h ${(localEditValue.length === 0 && 'mt-3') || ''}`} />
        )}
      </div>
    );
  }
);

SharedAPIAutocompleteControl.displayName = 'SharedAPIAutocompleteControl';

SharedAPIAutocompleteControl.propTypes = {
  getDataAPI: PropTypes.func.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  stateKey: PropTypes.string.isRequired,
  labelValue: PropTypes.string,
  title: PropTypes.string,
  getOptionLabel: PropTypes.func,
  getAPIProperties: PropTypes.func,
  getItemByIdAPI: PropTypes.func,
  dataKey: PropTypes.string,
  extraProps: PropTypes.instanceOf(Object),
  type: PropTypes.oneOf(Object.values(DynamicFormTypesEnum).map((item) => item.key)),
  errors: PropTypes.instanceOf(Object),
  searchKey: PropTypes.string,
  savingKey: PropTypes.string,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  byIdDataKey: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentIndex: PropTypes.number,
  max: PropTypes.number,
  tabIndex: PropTypes.number,
  errorPath: PropTypes.string,
  isRequired: PropTypes.bool,
  isDataObject: PropTypes.bool,
  editValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
    PropTypes.string,
    PropTypes.number,
  ]),
  uniqueKey: PropTypes.string,
  titleKey: PropTypes.string,
  isEntireObject: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  idRef: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  endAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  inputEndAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  wrapperClasses: PropTypes.string,
};

SharedAPIAutocompleteControl.defaultProps = {
  idRef: 'SharedAPIAutocompleteControl',
  type: DynamicFormTypesEnum.select.key,
  title: undefined,
  editValue: null,
  extraProps: undefined,
  errors: {},
  isSubmitted: undefined,
  isEntireObject: false,
  dataKey: undefined,
  savingKey: undefined,
  tabIndex: undefined,
  uniqueKey: 'uuid',
  titleKey: 'title',
  searchKey: undefined,
  labelValue: undefined,
  parentId: undefined,
  subParentId: undefined,
  parentIndex: undefined,
  subParentIndex: undefined,
  max: undefined,
  errorPath: undefined,
  isRequired: undefined,
  isDataObject: undefined,
  isDisabled: undefined,
  isFullWidth: undefined,
  isTwoThirdsWidth: undefined,
  isHalfWidth: undefined,
  endAdornment: undefined,
  inputEndAdornment: undefined,
  isQuarterWidth: undefined,
  getOptionLabel: undefined,
  getItemByIdAPI: undefined,
  getAPIProperties: undefined,
  byIdDataKey: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
  wrapperClasses: undefined,
};

/* eslint-disable max-len */

/**
 * @author Manaf Hijazi (manafhijazii@gmail.com)
 */
import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {DynamicFormTypesEnum, DynamicFormHelpersEnum} from '../../enums';
import {GetAllItemsByHelperDynamic} from '../../Services';
import './SharedControls.Style.scss';
import {AutocompleteComponent} from "../Autocomplete/Autocomplete.Component";

export const SharedAutocompleteControl = ({
    helper_name,
    initValues,
    editValue,
    initValuesKey,
    initValuesTitle,
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
    type,
    errors,
    isSubmitted,
    isRequired,
    isHalfWidth,
    isQuarterWidth,
    parentTranslationPath,
    translationPath,
}) => {
    const [itemEnum] = useState(DynamicFormHelpersEnum[helper_name]);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(() => []);
    const [localEditValue, setLocalEditValue] = useState(
        () => (type === DynamicFormTypesEnum.array.key && []) || null,
    );

    /**
   * @author Manaf Hijazi (manafhijazii@gmail.com)
   * @Description to get data from helper api by current helper name
   */
    const getAllItemsByHelper = useCallback(async () => {
        if (!itemEnum) {
            // eslint-disable-next-line no-console
            console.log('not found', helper_name);

            return;
        }
        setIsLoading(true);
        const response = await GetAllItemsByHelperDynamic(
            itemEnum.apiPath,
            itemEnum.apiProps,
        );
        if (response && response.status === 200)
            setData(response.data[itemEnum.dataPath.results]);
        else setData([]);
        setIsLoading(false);
    }, [helper_name, itemEnum]);

    /**
   * @author Manaf Hijazi (manafhijazii@gmail.com)
   * @Description to init selected data for array autocomplete
   */
    const getArrayEditInit = useCallback(async () => {
        if (type !== DynamicFormTypesEnum.array.key) return;
        if (editValue && editValue.length > 0 && data.length > 0) {
            const toAddData = [];
            editValue.map((value) => {
                const currentItem = data.find(
                    (item) => item[(itemEnum && itemEnum.dataPath.uuid) || 'uuid'] === value,
                );
                if (currentItem) toAddData.push(currentItem);

                return undefined;
            });
            if (toAddData.length !== editValue.length && onValueChanged)
                onValueChanged({
                    parentId,
                    parentIndex,
                    subParentId,
                    subParentIndex,
                    id: stateKey,
                    value: toAddData,
                });
            setLocalEditValue(toAddData);
        }
    }, [
        type,
        editValue,
        data,
        onValueChanged,
        parentId,
        parentIndex,
        subParentId,
        subParentIndex,
        stateKey,
        itemEnum,
    ]);

    /**
   * @author Manaf Hijazi (manafhijazii@gmail.com)
   * @Description to init selected data for select autocomplete
   */
    const getSelectEditInit = useCallback(async () => {
        if (type !== DynamicFormTypesEnum.select.key) return;
        if (
            editValue
      && data.length > 0
      && (!helper_name || (itemEnum && itemEnum.dataPath))
        ) {
            const currentItem = data.find(
                (item) => (helper_name && item[itemEnum.dataPath.uuid] === editValue)
          || item.key === editValue,
            );
            if (currentItem) setLocalEditValue(currentItem);
            else if (onValueChanged)
                onValueChanged({
                    parentId,
                    parentIndex,
                    subParentId,
                    subParentIndex,
                    id: stateKey,
                    value: currentItem,
                });
        }
    }, [
        type,
        editValue,
        data,
        helper_name,
        itemEnum,
        onValueChanged,
        parentId,
        parentIndex,
        subParentId,
        subParentIndex,
        stateKey,
    ]);

    /**
   * @author Manaf Hijazi (manafhijazii@gmail.com)
   * @Description to init data for select autocomplete if data is from
   * external source
   */
    const getSelectDataInit = useCallback(() => {
        if (!helper_name && initValues && Array.isArray(initValues)) {
            const localData = initValues.map((item) => ({
                key: item[initValuesKey],
                title: item[initValuesTitle],
            }));
            setData(localData);
        }
    }, [helper_name, initValues, initValuesKey, initValuesTitle]);

    // to init select data if data came from external source
    useEffect(() => {
        if (type === DynamicFormTypesEnum.select.key);
        getSelectDataInit();
    }, [type, getSelectDataInit, initValues]);

    // to get data by helper name on init
    useEffect(() => {
        if (helper_name) getAllItemsByHelper();
    }, [helper_name, getAllItemsByHelper]);

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

    return (
        <div
            className={`${
                (type === DynamicFormTypesEnum.array.key && 'shared-autocomplete-wrapper')
        || 'shared-select-wrapper'
            }${(isHalfWidth && ' is-half-width') || ''}${
                (isQuarterWidth && ' is-quarter-width') || ''
            } shared-control-wrapper`}
        >
            <AutocompleteComponent
                idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
                    subParentId || ''
                }-${subParentIndex || 0}-${stateKey}`}
                getOptionLabel={(option) => (itemEnum && option[itemEnum.dataPath.title]) || option.title || ''}
                chipsLabel={(option) => (itemEnum && option[itemEnum.dataPath.title]) || option.title || ''}
                value={localEditValue}
                getOptionSelected={(option, value) => (!helper_name && initValues && option?.key === value?.key)
          || (itemEnum
            && option?.[itemEnum.dataPath.uuid] === value?.[itemEnum.dataPath.uuid])}
                data={data}
                inputLabel={title}
                multiple={type === DynamicFormTypesEnum.array.key}
                maxNumber={
                    (max && type === DynamicFormTypesEnum.array.key && max) || undefined
                }
                isDisabled={
                    (max
            && type === DynamicFormTypesEnum.array.key
            && localEditValue.length >= max)
          || undefined
                }
                error={
                    (errorPath && errors[errorPath] && errors[errorPath].error) || undefined
                }
                isSubmitted={isSubmitted}
                helperText={
                    (errorPath && errors[errorPath] && errors[errorPath].message) || undefined
                }
                inputPlaceholder={placeholder}
                isLoading={isLoading}
                themeClass="theme-solid"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isRequired={isRequired}
                withExternalChips={type === DynamicFormTypesEnum.array.key}
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
                (type === DynamicFormTypesEnum.array.key
                  && ((newValue
                    && newValue.map((item) => item[itemEnum.dataPath.uuid]))
                    || []))
                || (type === DynamicFormTypesEnum.select.key
                  && newValue
                  && ((helper_name && newValue[itemEnum.dataPath.uuid])
                    || newValue.key))
                || null,
                        });
                }}
            />
            {type === DynamicFormTypesEnum.array.key && (
                <div
                    className={`separator-h ${(localEditValue.length === 0 && 'mt-3') || ''}`}
                />
            )}
        </div>
    );
};

SharedAutocompleteControl.propTypes = {
    errors: PropTypes.instanceOf(Object),
    type: PropTypes.oneOf(Object.values(DynamicFormTypesEnum).map((item) => item.key)),
    onValueChanged: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    stateKey: PropTypes.string.isRequired,
    title: PropTypes.string,
    parentId: PropTypes.string,
    subParentId: PropTypes.string,
    parentIndex: PropTypes.number,
    subParentIndex: PropTypes.number,
    max: PropTypes.number,
    errorPath: PropTypes.string,
    helper_name: PropTypes.oneOf(
        Object.values(DynamicFormHelpersEnum).map((item) => item.key),
    ),
    initValues: PropTypes.instanceOf(Array),
    editValue: PropTypes.oneOfType([
        PropTypes.instanceOf(Array),
        PropTypes.instanceOf(Object),
        PropTypes.string,
    ]),
    initValuesKey: PropTypes.string,
    initValuesTitle: PropTypes.string,
    isSubmitted: PropTypes.bool,
    isRequired: PropTypes.bool,
    isHalfWidth: PropTypes.bool,
    isQuarterWidth: PropTypes.bool,
    idRef: PropTypes.string,
    parentTranslationPath: PropTypes.string,
    translationPath: PropTypes.string,
};

SharedAutocompleteControl.defaultProps = {
    idRef: 'SharedAutocompleteControl',
    editValue: null,
    title: undefined,
    type: DynamicFormTypesEnum.select.key,
    initValues: undefined,
    errors: {},
    isSubmitted: undefined,
    isRequired: undefined,
    helper_name: undefined,
    initValuesKey: 'key',
    initValuesTitle: 'value',
    parentId: undefined,
    subParentId: undefined,
    parentIndex: undefined,
    subParentIndex: undefined,
    max: undefined,
    errorPath: undefined,
    isHalfWidth: undefined,
    isQuarterWidth: undefined,
    parentTranslationPath: undefined,
    translationPath: undefined,
};

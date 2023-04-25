/**
 * @author Manaf Hijazi (manafhijazii@gmail.com)
 */
import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import {GlobalInputDelay} from '../../Helpers';
import './SharedControls.Style.scss';
import {Inputs} from "../Inputs/Inputs.Component";

export const SharedInputControl = ({
    editValue,
    onValueChanged,
    stateKey,
    parentId,
    subParentId,
    parentIndex,
    subParentIndex,
    multiple,
    rows,
    isDisabled,
    isRequired,
    idRef,
    title,
    labelValue,
    placeholder,
    errors,
    errorPath,
    type,
    isSubmitted,
    isHalfWidth,
    isQuarterWidth,
    endAdornment,
    startAdornment,
    parentTranslationPath,
    translationPath,
    clearLocalValue
}) => {
    const [localValue, setLocalValue] = useState('');
    const timerRef = useRef(null);

    // this to update localValue on parent changed
    useEffect(() => {
        if (!timerRef.current)
            setLocalValue(editValue || editValue === 0 ? editValue : '');
    }, [editValue]);

    // this to clear localValue on parent request
    useEffect(() => {
        setLocalValue('');
    }, [clearLocalValue]);

    // to prevent memory leak if component destroyed before time finish
    useEffect(
        () => () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        },
        [],
    );

    return (
        <div
            className={`shared-input-wrapper${(isHalfWidth && ' is-half-width') || ''}${
                (isQuarterWidth && ' is-quarter-width') || ''
            } shared-control-wrapper`}
        >
            <Inputs
                idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
                    subParentId || ''
                }-${subParentIndex || 0}-${stateKey}`}
                value={localValue}
                themeClass="theme-solid"
                isDisabled={isDisabled}
                label={title}
                labelValue={labelValue}
                multiple={multiple}
                rows={rows}
                inputPlaceholder={placeholder || title || labelValue}
                type={type}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                error={
                    (errorPath && errors[errorPath] && errors[errorPath].error) || undefined
                }
                helperText={
                    (errorPath && errors[errorPath] && errors[errorPath].message) || undefined
                }
                isRequired={isRequired}
                isSubmitted={isSubmitted}
                endAdornment={endAdornment}
                startAdornment={startAdornment}
                onInputBlur={(event) => {
                    const {value} = event.target;
                    if (onValueChanged)
                        if (timerRef.current) {
                            clearTimeout(timerRef.current);
                            timerRef.current = null;
                            onValueChanged({
                                parentId,
                                parentIndex,
                                subParentId,
                                subParentIndex,
                                id: stateKey,
                                value: value || null,
                            });
                        }
                }}
                onInputChanged={(event) => {
                    const {value} = event.target;
                    setLocalValue(value);
                    if (onValueChanged) {
                        if (timerRef.current) clearTimeout(timerRef.current);
                        timerRef.current = setTimeout(() => {
                            timerRef.current = null;
                            onValueChanged({
                                parentId,
                                parentIndex,
                                subParentId,
                                subParentIndex,
                                id: stateKey,
                                value: value || null,
                            });
                        }, GlobalInputDelay);
                    }
                }}
            />
        </div>
    );
};

SharedInputControl.propTypes = {
    editValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onValueChanged: PropTypes.func,
    stateKey: PropTypes.string.isRequired,
    parentId: PropTypes.string,
    subParentId: PropTypes.string,
    parentIndex: PropTypes.number,
    subParentIndex: PropTypes.number,
    idRef: PropTypes.string,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    clearLocalValue: PropTypes.bool,
    title: PropTypes.string,
    labelValue: PropTypes.string,
    endAdornment: PropTypes.node,
    startAdornment: PropTypes.node,
    placeholder: PropTypes.string,
    errors: PropTypes.instanceOf(Object),
    errorPath: PropTypes.string,
    type: PropTypes.string,
    isSubmitted: PropTypes.bool,
    isHalfWidth: PropTypes.bool,
    isQuarterWidth: PropTypes.bool,
    multiple: PropTypes.bool,
    rows: PropTypes.number,
    parentTranslationPath: PropTypes.string.isRequired,
    translationPath: PropTypes.string,
};

SharedInputControl.defaultProps = {
    editValue: null,
    clearLocalValue: false,
    onValueChanged: undefined,
    errors: {},
    errorPath: undefined,
    isSubmitted: undefined,
    isDisabled: undefined,
    placeholder: undefined,
    labelValue: undefined,
    title: undefined,
    parentIndex: undefined,
    subParentIndex: undefined,
    subParentId: undefined,
    parentId: undefined,
    type: undefined,
    isRequired: undefined,
    isHalfWidth: undefined,
    isQuarterWidth: undefined,
    endAdornment: undefined,
    startAdornment: undefined,
    multiple: undefined,
    rows: undefined,
    translationPath: '',
    idRef: 'SharedInputControlRef',
};

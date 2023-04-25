/* eslint-disable react/jsx-no-duplicate-props */
import React, { useCallback, useEffect, useState, memo } from 'react';
import PropTypes from 'prop-types';
import { FormControl, TextField, CircularProgress, ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import './Inputs.Style.scss';

export const Inputs = memo(
  ({
    autoFocus,
    value,
    isRequired,
    isDisabled,
    idRef,
    onInputChanged,
    fieldClasses,
    wrapperClasses,
    labelClasses,
    translationPath,
    parentTranslationPath,
    labelValue,
    error,
    helperText,
    withLoader,
    autoCompleteParams,
    isLoading,
    variant,
    label,
    inputPlaceholder,
    rows,
    multiline,
    type,
    onInputBlur,
    onKeyUp,
    onKeyDown,
    buttonOptions,
    max,
    maxLength,
    min,
    minLength,
    step,
    endAdornment,
    startAdornment,
    beforeIconClasses,
    afterIconClasses,
    multiple,
    refs,
    inputRef,
    isSubmitted,
    overInputText,
    paddingReverse,
    overInputIcon,
    themeClass,
    defaultValue,
    charactersCounterClasses,
    isWithCharactersCounter,
    onInputFocus,
    onInputClick,
    autoComplete,
    maxNumber,
    maxLabel,
    maxLabelClasses,
    onAdornmentsChanged,
    pattern,
    tabIndex,
  }) => {
    const [isBlurOrChanged, setIsBlurOrChanged] = useState(false);
    const { t } = useTranslation(parentTranslationPath);
    /**
     * @author Manaf Hijazi (manafhijazii@gmail.com)
     * @Description method to call onAdornmentsChanged to make parent know that
     * adornments changed
     */
    const onAdornmentsChangedHandler = useCallback(() => {
      onAdornmentsChanged();
    }, [onAdornmentsChanged]);

    useEffect(() => {
      setIsBlurOrChanged(false);
    }, [isSubmitted]);

    useEffect(() => {
      if ((endAdornment || startAdornment) && onAdornmentsChanged) onAdornmentsChangedHandler();
    }, [endAdornment, onAdornmentsChanged, onAdornmentsChangedHandler, startAdornment]);

    return (
      <FormControl
        className={`input-wrapper ${wrapperClasses}${
          (startAdornment && ' with-start-andorment') || ''
        } ${themeClass}`}
        ref={refs}>
        {(labelValue || maxNumber !== undefined) && (
          <div className='labels-wrapper'>
            {labelValue && (
              <label
                htmlFor={idRef}
                className={`label-wrapper ${labelClasses}${isDisabled ? ' disabled' : ''}`}>
                {labelValue}
              </label>
            )}
            {maxNumber !== undefined && (
              <label
                htmlFor={idRef}
                className={`max-label-wrapper ${maxLabelClasses || ''}${
                  isDisabled ? ' disabled' : ''
                }`}>
                <span>{t(`Shared:${maxLabel}`)}</span>
                <span className='px-1'>{maxNumber}</span>
              </label>
            )}
          </div>
        )}
        <div
          className={`w-100 p-relative ${
            (isWithCharactersCounter && 'd-flex flex-wrap') || 'd-flex-center'
          }`}>
          {beforeIconClasses && (
            <span className={`before-icon-classes-wrapper ${beforeIconClasses}`} />
          )}
          {(overInputText || overInputIcon) && (
            <span className='over-input-wrapper'>
              {overInputIcon && <span className={overInputIcon} />}
              {overInputText && t(`${translationPath}${overInputText}`)}
            </span>
          )}
          <div className='text-field-wrapper'>
            <TextField
              {...autoCompleteParams}
              autoFocus={autoFocus}
              autoComplete={autoComplete}
              required={isRequired}
              ref={inputRef}
              disabled={isDisabled}
              className={`inputs ${fieldClasses}`}
              style={
                (i18next.dir() === 'rtl' && {
                  paddingRight: paddingReverse,
                }) || {
                  paddingLeft: paddingReverse,
                }
              }
              id={idRef}
              onFocus={onInputFocus}
              label={label && t(`${translationPath}${label}`)}
              placeholder={inputPlaceholder && t(`${translationPath}${inputPlaceholder}`)}
              variant={variant}
              helperText={(helperText && isSubmitted && error && helperText) || undefined}
              value={value}
              defaultValue={defaultValue}
              error={(isSubmitted && error) || false}
              rows={rows}
              onClick={onInputClick}
              onKeyUp={onKeyUp}
              onKeyDown={onKeyDown}
              type={type}
              multiline={multiline}
              onChange={
                ((onInputChanged || error) &&
                  ((event) => {
                    if (!isBlurOrChanged) setIsBlurOrChanged(true);
                    if (onInputChanged) {
                      const localValue = event.target.value;
                      if (pattern && localValue && !pattern.test(localValue)) return;
                      onInputChanged(event);
                    }
                  })) ||
                undefined
              }
              onBlur={(event) => {
                if (!isBlurOrChanged) setIsBlurOrChanged(true);
                if (onInputBlur) {
                  const localValue = event.target.value;
                  if (pattern && localValue && !pattern.test(localValue)) return;
                  onInputBlur(event);
                }
              }}
              inputProps={{
                max,
                maxLength,
                min,
                minLength,
                step,
                multiple,
                tabIndex,
                ...autoCompleteParams.inputProps,
              }}
              InputProps={{
                ...autoCompleteParams.InputProps,
                endAdornment:
                  (withLoader && isLoading && !endAdornment && (
                    <div className='input-loading-wrapper'>
                      <CircularProgress color='inherit' size={20} />
                    </div>
                  )) ||
                  endAdornment ||
                  (autoCompleteParams.InputProps && autoCompleteParams.InputProps.endAdornment) ||
                  undefined,
                startAdornment:
                  startAdornment ||
                  (autoCompleteParams.InputProps && autoCompleteParams.InputProps.startAdornment) ||
                  undefined,
              }}
            />
            {afterIconClasses && (
              <span className={`after-icon-classes-wrapper ${afterIconClasses}`} />
            )}
            {buttonOptions && (
              <ButtonBase
                className={`ml-2-reversed mt-1 ${buttonOptions.className}`}
                onClick={buttonOptions.onActionClicked}
                disabled={buttonOptions.isDisabled}>
                <span className={buttonOptions.iconClasses} />
              </ButtonBase>
            )}
          </div>
          {isWithCharactersCounter && (
            <div className={`characters-counter-wrapper ${charactersCounterClasses}`}>
              <span>{(value && value.length) || (defaultValue && defaultValue.length) || 0}</span>
              <span className='px-1'>{t('Shared:characters')}</span>
            </div>
          )}
        </div>
      </FormControl>
    );
  }
);

Inputs.displayName = 'InputsComponent';

Inputs.propTypes = {
  value: PropTypes.oneOfType([PropTypes.any]),
  defaultValue: PropTypes.oneOfType([PropTypes.any]),
  startAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  endAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  onInputChanged: PropTypes.func,
  onInputBlur: PropTypes.func,
  onKeyUp: PropTypes.func,
  onKeyDown: PropTypes.func,
  idRef: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  max: PropTypes.number,
  maxLength: PropTypes.number,
  min: PropTypes.number,
  minLength: PropTypes.number,
  step: PropTypes.number,
  error: PropTypes.bool,
  isLoading: PropTypes.bool,
  withLoader: PropTypes.bool,
  multiline: PropTypes.bool,
  fieldClasses: PropTypes.string,
  autoCompleteParams: PropTypes.instanceOf(Object),
  wrapperClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  labelValue: PropTypes.string,
  pattern: PropTypes.instanceOf(RegExp),
  helperText: PropTypes.string,
  variant: PropTypes.string,
  label: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  type: PropTypes.string,
  rows: PropTypes.number,
  beforeIconClasses: PropTypes.string,
  afterIconClasses: PropTypes.string,
  multiple: PropTypes.bool,
  refs: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  isSubmitted: PropTypes.bool,
  overInputText: PropTypes.string,
  paddingReverse: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  overInputIcon: PropTypes.string,
  themeClass: PropTypes.oneOf([
    'theme-primary',
    'theme-default',
    'theme-solid',
    'theme-solid-v2',
    'theme-solid-v3',
    'theme-dark',
    'theme-outline',
    'theme-underline',
    'theme-underline-light',
    'theme-default-dark',
    'theme-transparent',
    'theme-filled',
  ]),
  charactersCounterClasses: PropTypes.string,
  autoComplete: PropTypes.string,
  isWithCharactersCounter: PropTypes.bool,
  onInputFocus: PropTypes.func,
  onInputClick: PropTypes.func,
  maxNumber: PropTypes.number,
  maxLabel: PropTypes.string,
  maxLabelClasses: PropTypes.string,
  tabIndex: PropTypes.number,
  onAdornmentsChanged: PropTypes.func,
  buttonOptions: PropTypes.shape({
    className: PropTypes.string,
    iconClasses: PropTypes.string,
    onActionClicked: PropTypes.func,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
  }),
};
Inputs.defaultProps = {
  defaultValue: undefined,
  onInputChanged: undefined,
  onInputBlur: undefined,
  onKeyUp: undefined,
  onKeyDown: undefined,
  max: undefined,
  maxLength: undefined,
  min: undefined,
  minLength: undefined,
  tabIndex: undefined,
  step: undefined,
  value: undefined,
  beforeIconClasses: undefined,
  afterIconClasses: undefined,
  pattern: undefined,
  isSubmitted: false,
  autoFocus: false,
  overInputText: undefined,
  paddingReverse: undefined,
  overInputIcon: undefined,
  themeClass: 'theme-solid',
  multiple: false,
  refs: undefined,
  inputRef: undefined,
  isRequired: false,
  isDisabled: false,
  error: false,
  multiline: false,
  isWithCharactersCounter: false,
  fieldClasses: '', // inputs theme-underline
  labelClasses: '',
  wrapperClasses: '',
  charactersCounterClasses: '',
  translationPath: '',
  parentTranslationPath: '',
  variant: 'standard',
  labelValue: null,
  label: null,
  inputPlaceholder: null,
  helperText: '',
  withLoader: false,
  isLoading: false,
  type: 'text',
  rows: 1,
  autoComplete: undefined,
  startAdornment: null,
  endAdornment: null,
  buttonOptions: null,
  onInputFocus: undefined,
  onInputClick: undefined,
  onAdornmentsChanged: undefined,
  maxNumber: undefined,
  maxLabelClasses: undefined,
  maxLabel: 'max',
  autoCompleteParams: {},
};

import React, { useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';
import { FormHelperText, CircularProgress } from '@mui/material';
import { CheckboxesComponent } from '../Checkboxes/Checkboxes.Component';
import './Select.Style.scss';

export const SelectComponent = ({
  data,
  onSelectChanged,
  wrapperClasses,
  menuClasses,
  defaultValue,
  keyValue,
  textInput,
  value,
  valueInput,
  emptyItem,
  selectAllItem,
  keyLoopBy,
  isRequired,
  idRef,
  labelClasses,
  labelValue,
  variant,
  multiple,
  error,
  helperText,
  isWithError,
  onSelectBlur,
  isSubmitted,
  isOpen,
  onOpen,
  onClose,
  overInputText,
  overInputTextIcon,
  placeholder,
  dropdownIcon,
  getIsChecked,
  getIsIndeterminate,
  isWithCheckAll,
  singleChecked,
  singleIndeterminate,
  renderValue,
  isDisabled,
  startAdornment,
  endAdornment,
  themeClass,
  isLoading,
}) => {
  const [isBlurOrChanged, setIsBlurOrChanged] = useState(false);

  return (
    <FormControl
      className={`select-wrapper ${wrapperClasses} ${themeClass}${
        (startAdornment && ' with-start-andorment') || ''
      }${value && (!emptyItem || value !== emptyItem.value) ? ' select-filled' : ''}${
        ((overInputText || overInputTextIcon) && ' over-input-text-wrapper') || ''
      }`}>
      {labelValue && (
        <div className='labels-wrapper'>
          {labelValue && (
            <label
              htmlFor={idRef}
              className={`label-wrapper ${labelClasses}${isDisabled ? ' disabled' : ''}`}>
              {labelValue}
            </label>
          )}
        </div>
      )}
      <div className='select-body-wrapper'>
        {(overInputText || overInputTextIcon) && (
          <span className='over-input-text'>
            {overInputTextIcon && <span className={overInputTextIcon} />}
            {overInputText || ''}
          </span>
        )}
        <Select
          labelId={`${idRef}-label`}
          id={idRef}
          value={value}
          disabled={isDisabled}
          open={isOpen}
          onOpen={onOpen}
          placeholder={placeholder || undefined}
          label={placeholder}
          onClose={onClose}
          multiple={multiple}
          defaultValue={defaultValue}
          onChange={
            ((onSelectChanged || isWithError) &&
              ((event) => {
                if (!isBlurOrChanged) setIsBlurOrChanged(true);
                if (onSelectChanged) onSelectChanged(event.target.value);
              })) ||
            undefined
          }
          renderValue={renderValue}
          className='selects'
          onBlur={(event) => {
            setIsBlurOrChanged(true);
            if (onSelectBlur) onSelectBlur(event);
          }}
          error={
            (isWithError && (isBlurOrChanged || isSubmitted) && error) ||
            (!isWithError && !isBlurOrChanged && error)
          }
          startAdornment={startAdornment}
          endAdornment={
            (isLoading && !endAdornment && <CircularProgress color='inherit' size={20} />) ||
            endAdornment
          }
          MenuProps={{
            className: `select-menu-wrapper ${menuClasses} ${themeClass}`,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          displayEmpty
          required={isRequired}
          variant={variant}
          IconComponent={() => (
            <span
              className={`${dropdownIcon} dropdown-icon-wrapper${
                ((endAdornment || isLoading) && ' is-with-end-adornment') || ''
              }`}
            />
          )}
          inputProps={{ readOnly: false }}>
          {emptyItem && (
            <MenuItem
              style={emptyItem.isHiddenOnOpen ? { display: 'none' } : {}}
              value={emptyItem.value}
              disabled={emptyItem.isDisabled}>
              {emptyItem.text}
            </MenuItem>
          )}
          {selectAllItem && (
            <MenuItem
              style={selectAllItem.isHiddenOnOpen ? { display: 'none' } : {}}
              value={selectAllItem.value}
              disabled={selectAllItem.isDisabled}>
              {isWithCheckAll && (
                <CheckboxesComponent
                  idRef={`${idRef}allCheckbox`}
                  singleChecked={singleChecked}
                  singleIndeterminate={singleIndeterminate}
                />
              )}
              {selectAllItem.text || ''}
            </MenuItem>
          )}
          {data.map((item, index) => (
            <MenuItem
              style={item.isHiddenOnOpen ? { display: 'none' } : {}}
              value={valueInput ? item[valueInput] : item}
              key={keyLoopBy && keyValue ? keyValue + item[keyLoopBy] : `selection${index + 1}`}>
              {getIsChecked && (
                <CheckboxesComponent
                  idRef={`${idRef}Checkbox${index + 1}`}
                  singleChecked={(getIsChecked && getIsChecked(item)) || false}
                  singleIndeterminate={(getIsIndeterminate && getIsIndeterminate(item)) || false}
                />
              )}
              <span className='menu-item-first-char'>
                {`${(textInput ? item[textInput] : item).slice(0, 1)}`}
              </span>
              <span className='menu-item-text'>
                {`${(textInput ? item[textInput] : item).slice(1)}`}
              </span>
            </MenuItem>
          ))}
        </Select>
      </div>
      {helperText &&
        ((isWithError && (isBlurOrChanged || isSubmitted) && error && (
          <FormHelperText>{helperText}</FormHelperText>
        )) ||
          (!isWithError && <FormHelperText>{helperText || ''}</FormHelperText>))}
    </FormControl>
  );
};
SelectComponent.propTypes = {
  data: PropTypes.instanceOf(Array).isRequired,
  value: PropTypes.oneOfType([PropTypes.any]),
  isRequired: PropTypes.bool,
  multiple: PropTypes.bool,
  onSelectChanged: PropTypes.func.isRequired,
  emptyItem: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    text: PropTypes.string,
    isDisabled: PropTypes.bool,
    isHiddenOnOpen: PropTypes.bool,
  }),
  selectAllItem: PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    text: PropTypes.string,
    isDisabled: PropTypes.bool,
    isHiddenOnOpen: PropTypes.bool,
  }),
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathForData: PropTypes.string,
  themeClass: PropTypes.oneOf([
    'theme-default',
    'theme-solid',
    'theme-underline',
    'theme-transparent',
    'theme-action-buttons',
  ]),
  wrapperClasses: PropTypes.string,
  menuClasses: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.any]),
  valueInput: PropTypes.string,
  textInput: PropTypes.string,
  keyValue: PropTypes.string,
  keyLoopBy: PropTypes.string,
  idRef: PropTypes.string,
  labelClasses: PropTypes.string,
  labelValue: PropTypes.string,
  placeholder: PropTypes.string,
  variant: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  paddingReverse: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  overInputText: PropTypes.string,
  overInputTextIcon: PropTypes.string,
  dropdownIcon: PropTypes.string,
  startAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  endAdornment: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  isWithError: PropTypes.bool,
  onSelectBlur: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  isSubmitted: PropTypes.bool,
  isLoading: PropTypes.bool,
  isOpen: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isWithCheckAll: PropTypes.bool,
  singleChecked: PropTypes.bool,
  singleIndeterminate: PropTypes.bool,
  getIsChecked: PropTypes.func,
  getIsIndeterminate: PropTypes.func,
  renderValue: PropTypes.func,
};
SelectComponent.defaultProps = {
  isRequired: false,
  multiple: false,
  emptyItem: undefined,
  selectAllItem: undefined,
  translationPath: '',
  parentTranslationPath: '',
  translationPathForData: '',
  themeClass: 'theme-default',
  wrapperClasses: '',
  menuClasses: '',
  placeholder: undefined,
  textInput: undefined,
  defaultValue: undefined,
  startAdornment: undefined,
  endAdornment: undefined,
  dropdownIcon: 'mdi mdi-chevron-down',
  value: undefined,
  valueInput: undefined,
  keyValue: null,
  keyLoopBy: null,
  idRef: 'selectRef',
  labelClasses: '',
  labelValue: undefined,
  variant: 'standard',
  error: undefined,
  helperText: undefined,
  paddingReverse: undefined,
  overInputText: undefined,
  isWithError: undefined,
  isLoading: false,
  onSelectBlur: undefined,
  isSubmitted: undefined,
  isOpen: undefined,
  onOpen: undefined,
  onClose: undefined,
  isDisabled: undefined,
  overInputTextIcon: undefined,
  getIsChecked: undefined,
  getIsIndeterminate: undefined,
  isWithCheckAll: undefined,
  singleChecked: undefined,
  singleIndeterminate: undefined,
  renderValue: undefined,
};

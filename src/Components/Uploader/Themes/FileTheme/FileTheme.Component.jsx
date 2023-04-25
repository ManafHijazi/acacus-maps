import React, { memo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../Inputs/Inputs.Component';
import './FileTheme.Style.scss';

export const FileThemeComponent = memo(
  ({
    label,
    idRef,
    allFiles,
    uploadRef,
    isDragOver,
    isDisabled,
    helperText,
    isSubmitted,
    dropHereText,
    inputThemeClass,
    translationPath,
    inputPlaceholder,
    parentTranslationPath,
    translationPathShared,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [endAdornmentWidth, setEndAdornmentWidth] = useState(120);
    const endAdornmentRef = useRef(null);

    /**
     * @Description method to rerender on bind end or start adornments to re-calc width
     */
    const onAdornmentsChanged = () => {
      if (endAdornmentWidth !== endAdornmentRef.current?.offsetWidth)
        setEndAdornmentWidth(endAdornmentRef.current?.offsetWidth || 120);
    };

    return (
      <div className={`file-theme-component-wrapper ${(isDragOver && 'drag-over') || ''}`}>
        <Inputs
          value=''
          labelValue={label}
          helperText={helperText}
          isSubmitted={isSubmitted}
          themeClass={inputThemeClass}
          inputPlaceholder={inputPlaceholder}
          idRef={`themeFileUploaderRef${idRef}`}
          error={helperText && helperText.length > 0}
          translationPath={
            translationPath || (translationPath !== '' && translationPathShared) || ''
          }
          parentTranslationPath={parentTranslationPath}
          startAdornment={
            <div className='file-end-adornment-wrapper' ref={endAdornmentRef}>
              <ButtonBase
                disabled={isDisabled}
                className='btns theme-solid theme-short bg-primary pr-3'
                id={`themeFileUploadPhotpBtnRef${idRef}`}
                onClick={() => uploadRef.current.click()}>
                <span className='mdi mdi-tray-arrow-up mx-1' />
                Upload
              </ButtonBase>

              <div className='file-chip-input'>
                {allFiles &&
                  allFiles.map((item, index) => (
                    <Chip
                      label={item.name}
                      variant='outlined'
                      key={`${index + 1}-${item.name}-file-item`}
                    />
                  ))}
              </div>
            </div>
          }
          onAdornmentsChanged={onAdornmentsChanged}
        />

        <div className='custom-dropzone-wrapper'>
          {(allFiles.length === 0 || isDragOver) && (
            <div
              className={`drop-here${(allFiles.length > 0 && ' as-overlay') || ''}`}
              style={{
                maxWidth: `calc(100% - ${endAdornmentWidth}px)`,
              }}>
              {t(`${translationPathShared}${dropHereText}`)}
            </div>
          )}
        </div>
      </div>
    );
  }
);

FileThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array),
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  dropHereText: PropTypes.string.isRequired,
  multiple: PropTypes.bool.isRequired,
  allFilesDeleteHandler: PropTypes.func,
  fileItemDeleteDisabledHandler: PropTypes.func,
  helperText: PropTypes.string,
  uploaderBtnText: PropTypes.string,
  fileDeleted: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isDisabledDelete: PropTypes.bool,
  isAlternativeOpen: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
  translationPath: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  label: PropTypes.string,
  inputThemeClass: PropTypes.string,
  localProfilePicture: PropTypes.string,
  setLocalProfilePicture: PropTypes.func,
};
FileThemeComponent.defaultProps = {
  allFiles: [],
  parentTranslationPath: '',
  localProfilePicture: '',
  setLocalProfilePicture: () => {},
  isDisabled: false,
  isDisabledDelete: false,
  isSubmitted: false,
  isAlternativeOpen: false,
  allFilesDeleteHandler: undefined,
  fileItemDeleteDisabledHandler: undefined,
  helperText: undefined,
  uploaderBtnText: undefined,
  translationPath: undefined,
  inputPlaceholder: undefined,
  label: undefined,
  inputThemeClass: undefined,
};

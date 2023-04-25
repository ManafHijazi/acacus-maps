import React, { memo, useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase, Avatar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Inputs } from '../../../Inputs/Inputs.Component';
import './InputTheme.Style.scss';

export const InputThemeComponent = memo(
  ({
    allFiles,
    uploadRef,
    isDragOver,
    parentTranslationPath,
    translationPathShared,
    translationPath,
    inputPlaceholder,
    label,
    dropHereText,
    idRef,
    isDisabled,
    isSubmitted,
    helperText,
    inputThemeClass,
    uploaderTheme,
    localProfilePicture,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const endAdornmentRef = useRef(null);
    const [endAdornmentWidth, setEndAdornmentWidth] = useState(120);
    const [localPicture, setLocalPicture] = useState(null);

    /**
     * @Description method to rerender on bind end or start adornments to re-calc width
     */
    const onAdornmentsChanged = () => {
      if (endAdornmentWidth !== endAdornmentRef.current?.offsetWidth)
        setEndAdornmentWidth(endAdornmentRef.current?.offsetWidth || 120);
    };

    useEffect(() => {
      if (allFiles && allFiles[0]) setLocalPicture(URL.createObjectURL(allFiles[0].file));
    }, [allFiles]);

    return (
      <div className={`input-theme-component-wrapper${(isDragOver && ' drag-over') || ''}`}>
        {uploaderTheme !== 'menu_upload' && (
          <Inputs
            idRef={`themeInputUploaderRef${idRef}`}
            label={label}
            inputPlaceholder={inputPlaceholder}
            error={helperText && helperText.length > 0}
            helperText={helperText}
            isSubmitted={isSubmitted}
            translationPath={
              translationPath || (translationPath !== '' && translationPathShared) || ''
            }
            value=''
            themeClass={inputThemeClass}
            parentTranslationPath={parentTranslationPath}
            startAdornment={
              <div className='end-adornment-wrapper' ref={endAdornmentRef}>
                <ButtonBase
                  id={`themeInputUploadPhotpBtnRef${idRef}`}
                  className='btns theme-solid bg-primary pr-3'
                  onClick={() => uploadRef.current.click()}
                  disabled={isDisabled}>
                  <span className='mdi mdi-camera mx-1' />
                  Upload Photo
                </ButtonBase>
              </div>
            }
            endAdornment={
              uploaderTheme !== 'menu_upload' && (
                <Avatar
                  className='avatars-wrapper theme-upload uploader-avatar-wrapper'
                  src={localPicture || localProfilePicture}
                />
              )
            }
            onAdornmentsChanged={onAdornmentsChanged}
          />
        )}

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

InputThemeComponent.propTypes = {
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
InputThemeComponent.defaultProps = {
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

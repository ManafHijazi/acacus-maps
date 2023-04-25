import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import uploadIcon from '../../../../Assets/icons/Uploadicon.png';
// import { LoadableImageComponant } from 'Components/LoadableImage/LoadableImage.Componant';
import './BoxTheme.Style.scss';

export const BoxThemeComponent = memo(
  ({
    allFiles,
    accept,
    defaultImage,
    uploadRef,
    isDragOver,
    dropHereText,
    fileDeleted,
    onOpenGalleryHandler,
    fileItemDeleteDisabledHandler,
    onDownloadHandler,
    idRef,
    isDisabled,
    isDisabledDelete,
    isSubmitted,
    helperText,
  }) => {
    /**
     * Method to send open gallery handler to parent with the activate index
     * @param index
     * */
    const openGalleryClicked = useCallback(
      (index) => () => {
        if (onOpenGalleryHandler) onOpenGalleryHandler(index);
      },
      [onOpenGalleryHandler],
    );

    /**
     * Method to send download to parent with the activate index
     * @param file
     * */
    const onDownloadClicked = useCallback(
      (file) => (event) => {
        if (!file && (file.status === 'uploading' || file.status === 'failed')) return;
        if (onDownloadHandler) onDownloadHandler(file, event);
      },
      [onDownloadHandler],
    );

    return (
      <div className={`box-theme-component-wrapper${(isDragOver && ' drag-over') || ''}`}>
        <div className='custom-dropzone-wrapper'>
          <div className='dropzone-items-wrapper'>
            <div className='dropzone-item-wrapper'>
              <img src={uploadIcon} alt='upload icon' />
              <div className='dropzone-title'>
                Drag & drop files or
                <span>
                  <ButtonBase
                    id='themeBoxUploaderBrowseBtnId'
                    onClick={() => uploadRef.current.click()}
                    disabled={isDisabled}
                  >
                    Browse
                  </ButtonBase>
                </span>
              </div>
              <div className='dropzone-subtitle'>
                Supported formates: {`${accept === '.zip' ? 'Zip' : 'CSV'}`}
              </div>
              <div className='dropzone-footer'>
                <span className='mdi mdi-clock-outline mr-2' />
                {`${
                  accept === '.zip'
                    ? 'Upload one file only.'
                    : 'Uploading Meta data and historical data files again will replace the old file from the system'
                }`}
              </div>
            </div>
            {/* {allFiles &&
              allFiles.map((file, index) => (
                <div key={`${idRef}${index + 1}`} className='dropzone-item-wrapper'>
                  {file && file.status === 'failed' && (
                    <div className='failed-wrapper' title='Failed'>
                      <span className='fas fa-times' />
                    </div>
                  )}
                  {file && file.status !== 'uploading' && (
                    <LoadableImageComponant
                      src={URL.createObjectURL(file.file) || defaultImage || undefined}
                      classes='box-theme-image'
                      alt={file.name || undefined}
                    />
                  )}
                  {file && file.status === 'uploading' && (
                    <div className='as-overlay-spinner'>
                      <span className='fas fa-spinner fa-spin' />
                    </div>
                  )}
                  {file &&
                    file.status !== 'uploading' &&
                    (onOpenGalleryHandler || onDownloadHandler) && (
                      <div className='over-item-actions-wrapper'>
                        {onDownloadHandler && (
                          <ButtonBase
                            className='btns-icon theme-transparent download-btn'
                            onClick={onDownloadClicked(file)}>
                            <span className='fas fa-download' />
                          </ButtonBase>
                        )}
                        {onOpenGalleryHandler && (
                          <ButtonBase
                            className='btns-icon theme-transparent open-gallery-btn'
                            onClick={openGalleryClicked(index)}>
                            <span className='far fa-eye' />
                          </ButtonBase>
                        )}
                        {file && file.status !== 'uploading' && (
                          <ButtonBase
                            className='btns-icon btn-close theme-transparent c-warning'
                            onClick={fileDeleted(file, index)}
                            disabled={
                              (fileItemDeleteDisabledHandler &&
                                fileItemDeleteDisabledHandler(file, index)) ||
                              isDisabledDelete
                            }>
                            <span className='fas fa-times' />
                          </ButtonBase>
                        )}
                      </div>
                    )}
                </div>
              ))} */}
          </div>
          {(!allFiles || allFiles.length === 0) && <div className='drop-here'>{dropHereText}</div>}
          {isSubmitted && helperText && (
            <div className='error-wrapper'>
              <span>{helperText}</span>
            </div>
          )}
        </div>
      </div>
    );
  },
);

BoxThemeComponent.propTypes = {
  allFiles: PropTypes.instanceOf(Array),
  isDragOver: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  translationPathShared: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  dropHereText: PropTypes.string.isRequired,
  uploaderBtnText: PropTypes.string,
  multiple: PropTypes.bool.isRequired,
  onOpenGalleryHandler: PropTypes.func,
  fileItemDeleteDisabledHandler: PropTypes.func,
  onDownloadHandler: PropTypes.func,
  defaultImage: PropTypes.string,
  helperText: PropTypes.string,
  fileDeleted: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  isDisabledDelete: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  uploadRef: PropTypes.instanceOf(Object).isRequired,
};
BoxThemeComponent.defaultProps = {
  allFiles: [],
  parentTranslationPath: '',
  translationPath: undefined,
  isDisabled: false,
  isDisabledDelete: false,
  isSubmitted: false,
  onOpenGalleryHandler: undefined,
  fileItemDeleteDisabledHandler: undefined,
  onDownloadHandler: undefined,
  uploaderBtnText: undefined,
  helperText: undefined,
  defaultImage: undefined,
};

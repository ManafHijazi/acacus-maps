/* eslint-disable implicit-arrow-linebreak */
import React, { useRef, useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { UploaderTypesEnum, UploaderThemesEnum } from '../../enums';
import './Uploader.Style.scss';

export const UploaderComponent = memo(
  ({
    uploadedFiles,
    wrapperClasses,
    uploaderClasses,
    counterClasses,
    inputClasses,
    labelClasses,
    accept,
    multiple,
    translationPath,
    parentTranslationPath,
    translationPathShared,
    uploadedFileChanged,
    onIsUploadingChanged,
    fileItemDeleteDisabledHandler,
    isDisabledDelete,
    titleText,
    labelValue,
    isDisabled,
    idRef,
    isViewUploadedFilesCount,
    dropHereText,
    chipHandler,
    defaultImage,
    isDownloadable,
    maxFileNumber,
    isSubmitted,
    helperText,
    uploaderBtnText,
    inputPlaceholder,
    label,
    uploaderTheme,
    inputThemeClass,
    componentTheme,
    localProfilePicture,
    setLocalProfilePicture,
    isAlternativeOpen,
    setIsAlternativeOpen,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const uploadRef = useRef(null);
    const [allFiles, setAllFiles] = useState([]);
    const [isDragOver, setIsDragOver] = useState(true);

    const uploadHandler = (files) => {
      if (onIsUploadingChanged) onIsUploadingChanged(true);
      uploadedFileChanged(files);
    };

    const dropHandler = (event) => {
      event.preventDefault();
      if (isDisabled || maxFileNumber === allFiles.length) return;
      setIsDragOver(false);
      let filesToUpload = Object.values(event.dataTransfer.files);
      if (accept.includes('image'))
        filesToUpload = filesToUpload.filter((item) => item.type.includes('image'));

      if (filesToUpload.length === 0) return;
      if (filesToUpload.length + allFiles.length > maxFileNumber)
        filesToUpload.length = maxFileNumber - allFiles.length;
      let files = [];
      if (multiple)
        filesToUpload.map((file) => {
          files.push({
            id: allFiles.length + files.length,
            name: file.name,
            size: file.size,
            type: file.type,
            file,
          });
          return undefined;
        });
      else
        files = [
          {
            id: allFiles.length,
            name: filesToUpload[0].name,
            size: filesToUpload[0].size,
            type: filesToUpload[0].type,
            file: filesToUpload[0],
          },
        ];

      setAllFiles((items) => (multiple && items.concat(files)) || files);
      uploadHandler((items) => (multiple && items.concat(files)) || files);
    };

    const fileDeleted = useCallback(
      (item, index) => () => {
        const uploadedFilesIndex = uploadedFiles.findIndex((element) => element.uuid === item.uuid);
        if (uploadedFilesIndex !== -1) {
          const localFiles = [...uploadedFiles];
          localFiles.splice(uploadedFilesIndex, 1);
          if (uploadedFileChanged) uploadedFileChanged(localFiles);
        }
        setAllFiles((items) => {
          items.splice(index, 1);
          return [...items];
        });
      },
      [uploadedFileChanged, uploadedFiles]
    );

    const inputChanged = (event) => {
      if (!event.target.value) return;
      let files = [];
      const localFiles = Object.values(event.target.files);
      if (multiple) {
        if (localFiles.length + allFiles.length > maxFileNumber)
          localFiles.length = maxFileNumber - allFiles.length;
        localFiles.map((file) => {
          files.push({
            id: allFiles.length + files.length,
            name: file.name,
            size: file.size,
            type: file.type,
            file,
          });

          return undefined;
        });
      } else
        files = [
          {
            id: allFiles.length,
            name: event.target.files[0].name,
            size: event.target.files[0].size,
            type: event.target.files[0].type,
            file: event.target.files[0],
          },
        ];

      setAllFiles((items) => (multiple && items.concat(files)) || files);
      uploadHandler((items) => (multiple && items.concat(files)) || files);
      // eslint-disable-next-line no-param-reassign
      event.target.value = null;
    };

    const onDownloadHandler = useCallback((file) => {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.download = file.uuid;
      link.href = file.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, []);

    const allFilesDeleteHandler = () => {
      setAllFiles([]);
    };

    const getUploaderComponent = () => {
      const Component = componentTheme.component;
      const defaultProps = {
        allFiles,
        defaultImage: defaultImage,
        isDragOver,
        parentTranslationPath,
        translationPathShared,
        translationPath,
        fileDeleted,
        allFilesDeleteHandler,
        fileItemDeleteDisabledHandler,
        uploadRef,
        idRef,
        dropHereText,
        counterClasses,
        titleText,
        uploaderBtnText: uploaderBtnText,
        isViewUploadedFilesCount: isViewUploadedFilesCount,
        multiple: multiple,
        accept: accept,
        chipHandler,
        isSubmitted,
        helperText,
        isDisabled: isDisabled || maxFileNumber === allFiles.length,
        isDisabledDelete: isDisabledDelete,
        inputPlaceholder: inputPlaceholder,
        inputThemeClass: inputThemeClass,
        label: label,
        onDownloadHandler: (isDownloadable && onDownloadHandler) || undefined,
        localProfilePicture,
        setLocalProfilePicture,
        uploaderTheme,
        isAlternativeOpen,
        setIsAlternativeOpen,
      };

      return <Component {...defaultProps} />;
    };
    useEffect(() => {
      if (uploadedFiles)
        setAllFiles((items) => {
          let localItems = [...items];
          const newIds = uploadedFiles.filter(
            (item) => localItems.findIndex((element) => item.id === element.id) === -1
          );
          const removedIds = localItems.filter(
            (item) => uploadedFiles.findIndex((element) => item.id === element.id) === -1
          );
          if (newIds.length === 0 && removedIds.length === 0) return items;
          if (removedIds.length > 0)
            removedIds.map((item) => {
              const itemIndex = localItems.findIndex((element) => item.id === element.id);
              if (itemIndex !== -1) localItems.splice(itemIndex, 1);
              return undefined;
            });
          if (newIds.length > 0) localItems = localItems.concat(newIds);
          return localItems;
        });
    }, [uploadedFiles]);

    return (
      <div className={wrapperClasses}>
        {labelValue && (
          <label
            htmlFor={idRef}
            className={`label-wrapper ${labelClasses}${isDisabled ? ' disabled' : ''}`}>
            {t(
              `${
                translationPath || (translationPath === '' && '') || translationPathShared || ''
              }${labelValue}`
            )}
          </label>
        )}
        <input
          ref={uploadRef}
          type='file'
          className={inputClasses}
          multiple={multiple}
          accept={accept}
          onChange={inputChanged}
          max={maxFileNumber}
          disabled={isDisabled || maxFileNumber === allFiles.length}
        />
        <div
          className={uploaderClasses}
          onDragOver={(event) => {
            event.preventDefault();
            if (isDisabled || maxFileNumber === allFiles.length) return;
            if (!isDragOver) setIsDragOver(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={dropHandler}>
          {getUploaderComponent()}
        </div>
      </div>
    );
  }
);

UploaderComponent.displayName = 'UploaderComponent';

UploaderComponent.propTypes = {
  for_account: PropTypes.bool,
  uploadedFiles: PropTypes.instanceOf(Array),
  wrapperClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  labelValue: PropTypes.string,
  uploaderClasses: PropTypes.string,
  idRef: PropTypes.string,
  inputClasses: PropTypes.string,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string,
  accept: PropTypes.oneOfType([PropTypes.string]),
  counterClasses: PropTypes.string,
  titleText: PropTypes.string,
  uploaderTheme: PropTypes.string,
  componentTheme: PropTypes.oneOf(Object.values(UploaderThemesEnum).map((item) => item)),
  type: PropTypes.oneOf(Object.values(UploaderTypesEnum).map((item) => item.key)),
  multiple: PropTypes.bool,
  isWithGalleryPreview: PropTypes.bool,
  isAlternativeOpen: PropTypes.bool,
  defaultImage: PropTypes.string,
  chipHandler: PropTypes.func,
  uploadedFileChanged: PropTypes.func,
  setIsAlternativeOpen: PropTypes.func,
  onIsUploadingChanged: PropTypes.func,
  fileItemDeleteDisabledHandler: PropTypes.func,
  isDisabled: PropTypes.bool,
  isDisabledDelete: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isDownloadable: PropTypes.bool,
  isViewUploadedFilesCount: PropTypes.bool,
  dropHereText: PropTypes.string,
  helperText: PropTypes.string,
  uploaderBtnText: PropTypes.string,
  maxFileNumber: PropTypes.number,
  inputPlaceholder: PropTypes.string,
  label: PropTypes.string,
  inputThemeClass: PropTypes.string,
  localProfilePicture: PropTypes.string,
  setLocalProfilePicture: PropTypes.func,
  isDynamicCheck: PropTypes.bool,
};
UploaderComponent.defaultProps = {
  for_account: false,
  uploadedFiles: [],
  wrapperClasses: 'uploader-wrapper',
  labelClasses: '',
  localProfilePicture: '',
  setLocalProfilePicture: undefined,
  uploaderTheme: '',
  componentTheme: UploaderThemesEnum.Input,
  uploaderClasses: 'uploader-container',
  counterClasses: 'counter-text',
  inputClasses: 'file-input',
  idRef: 'uploaderChipRef',
  translationPath: undefined,
  setIsAlternativeOpen: undefined,
  parentTranslationPath: '',
  translationPathShared: '',
  accept: undefined,
  type: undefined,
  titleText: undefined,
  chipHandler: undefined,
  labelValue: undefined,
  multiple: false,
  isAlternativeOpen: false,
  onIsUploadingChanged: undefined,
  uploadedFileChanged: undefined,
  fileItemDeleteDisabledHandler: undefined,
  defaultImage: undefined,
  helperText: undefined,
  uploaderBtnText: undefined,
  isDisabled: false,
  isDisabledDelete: false,
  isWithGalleryPreview: false,
  isDownloadable: false,
  isViewUploadedFilesCount: false,
  isSubmitted: false,
  maxFileNumber: 100,
  dropHereText: '',
  inputPlaceholder: undefined,
  label: undefined,
  inputThemeClass: undefined,
  isDynamicCheck: undefined,
};

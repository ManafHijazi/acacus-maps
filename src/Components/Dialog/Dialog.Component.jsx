import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ButtonBase,
  CircularProgress,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './Dialog.Style.scss';

export const DialogComponent = ({
  isWithIcon,
  confirmText,
  confirmClasses,
  onConfirmClicked,
  isOpen,
  isUploaderDialog,
  isSaveLoading,
  wrapperClasses,
  titleClasses,
  contentClasses,
  footerClasses,
  closeClasses,
  nextPreviousWrapperClasses,
  previousClasses,
  nextClasses,
  saveCancelWrapperClasses,
  cancelWrapperClasses,
  cancelClasses,
  saveWrapperClasses,
  saveClasses,
  titleTextClasses,
  titleText,
  saveText,
  cancelText,
  closeIsDisabled,
  previousIsDisabled,
  nextIsDisabled,
  cancelIsDisabled,
  saveIsDisabled,
  dialogTitle,
  dialogContent,
  dialogActions,
  onCloseClicked,
  onNextClicked,
  onPreviousClicked,
  onCancelClicked,
  onSaveClicked,
  onSubmit,
  translationPath,
  parentTranslationPath,
  translationPathShared,
  maxWidth,
  defaultMaxWidth,
  defaultConfirmMaxWidth,
  saveType,
  nextType,
  cancelType,
  previousType,
  isSaving,
  isConfirm,
  isWithoutConfirmClasses,
  isEdit,
  isOldTheme,
  minHeight,
  scroll,
  dialogFormId,
  dialogPaperProps,
  dialogPaperStyle,
  isFixedHeight,
  saveIdRef,
  cancelIdRef,
}) => {
  const { t } = useTranslation([parentTranslationPath, 'Shared']);

  return (
    <Dialog
      className={`dialog-wrapper ${wrapperClasses}${(isOldTheme && ' is-old-theme') || ''}`}
      onClose={onCloseClicked || onCancelClicked}
      open={isOpen}
      scroll={scroll}
      transitionDuration={200}
      PaperProps={
        dialogPaperProps || {
          style: dialogPaperStyle || {
            minHeight: minHeight || (isFixedHeight && '90vh'),
          },
        }
      }
      maxWidth={(isConfirm && !maxWidth && defaultConfirmMaxWidth) || maxWidth || defaultMaxWidth}>
      <form className='w-100' noValidate id={dialogFormId} onSubmit={onSubmit}>
        <DialogTitle
          className={`dialog-title-wrapper ${titleClasses} ${
            (dialogTitle && ' with-custom-title') || ''
          }`}>
          {(!dialogTitle && (isConfirm || titleText) && (
            <span className={`dialog-title-text ${titleTextClasses}`}>
              {(isConfirm && !titleText && t(`${translationPathShared}confirm-message`)) ||
                t(`${translationPath}${titleText}`)}
            </span>
          )) ||
            dialogTitle}
          {onCloseClicked && (
            <ButtonBase
              className={`close-btn-wrapper ${closeClasses}`}
              onClick={onCloseClicked}
              disabled={closeIsDisabled}>
              <span className='mdi mdi-close' />
            </ButtonBase>
          )}
        </DialogTitle>
        <div className='content-and-footer-wrapper'>
          <DialogContent
            style={{ minHeight }}
            className={`dialog-content-wrapper ${contentClasses} ${
              maxWidth === 'xl' ? 'is-large' : ''
            }`}>
            {dialogContent || undefined}
          </DialogContent>
          <DialogActions className={`dialog-footer-wrapper ${footerClasses}`}>
            {dialogActions ||
              ((onNextClicked || onPreviousClicked) && (
                <div className={`next-previous-wrapper ${nextPreviousWrapperClasses}`}>
                  {(onPreviousClicked || previousType === 'submit') && (
                    <ButtonBase
                      className={previousClasses}
                      type={previousType}
                      onClick={onPreviousClicked}
                      disabled={previousIsDisabled}>
                      <span>{t(`${translationPathShared}back`)}</span>
                    </ButtonBase>
                  )}
                  {(onNextClicked || nextType === 'submit') && (
                    <ButtonBase
                      className={nextClasses}
                      type={nextType}
                      onClick={onNextClicked}
                      disabled={nextIsDisabled}>
                      <span>{t(`${translationPathShared}next`)}</span>
                    </ButtonBase>
                  )}
                </div>
              ))}
            {dialogActions ||
              ((onCancelClicked || onSaveClicked) && (
                <>
                  {isUploaderDialog ? (
                    <div className={`save-cancel-wrapper ${saveCancelWrapperClasses}`}>
                      {(onSaveClicked || saveType === 'submit') && (
                        <div className={`save-wrapper ${saveWrapperClasses}`}>
                          <ButtonBase
                            id={saveIdRef}
                            className={`save-btn-wrapper ${saveClasses}${
                              (isConfirm && !isWithoutConfirmClasses && ' bg-danger') || ''
                            }${(isEdit && ' bg-secondary') || ''}`}
                            type={saveType}
                            onClick={onSaveClicked}
                            disabled={saveIsDisabled || isSaving}>
                            {isWithIcon && <span className='mdi mdi-camera mx-1' />}
                            <span>
                              {(isConfirm &&
                                saveText === 'save' &&
                                t(`${translationPathShared}confirm`)) ||
                                t(
                                  `${
                                    (saveText === 'save' && translationPathShared) ||
                                    translationPath
                                  }${saveText}`
                                )}
                            </span>
                          </ButtonBase>
                        </div>
                      )}
                      {onConfirmClicked && (
                        <div className={`cancel-wrapper ${cancelWrapperClasses}`}>
                          <ButtonBase
                            id={saveIdRef}
                            className={`cancel-btn-wrapper ${confirmClasses}`}
                            type={cancelType}
                            onClick={onConfirmClicked}
                            disabled={cancelIsDisabled}>
                            <span>{confirmText}</span>
                          </ButtonBase>
                        </div>
                      )}
                      {onCancelClicked && (
                        <div className={`cancel-wrapper ${cancelWrapperClasses}`}>
                          <ButtonBase
                            id={cancelIdRef}
                            className={`cancel-btn-wrapper ${cancelClasses}`}
                            type={cancelType}
                            onClick={onCancelClicked}
                            disabled={cancelIsDisabled}>
                            <span>{cancelText}</span>
                          </ButtonBase>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`save-cancel-wrapper ${saveCancelWrapperClasses}`}>
                      {(onCancelClicked || cancelType === 'submit') && (
                        <div className={`cancel-wrapper ${cancelWrapperClasses}`}>
                          <ButtonBase
                            id={cancelIdRef}
                            className={`cancel-btn-wrapper ${cancelClasses}`}
                            type={cancelType}
                            onClick={onCancelClicked}
                            disabled={cancelIsDisabled}>
                            <span>
                              {t(
                                `${
                                  (cancelText === 'cancel' && translationPathShared) ||
                                  translationPath
                                }${cancelText}`
                              )}
                            </span>
                          </ButtonBase>
                        </div>
                      )}
                      {(onSaveClicked || saveType === 'submit') && (
                        <div className={`save-wrapper ${saveWrapperClasses}`}>
                          <ButtonBase
                            id={saveIdRef}
                            className={`save-btn-wrapper ${saveClasses}${
                              (isConfirm && !isWithoutConfirmClasses && ' bg-danger') || ''
                            }${(isEdit && ' bg-secondary') || ''}`}
                            type={saveType}
                            onClick={onSaveClicked}
                            disabled={saveIsDisabled || isSaving}>
                            {isSaveLoading && <CircularProgress />}
                            <span>
                              {(isConfirm &&
                                saveText === 'save' &&
                                t(`${translationPathShared}confirm`)) ||
                                t(
                                  `${
                                    (saveText === 'save' && translationPathShared) ||
                                    translationPath
                                  }${saveText}`
                                )}
                            </span>
                          </ButtonBase>
                        </div>
                      )}
                    </div>
                  )}
                </>
              ))}
          </DialogActions>
        </div>
      </form>
    </Dialog>
  );
};

DialogComponent.propTypes = {
  saveIdRef: PropTypes.string,
  cancelIdRef: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  wrapperClasses: PropTypes.string,
  titleClasses: PropTypes.string,
  contentClasses: PropTypes.string,
  footerClasses: PropTypes.string,
  closeClasses: PropTypes.string,
  nextPreviousWrapperClasses: PropTypes.string,
  previousClasses: PropTypes.string,
  nextClasses: PropTypes.string,
  cancelWrapperClasses: PropTypes.string,
  cancelClasses: PropTypes.string,
  saveWrapperClasses: PropTypes.string,
  saveCancelWrapperClasses: PropTypes.string,
  saveClasses: PropTypes.string,
  titleTextClasses: PropTypes.string,
  titleText: PropTypes.string,
  saveText: PropTypes.string,
  cancelText: PropTypes.string,
  closeIsDisabled: PropTypes.bool,
  isUploaderDialog: PropTypes.bool,
  previousIsDisabled: PropTypes.bool,
  nextIsDisabled: PropTypes.bool,
  cancelIsDisabled: PropTypes.bool,
  saveIsDisabled: PropTypes.bool,
  dialogTitle: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  dialogContent: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  dialogActions: PropTypes.oneOfType([PropTypes.elementType, PropTypes.func, PropTypes.node]),
  onCloseClicked: PropTypes.func,
  onNextClicked: PropTypes.func,
  onConfirmClicked: PropTypes.func,
  confirmText: PropTypes.string,
  onPreviousClicked: PropTypes.func,
  onCancelClicked: PropTypes.func,
  onSaveClicked: PropTypes.func,
  onSubmit: PropTypes.func,
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPathShared: PropTypes.string,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  defaultMaxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  defaultConfirmMaxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  saveType: PropTypes.string,
  cancelType: PropTypes.string,
  nextType: PropTypes.string,
  previousType: PropTypes.string,
  confirmClasses: PropTypes.string,
  isSaving: PropTypes.bool,
  isConfirm: PropTypes.bool,
  isSaveLoading: PropTypes.bool,
  isWithoutConfirmClasses: PropTypes.bool,
  isEdit: PropTypes.bool,
  isWithIcon: PropTypes.bool,
  isOldTheme: PropTypes.bool,
  scroll: PropTypes.oneOf(['paper', 'body']),
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  dialogFormId: PropTypes.string,
  dialogPaperProps: PropTypes.instanceOf(Object),
  dialogPaperStyle: PropTypes.instanceOf(Object),
  isFixedHeight: PropTypes.bool,
};
DialogComponent.defaultProps = {
  saveIdRef: 'dialogSaveBtnId',
  cancelIdRef: 'dialogCancelBtnId',
  wrapperClasses: '',
  titleClasses: '',
  contentClasses: '',
  footerClasses: '',
  closeClasses: 'btns-icon theme-transparent mx-2 mb-2',
  nextPreviousWrapperClasses: '',
  saveCancelWrapperClasses: '',
  previousClasses: 'btns theme-outline',
  nextClasses: 'btns theme-solid bg-secondary',
  cancelWrapperClasses: '',
  cancelClasses: 'btns theme-outline',
  saveWrapperClasses: '',
  saveClasses: 'btns theme-solid',
  titleTextClasses: '',
  titleText: undefined,
  saveText: 'save',
  cancelText: 'Cancel',
  closeIsDisabled: false,
  isSaveLoading: false,
  previousIsDisabled: false,
  isUploaderDialog: false,
  onConfirmClicked: undefined,
  confirmText: 'Confirm',
  confirmClasses: 'btns theme-outline',
  nextIsDisabled: false,
  cancelIsDisabled: false,
  saveIsDisabled: false,
  isWithIcon: false,
  dialogTitle: undefined,
  dialogContent: undefined,
  dialogActions: undefined,
  onCloseClicked: undefined,
  onNextClicked: undefined,
  onPreviousClicked: undefined,
  onCancelClicked: undefined,
  onSaveClicked: undefined,
  onSubmit: undefined,
  translationPath: '',
  parentTranslationPath: '',
  translationPathShared: 'Shared:',
  maxWidth: undefined,
  defaultMaxWidth: 'md',
  defaultConfirmMaxWidth: 'xs',
  saveType: 'submit',
  cancelType: undefined,
  nextType: undefined,
  previousType: undefined,
  isSaving: false,
  isConfirm: false,
  isWithoutConfirmClasses: false,
  isEdit: false,
  isOldTheme: false,
  minHeight: undefined,
  scroll: 'paper',
  dialogFormId: 'sharedDialogFormId',
  dialogPaperProps: undefined,
  dialogPaperStyle: undefined,
  isFixedHeight: false,
};

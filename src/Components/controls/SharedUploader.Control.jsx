/**
 * @author Manaf Hijazi (manafhijazii@gmail.com)
 */
import React from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {UploaderPageEnum} from '../../enums';
import {UploaderComponent} from "../Uploader/Uploader.Component";

export const SharedUploaderControl = ({
    editValue,
    onValueChanged,
    idRef,
    errors,
    isSubmitted,
    stateKey,
    parentId,
    parentIndex,
    subParentId,
    subParentIndex,
    uploaderPage,
    dropHereText,
    fileTypeText,
    errorPath,
    labelValue,
    parentTranslationPath,
    translationPath,
    isHalfWidth,
    isQuarterWidth,
}) => {
    const {t} = useTranslation('Shared');

    return (
        <div
            className={`shared-uploader-wrapper ${
                (isHalfWidth && ' is-half-width') || ''
            }${(isQuarterWidth && ' is-quarter-width') || ''} shared-control-wrapper`}
        >
            <UploaderComponent
                idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
                    subParentId || ''
                }-${subParentIndex || 0}-${stateKey}`}
                uploaderPage={uploaderPage}
                dropHereText={
                    dropHereText
          || `${t('drop-here-max')} ${uploaderPage.maxFileNumber} ${t(
              `${fileTypeText}-bracket`,
          )}`
                }
                helperText={
                    (errorPath
            && errors[errorPath]
            && errors[errorPath].error
            && errors[errorPath].message)
          || undefined
                }
                isSubmitted={isSubmitted}
                uploadedFiles={editValue || []}
                labelValue={labelValue}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                uploadedFileChanged={(newFiles) => {
                    onValueChanged({
                        parentId,
                        parentIndex,
                        subParentId,
                        subParentIndex,
                        id: stateKey,
                        value: newFiles,
                    });
                }}
            />
        </div>
    );
};

SharedUploaderControl.propTypes = {
    onValueChanged: PropTypes.func.isRequired,
    stateKey: PropTypes.string.isRequired,
    errors: PropTypes.instanceOf(Object),
    editValue: PropTypes.arrayOf(
        PropTypes.shape({
            uuid: PropTypes.string,
            url: PropTypes.string,
            fileName: PropTypes.string,
        }),
    ),
    isSubmitted: PropTypes.bool,
    parentId: PropTypes.string,
    parentIndex: PropTypes.number,
    subParentId: PropTypes.string,
    subParentIndex: PropTypes.number,
    uploaderPage: PropTypes.oneOf(Object.values(UploaderPageEnum).map((item) => item)),
    dropHereText: PropTypes.string,
    fileTypeText: PropTypes.string,
    errorPath: PropTypes.string,
    labelValue: PropTypes.string,
    idRef: PropTypes.string,
    parentTranslationPath: PropTypes.string,
    translationPath: PropTypes.string,
    isHalfWidth: PropTypes.bool,
    isQuarterWidth: PropTypes.bool,
};
SharedUploaderControl.defaultProps = {
    idRef: 'SharedUploaderControl',
    isSubmitted: undefined,
    errors: {},
    editValue: null,
    parentId: undefined,
    parentIndex: undefined,
    subParentId: undefined,
    subParentIndex: undefined,
    uploaderPage: UploaderPageEnum.DynamicForm,
    fileTypeText: 'image',
    dropHereText: undefined,
    errorPath: undefined,
    labelValue: undefined,
    parentTranslationPath: undefined,
    translationPath: undefined,
    isHalfWidth: undefined,
    isQuarterWidth: undefined,
};

import React, {memo} from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Switch from '@mui/material/Switch';
import {useTranslation} from 'react-i18next';
import './Switch.Style.scss';
import i18next from 'i18next';

export const SwitchComponent = memo(
    ({
        isChecked,
        onChange,
        color,
        parentTranslationPath,
        translationPath,
        wrapperClasses,
        themeClass,
        switchLabelClasses,
        switchClasses,
        rootClasses,
        switchBaseClasses,
        thumbClasses,
        trackClasses,
        checkedClasses,
        labelClasses,
        switchControlClasses,
        labelValue,
        idRef,
        isDisabled,
        switchLabelRef,
        label,
        labelPlacement,
        isReversedLabel,
        isFlexEnd,
        switchControlWrapperRef,
    }) => {
        const {t} = useTranslation(parentTranslationPath);

        return (
            <div
                className={`switch-component-wrapper${
                    (wrapperClasses && ` ${wrapperClasses}`) || ''
                }${(themeClass && ` ${themeClass}`) || ''}${
                    (isFlexEnd && ' is-flex-end') || ''
                }`}
            >
                <FormControl
                    ref={switchControlWrapperRef}
                    className={`switch-control-wrapper${
                        (switchControlClasses && ` ${switchControlClasses}`) || ''
                    }`}
                >
                    {labelValue && (
                        <div className="labels-wrapper">
                            {labelValue && (
                                <label
                                    htmlFor={idRef}
                                    className={`label-wrapper${
                                        (labelClasses && ` ${labelClasses}`) || ''
                                    }${isDisabled ? ' disabled' : ''}`}
                                >
                                    {t(`${translationPath}${labelValue}`)}
                                </label>
                            )}
                        </div>
                    )}
                    <FormControlLabel
                        id={idRef}
                        ref={switchLabelRef}
                        className={`switch-control-label-wrapper${
                            (switchLabelClasses && ` ${switchLabelClasses}`) || ''
                        }`}
                        control={(
                            <Switch
                                className={`switch-control${
                                    (switchClasses && ` ${switchClasses}`) || ''
                                }`}
                                color={color}
                                classes={{
                                    root: `root-wrapper${(rootClasses && ` ${rootClasses}`) || ''}`,
                                    switchBase: `switch-base-wrapper${
                                        (switchBaseClasses && ` ${switchBaseClasses}`) || ''
                                    }`,
                                    thumb: `thumb-wrapper${
                                        (thumbClasses && ` ${thumbClasses}`) || ''
                                    }`,
                                    track: `track-wrapper${
                                        (trackClasses && ` ${trackClasses}`) || ''
                                    }`,
                                    checked: `checked-wrapper${
                                        (checkedClasses && ` ${checkedClasses}`) || ''
                                    }`,
                                }}
                                checked={isChecked}
                                onChange={onChange}
                            />
                        )}
                        label={(label && t(`${translationPath}${label}`)) || undefined}
                        labelPlacement={
                            (isReversedLabel
                && ((labelPlacement === 'start' && i18next.dir() === 'rtl' && 'end')
                  || (labelPlacement === 'end'
                    && i18next.dir() === 'rtl'
                    && 'start')))
              || labelPlacement
                        }
                        disabled={isDisabled}
                    />
                </FormControl>
            </div>
        );
    },
);

SwitchComponent.displayName = 'SwitchComponent';

SwitchComponent.propTypes = {
    isChecked: PropTypes.bool,
    onChange: PropTypes.func,
    color: PropTypes.oneOf(['primary', 'secondary', 'default']),
    labelPlacement: PropTypes.oneOf(['end', 'start', 'top', 'bottom']),
    parentTranslationPath: PropTypes.string,
    translationPath: PropTypes.string,
    wrapperClasses: PropTypes.string,
    themeClass: PropTypes.oneOf(['theme-default', 'theme-line']),
    switchLabelClasses: PropTypes.string,
    switchClasses: PropTypes.string,
    rootClasses: PropTypes.string,
    switchBaseClasses: PropTypes.string,
    thumbClasses: PropTypes.string,
    trackClasses: PropTypes.string,
    checkedClasses: PropTypes.string,
    labelClasses: PropTypes.string,
    switchControlClasses: PropTypes.string,
    labelValue: PropTypes.string,
    idRef: PropTypes.string,
    isDisabled: PropTypes.bool,
    isReversedLabel: PropTypes.bool,
    isFlexEnd: PropTypes.bool,
    switchLabelRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({current: PropTypes.instanceOf(Element)}),
    ]),
    switchControlWrapperRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({current: PropTypes.instanceOf(Element)}),
    ]),
    label: PropTypes.string,
};
SwitchComponent.defaultProps = {
    isChecked: undefined,
    onChange: undefined,
    color: undefined,
    parentTranslationPath: 'Shared',
    translationPath: '',
    wrapperClasses: undefined,
    themeClass: 'theme-default',
    switchLabelClasses: undefined,
    switchClasses: undefined,
    labelClasses: undefined,
    rootClasses: undefined,
    switchBaseClasses: undefined,
    thumbClasses: undefined,
    trackClasses: undefined,
    checkedClasses: undefined,
    switchControlClasses: undefined,
    labelValue: undefined,
    idRef: 'switchRef',
    isDisabled: false,
    switchLabelRef: undefined,
    switchControlWrapperRef: undefined,
    label: undefined,
    isReversedLabel: false,
    isFlexEnd: false,
    labelPlacement: 'start',
};

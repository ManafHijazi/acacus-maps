import React, {useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import {useTranslation} from 'react-i18next';
import i18next from 'i18next';
import {SystemLanguagesConfig} from '../../Configs';
import PopoverComponent from "../Popover/Popover.Component";
import {languageChange} from "../../Helpers";
import {IconButton} from "@mui/material";
import './LanguageChange.Style.scss';

export const LanguageChangeComponent = ({translationPath}) => {
    const {t} = useTranslation('Shared');
    const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
    const languageChangePopoverCloseHandler = useCallback(() => {
        setPopoverAttachedWith(null);
    }, []);
    const languageChangeTogglerHandler = useCallback((event) => {
        setPopoverAttachedWith(event.currentTarget);
    }, []);

    return (
        <div className="language-change-wrapper">
            <IconButton
                className="language-change-btn"
                onClick={languageChangeTogglerHandler}
            >
                <img
                    src={
                        SystemLanguagesConfig[i18next.language]
            && SystemLanguagesConfig[i18next.language].icon
                    }
                    alt={t(
                        `${translationPath}${
                            SystemLanguagesConfig[i18next.language]
              && SystemLanguagesConfig[i18next.language].value
                        }`,
                    )}
                    className="language-img"
                />

                {/*<span className="px-2">{t(`${translationPath}${i18next.language}`)}</span>*/}
            </IconButton>
            <PopoverComponent
                idRef="languageChangeComponentPopover"
                attachedWith={popoverAttachedWith}
                handleClose={languageChangePopoverCloseHandler}
                popoverClasses="language-change-popover-wrapper"
                component={(
                    <div className="language-change-items-wrapper">
                        {Object.values(SystemLanguagesConfig).map((item) => (
                            <ButtonBase
                                className="btns br-0 theme-solid-hover language-change-popover-btn"
                                key={item.key}
                                onClick={() => {
                                    languageChange(item.key);
                                    languageChangePopoverCloseHandler();
                                }}
                            >
                                <img src={item.icon} alt={t(`${translationPath}${item.value}`)} />
                                <span className="px-2">{t(`${translationPath}${item.value}`)}</span>
                            </ButtonBase>
                        ))}
                    </div>
                )}
            />
        </div>
    );
};

LanguageChangeComponent.propTypes = {
    translationPath: PropTypes.string,
};
LanguageChangeComponent.defaultProps = {
    translationPath: 'LanguageChangeComponent.',
};

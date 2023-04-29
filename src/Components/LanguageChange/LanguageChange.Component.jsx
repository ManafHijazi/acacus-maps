import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { languageChange } from '../../Helpers';
import ButtonBase from '@mui/material/ButtonBase';
import { SystemLanguagesConfig } from '../../Configs';
import PopoverComponent from '../Popover/Popover.Component';
import './LanguageChange.Style.scss';

export const LanguageChangeComponent = ({ translationPath }) => {
  const { t, i18n } = useTranslation('Shared');
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);

  const languageChangePopoverCloseHandler = useCallback(() => {
    setPopoverAttachedWith(null);
  }, []);

  const languageChangeTogglerHandler = useCallback((event) => {
    setPopoverAttachedWith(event.currentTarget);
  }, []);

  return (
    <div className='language-change-wrapper'>
      <IconButton className='language-change-btn' onClick={languageChangeTogglerHandler}>
        <img
          className='language-img'
          src={SystemLanguagesConfig[i18n.language] && SystemLanguagesConfig[i18n.language].icon}
          alt={t(
            `${translationPath}${
              SystemLanguagesConfig[i18n.language] && SystemLanguagesConfig[i18n.language].value
            }`,
          )}
        />
      </IconButton>

      <PopoverComponent
        attachedWith={popoverAttachedWith}
        idRef='languageChangeComponentPopover'
        handleClose={languageChangePopoverCloseHandler}
        popoverClasses='language-change-popover-wrapper'
        component={
          <div className='language-change-items-wrapper'>
            {Object.values(SystemLanguagesConfig).map((item) => (
              <ButtonBase
                key={item.key}
                className='btns br-0 language-change-popover-btn'
                onClick={() => {
                  languageChange(item.key);
                  languageChangePopoverCloseHandler();
                }}
              >
                <img src={item.icon} alt={t(`${translationPath}${item.value}`)} />
                <span className='px-2'>{t(`${translationPath}${item.value}`)}</span>
              </ButtonBase>
            ))}
          </div>
        }
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

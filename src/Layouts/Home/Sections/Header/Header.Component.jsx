import React, { useState, useCallback, useContext, useEffect } from 'react';
import {
  GlobalHistory,
  GlobalRerender,
  setLogoutAction,
  SetGlobalRerender,
  removeAllPendingRequestsRecordHttp,
} from '../../../../Helpers';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { storageService } from '../../../../utils';
import { LoginActions } from '../../../../Store/Actions';
import { LanguageChangeComponent } from '../../../../Components';
import { ThemeContext } from '../../../../Contexts/theme-context';
import { ButtonBase, Badge, Avatar, FormGroup, FormControlLabel, Switch } from '@mui/material';
import './Header.Style.scss';

const FirstLettersExp = /\b(\w)/gm;

export const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme === 'dark' ? '#003892' : '#fbb03b',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff',
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme === 'dark' ? '#8796A5' : '#f0f0f0',
    borderRadius: 20 / 2,
  },
}));

export const HeaderComponent = () => {
  const { t } = useTranslation('Shared');
  const [render, setRender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useContext(ThemeContext);
  const userState = JSON.parse(localStorage.getItem('user'));

  SetGlobalRerender(setRender, render);

  const handleThemeChange = () => {
    const isCurrentDark = theme === 'dark';
    setTheme(isCurrentDark ? 'light' : 'dark');

    localStorage.setItem('theme', isCurrentDark ? 'light' : 'dark');

    GlobalRerender();
  };

  const getUserProfilePicture = useCallback(async () => {
    setIsLoading(true);

    const response = {};

    if (response) {
      const { data } = response;
      const localData = (data && typeof data === 'string' && data.replace('/', '')) || '';

      const localUserObject = {
        ...userState,
        profile_picture: `${localStorage.getItem('endPoint')}${localData}`,
      };

      localStorage.setItem('user', JSON.stringify(localUserObject));
    }

    setIsLoading(false);
  }, []);

  const logoutClicked = async () => {
    removeAllPendingRequestsRecordHttp();
    LoginActions.logout();
    storageService.clearLocalStorage();

    setTimeout(() => {
      GlobalHistory.push('/accounts/login');
    }, 100);
  };

  setLogoutAction(logoutClicked);

  const isBrowserDefaultDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

  const getDefaultTheme = () => {
    const localStorageTheme = localStorage.getItem('theme');
    const browserDefault = isBrowserDefaultDark() ? 'dark' : 'light';

    setTheme(localStorageTheme || browserDefault);
    localStorage.setItem('theme', localStorageTheme || browserDefault);
  };

  useEffect(() => {
    getDefaultTheme();
  }, [getDefaultTheme]);

  return (
    <div className='header-wrapper'>
      <div>
        <div className='header-title'>{t('welcome-to-acacus-maps')}</div>
        <div className='header-subtitle'>
          {t('hi')},{' '}
          {userState && `${userState.first_name} ${userState.last_name} ${t('welcome-back')}`}
        </div>
      </div>

      <div className='header-btns btns'>
        <FormGroup>
          <FormControlLabel
            control={
              <MaterialUISwitch
                theme={theme}
                sx={{ m: 1 }}
                onClick={handleThemeChange}
                checked={localStorage.getItem('theme') === 'dark'}
              />
            }
          />
        </FormGroup>

        <div className='cog-btn-wrapper'>
          <LanguageChangeComponent />
        </div>

        <div className='notifications-btn-wrapper'>
          <ButtonBase>
            <Badge>
              <span className='mdi mdi-bell c-yellow' />
            </Badge>
          </ButtonBase>
        </div>

        <div className='user-profile-btn-wrapper'>
          <ButtonBase id='headerUserMenuBtn' onClick={() => {}}>
            <Avatar
              className='avatars-wrapper theme-small'
              src={userState && userState.profile_picture}
            >
              <span className='pt-1'>
                {userState &&
                  `${userState.first_name} ${userState.last_name}`.match(FirstLettersExp)}
              </span>
            </Avatar>
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

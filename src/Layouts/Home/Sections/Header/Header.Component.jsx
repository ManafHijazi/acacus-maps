import React, { useState, useCallback } from 'react';
import { ButtonBase, Badge, Avatar } from '@mui/material';
import {
  GlobalHistory,
  setLogoutAction,
  SetGlobalRerender,
  removeAllPendingRequestsRecordHttp,
} from '../../../../Helpers';
import { storageService } from '../../../../utils';
import { LoginActions } from '../../../../Store/Actions';
import './Header.Style.scss';

const FirstLettersExp = /\b(\w)/gm;

export const HeaderComponent = () => {
  const userState = JSON.parse(localStorage.getItem('user'));
  const [isLoading, setIsLoading] = useState(false);
  const [render, setRender] = useState(false);

  SetGlobalRerender(setRender, render);

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

  return (
    <div className='header-wrapper'>
      <div>
        <div className='header-title'>Welcome to SDTS</div>
        <div className='header-subtitle'>
          Hi, {`${userState.first_name} ${userState.last_name} Welcome back`}
        </div>
      </div>

      <div className='header-btns btns'>
        <div className='cog-btn-wrapper'>
          <ButtonBase>
            <Badge>
              <span className='mdi mdi-cog c-info' />
            </Badge>
          </ButtonBase>
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
              src={userState && userState.profile_picture}>
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

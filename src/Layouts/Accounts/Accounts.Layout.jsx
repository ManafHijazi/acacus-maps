import React, { useEffect } from 'react';
import { SwitchRouteComponent } from '../../Components';
import { GlobalHistory } from '../../Helpers';
import { AccountsRoutes } from '../../Routes';
import { useLocation } from 'react-router-dom';
import './Account.Style.scss';

const AccountLayout = () => {
  const location = useLocation();
  const isLoggedIn =
    localStorage.getItem('isLoggedIn') && JSON.parse(localStorage.getItem('isLoggedIn'));

  useEffect(() => {
    if (location && location.search && location.search.includes('change_password')) {
      isChangePassword = true;
    }

    if (isLoggedIn) GlobalHistory.push('/home/dashboard-page');

    if (!isLoggedIn) GlobalHistory.push('/accounts/login');
  }, [isLoggedIn]);

  return (
    <div className='account-layout-wrapper'>
      <SwitchRouteComponent routes={AccountsRoutes} />
    </div>
  );
};
export default AccountLayout;

import React, { useEffect } from 'react';
import { SwitchRouteComponent } from '../../Components';
import { GlobalHistory } from '../../Helpers';
import { AccountsRoutes } from '../../Routes';
import './Account.Style.scss';

const AccountLayout = () => {
  const isLoggedIn =
    localStorage.getItem('isLoggedIn') && JSON.parse(localStorage.getItem('isLoggedIn'));

  useEffect(() => {
    if (isLoggedIn) GlobalHistory.push('/home/map-page');

    if (!isLoggedIn) GlobalHistory.push('/accounts/login');
  }, [isLoggedIn]);

  return (
    <div className='account-layout-wrapper'>
      <SwitchRouteComponent routes={AccountsRoutes} />
    </div>
  );
};
export default AccountLayout;

import React, { useCallback, useState } from 'react';
import { ButtonBase } from '@mui/material';
import { Inputs, CheckboxesComponent } from '../../../Components';
import { GlobalHistory, SetGlobalSocketReducer } from '../../../Helpers';
import { LoginActions } from 'Store/Actions';

const LoginView = () => {
  const endPoint = localStorage.getItem('endPoint') || '';
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [state, setState] = useState({
    user_id: '',
    password: '',
  });

  const handleLogin = useCallback(async () => {
    setIsLoginLoading(true);
    const response = true;

    if (response) {
      const data = {
        access_token: 'test_token',
        email: 'manafhijazii@gmail.com',
        first_login: false,
        first_name: 'Manaf',
        is_deleted: false,
        last_name: 'Hijazi',
        profile_picture: '',
        roles: [{ role_id: 1, role_name: 'SUPER_USER' }],
        super_user: false,
        user_id: 1,
        user_name: 'mhijazi',
      };

      localStorage.setItem('access_token', data.access_token);

      let localEndPoint = endPoint;

      if (endPoint.includes('https')) localEndPoint = endPoint.replace('https', 'wss');
      else localEndPoint = endPoint.replace('http', 'wss');

      // SetGlobalSocketReducer(
      //   new WebSocket(`${localEndPoint}api/v1/products/ws?access_token=${data.access_token}`)
      // );

      let userObject = { ...data, access_token: '' };

      if (userObject && userObject.super_user) {
        userObject = { ...data, roles: [{ role_name: 'SUPER_USER' }] };
      }

      localStorage.setItem('user', JSON.stringify(userObject));
      LoginActions.login(userObject);
      localStorage.setItem('isLoggedIn', JSON.stringify(true));
      setIsLoginLoading(false);

      GlobalHistory.push('/home/map-page');
    } else {
      if (response && response.data) {
        showError(
          (response &&
            response.data &&
            Array.isArray(response.data) &&
            response.data.map((item, index) => (
              <div key={`${index + 1}-error`}>{`- ${item}`}</div>
            ))) ||
            'Login Failed',
        );
        setIsLoginLoading(false);
      }
    }
  }, [state]);

  return (
    <div className='login-wrapper'>
      <div className='login-wrapper-card'>
        <div className='card-title'>Acacus Maps</div>
        <div className='card-subtitle'>Please login to start using the system</div>
        <div className='login-card-body'>
          <Inputs
            idRef='loginEmailInputId'
            value={state.user_id}
            wrapperClasses='mb-3'
            inputPlaceholder='Email'
            onInputChanged={(event) => {
              const { value } = event.target;
              setState((items) => ({ ...items, user_id: value }));
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter' && state.password && state.user_id) handleLogin();
            }}
          />
          <Inputs
            idRef='loginPasswordInputId'
            wrapperClasses='mb-2'
            value={state.password}
            inputPlaceholder='Password'
            type={isShowPassword ? 'text' : 'password'}
            onInputChanged={(event) => {
              const { value } = event.target;
              setState((items) => ({ ...items, password: value }));
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter' && state.password && state.email) handleLogin();
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !isLoginLoading && state.user_id && state.password) {
                handleLogin();
              }
            }}
            endAdornment={
              <ButtonBase
                id='loginShowPasswordBtnId'
                className='btns-icon mx-2 theme-transparent'
                onClick={() => setIsShowPassword((items) => !items)}
              >
                <span
                  className={`c-gray-primary  mdi mdi-${
                    (isShowPassword && 'eye-off') || 'eye'
                  } px-2`}
                />
              </ButtonBase>
            }
          />
          <div className='login-actions-wrapper'>
            <CheckboxesComponent
              idRef='rememberMeLoginRefId'
              singleChecked={isRememberMe}
              label='Remember Me'
              onSelectedCheckboxChanged={() => {
                setIsRememberMe((item) => !item);
              }}
            />
          </div>
          <div className='login-button-wrapper'>
            <ButtonBase id='loginSigninBtnId' onClick={handleLogin}>
              {isLoginLoading ? 'Signing in ...' : 'Sign in'}
            </ButtonBase>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

import React, { useCallback, useState, useEffect } from 'react';
import { LoginService } from 'Services';
import { ButtonBase } from '@mui/material';
import { LoginActions } from 'Store/Actions';
import { Inputs, CheckboxesComponent } from '../../../Components';
import { GlobalHistory, SetGlobalTokenReducer } from '../../../Helpers';

const LoginView = () => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRememberMe, setIsRememberMe] = useState(false);
  const [token, setToken] = useState(null);
  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const getUserDetails = useCallback(() => {
    if (token) {
      const response = { data: true };

      if (response) {
        const data = {
          email: 'm.jarwan@acacusgroup.com',
          first_name: 'Mohammad',
          is_deleted: false,
          last_name: 'Jarwan',
          profile_picture: '',
          roles: [{ role_id: 1, role_name: 'SUPER_USER' }],
          super_user: false,
          user_id: 1,
          user_name: 'mhijazi',
        };

        localStorage.setItem('user', JSON.stringify(data));

        LoginActions.login(data);

        GlobalHistory.push('/home/map-page');
      }
    }
  }, [state, token]);

  const handleLogin = useCallback(async () => {
    setIsLoginLoading(true);

    const response = await LoginService(state);

    if (response) {
      const { data } = response;

      setToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      SetGlobalTokenReducer(data.accessToken);
      localStorage.setItem('isLoggedIn', JSON.stringify(true));

      setIsLoginLoading(false);
    } else {
      if (response && response.data) {
        setToken(null);
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

  useEffect(() => {
    if (token) getUserDetails();
  }, [getUserDetails, token]);

  useEffect(() => {
    if (
      !localStorage.getItem('localization') ||
      !JSON.parse(localStorage.getItem('localization')).currentLanguage
    ) {
      const language = {
        currentLanguage: 'en',
        isRtl: false,
      };
      localStorage.setItem('localization', JSON.stringify(language));
    }
  }, []);

  return (
    <div className='login-wrapper'>
      <div className='login-wrapper-card'>
        <div className='card-title'>Acacus Maps</div>
        <div className='card-subtitle'>Please login to start using the system</div>
        <div className='login-card-body'>
          <Inputs
            idRef='loginEmailInputId'
            value={state.email}
            wrapperClasses='mb-3'
            inputPlaceholder='Email'
            onInputChanged={(event) => {
              const { value } = event.target;
              setState((items) => ({ ...items, email: value }));
            }}
            onKeyUp={(event) => {
              if (event.key === 'Enter' && state.password && state.email) handleLogin();
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
              if (event.key === 'Enter' && !isLoginLoading && state.email && state.password) {
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

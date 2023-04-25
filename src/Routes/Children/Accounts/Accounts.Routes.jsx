import loadable from '@loadable/component';

const LoginView = loadable(() => import('../../../Views/Accounts/Login/Login.View'));

export const AccountsRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    layout: '/accounts',
    default: true,
    authorize: false,
    isRoute: true,
    isExact: false,
  },
];

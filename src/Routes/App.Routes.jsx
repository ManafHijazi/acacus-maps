import loadable from '@loadable/component';
import HomeRoutes from './Children/Home/Home.Routes';

const HomeLayout = loadable(() => import('../Layouts/Home/Home.Layout'));
const AccountsLayout = loadable(() => import('../Layouts/Accounts/Accounts.Layout'));
const NotFoundLayout = loadable(() => import('../Layouts/NotFound/NotFound.Layout'));

export const AppRoutes = [
  {
    path: '/accounts',
    name: 'Accounts',
    component: AccountsLayout,
    layout: '',
    default: true,
    authorize: false,
    isRecursive: false,
    roles: [],
    isRoute: true,
    children: [],
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeLayout,
    layout: '',
    default: false,
    isRecursive: true,
    authorize: true,
    roles: [],
    isRoute: true,
    children: HomeRoutes,
  },
  {
    path: '/404',
    name: 'Not Found',
    component: NotFoundLayout,
    layout: '',
    default: false,
    isRecursive: true,
    authorize: true,
    roles: [],
    isRoute: true,
    children: [],
  },
];

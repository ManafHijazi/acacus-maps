import loadable from '@loadable/component';

const MapPageView = loadable(() =>
  import('../../../Views/Home/map-page/MapPageView')
);

const HomeRoutes = [
  {
    id: 1,
    path: '/map-page',
    name: 'Maps',
    component: MapPageView,
    layout: '/home',
    default: true,
    isRoute: true,
    authorize: true,
    roles: ['SUPER_USER'],
    icon: 'mdi mdi-map',
    isDisabled: false,
    isRecursive: false,
    isHidden: false,
    isExact: true,
    children: [],
  },
];

export default HomeRoutes;

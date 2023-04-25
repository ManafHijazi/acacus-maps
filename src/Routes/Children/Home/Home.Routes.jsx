import loadable from '@loadable/component';

const MapPageView = loadable(() => import('../../../Views/Home/map-page/MapPageView'));
const VehiclesPageView = loadable(() =>
  import('../../../Views/Home/vehicles-page/VehiclesPageView'),
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
  {
    id: 2,
    path: '/vehicles-page',
    name: 'Vehicles',
    component: VehiclesPageView,
    layout: '/home',
    default: true,
    isRoute: true,
    authorize: true,
    roles: ['SUPER_USER'],
    icon: 'mdi mdi-car-3-plus',
    isDisabled: false,
    isRecursive: false,
    isHidden: false,
    isExact: true,
    children: [],
  },
];

export default HomeRoutes;

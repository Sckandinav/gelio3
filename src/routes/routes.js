const apiPath = process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_DEV_API_URL}/api` : `${process.env.REACT_APP_PROD_API_URL}/api`;

export const url = {
  login: () => '/login',
  main: () => '/',
  error: () => 'error-page',
  edo: () => '/edo',
};

export const links = {
  login: () => [apiPath, 'auth/login/'].join('/'),
  sideBar: () => [apiPath, 'edo', 'doc-sidebar/'].join('/'),
  getUsers: () => [apiPath, 'core', 'user-list/'].join('/'),
};

const apiPath = process.env.NODE_ENV === 'development' ? `${process.env.REACT_APP_DEV_API_URL}/api` : `${process.env.REACT_APP_PROD_API_URL}/api`;

export const url = {
  login: () => '/login',
  main: () => '/',
  error: () => '/error-page',
  edo: () => '/edo',
  edoCreated: () => 'created',
  notFound: () => '/not-found',
  support: () => '/support',
  applications: () => '/applications',
};

export const links = {
  checkStatus: () => [apiPath, 'core', 'health/'].join('/'),
  login: () => [apiPath, 'auth/login/'].join('/'),
  sideBar: () => [apiPath, 'edo', 'doc-sidebar/'].join('/'), // сайд бар это
  getUsers: () => [apiPath, 'core', 'user-list/'].join('/'), // список сотрудников
  getRooms: () => [apiPath, 'edo', 'inbox/'].join('/'), // комнаты эдо
  getDepartmentRooms: () => [apiPath, 'edo', 'inbox'].join('/'), // комнаты эдо
  roomType: () => [apiPath, 'edo', 'room-type/'].join('/'),

  createRoom: () => [apiPath, 'edo', 'room-detail', 'create-room/'].join('/'), // создание комнаты
};

export const roomLinks = {
  room: id => [apiPath, 'edo', 'room-detail', `${id}/`].join('/'),
  addFile: id => [apiPath, 'edo', 'room-detail', id, 'add-file/'].join('/'),
  addUser: id => [apiPath, 'edo', 'room-detail', id, 'add-user/'].join('/'),
  removeUser: id => [apiPath, 'edo', 'room-detail', id, 'remove-user/'].join('/'),
  addSigners: id => [apiPath, 'edo', 'document', id, 'add-signers/'].join('/'),
  addViewers: id => [apiPath, 'edo', 'document', id, 'add-viewers/'].join('/'),
  removeViewers: id => [apiPath, 'edo', 'document', id, 'remove-viewers/'].join('/'),
  removeSigners: id => [apiPath, 'edo', 'document', id, 'remove-signers/'].join('/'),
  signDoc: id => [apiPath, 'edo', 'document', id, 'confirm-sign/'].join('/'),
  viewDoc: id => [apiPath, 'edo', 'document', id, 'confirm-view/'].join('/'),
  rejectSign: id => [apiPath, 'edo', 'document', id, 'reject-sign/'].join('/'),
  removeFile: id => [apiPath, 'edo', 'room-detail', id, 'remove-file/'].join('/'),
  toggleStatus: id => [apiPath, 'edo', 'room-detail', id, 'toggle-status/'].join('/'),
  downloadOriginal: id => [apiPath, 'edo', 'document', id, 'download-original/'].join('/'),
  downloadSigned: id => [apiPath, 'edo', 'document', id, 'download-signed/'].join('/'),
};

export const applicationUrl = {
  sideBar: () => [apiPath, 'edo', 'application', 'incoming/'].join('/'),
  sideBarCreated: () => [apiPath, 'edo', 'application', 'created/'].join('/'),
  createApplication: () => [apiPath, 'edo', 'application/'].join('/'),
  sideBarIncoming: () => [apiPath, 'edo', 'application-sidebar/'].join('/'),
  getTask: id => [apiPath, 'edo', 'application', `${id}/`].join('/'),
  expensesUrl: () => [apiPath, 'edo', 'application-cost-items/'].join('/'),
  approve: id => [apiPath, 'edo', 'application', id, 'approve/'].join('/'),
  actionsWithRow: () => [apiPath, 'edo', 'application-items/'].join('/'),
  approveByCeo: id => [apiPath, 'edo', 'application', id, 'approve-ceo/'].join('/'),
};

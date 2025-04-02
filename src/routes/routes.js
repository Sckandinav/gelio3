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
  applicationsAdd: () => '/applications/add',
  payment: () => '/payment',
  paymentID: () => '/payment/:id',
  paymentAdd: () => '/payment/add',
  chemistry: () => '/chemistry',
  chemistryAdd: () => '/chemistry/add',
  chemistryPesticideItem: () => '/chemistry/pesticide',
  maps: () => '/maps',
  noAccess: () => '/no-access',
  seeds: () => '/seeds',
  seedsAdd: () => '/seeds/add',
  reports: () => '/reports',
  sowing: () => '/sowing',
};

export const links = {
  checkStatus: () => [apiPath, 'core', 'health/'].join('/'),
  login: () => [apiPath, 'auth/login/'].join('/'),
  sideBar: () => [apiPath, 'edo', 'doc-sidebar/'].join('/'), // сайд бар это
  getUsers: () => [apiPath, 'core', 'user-list/'].join('/'), // список сотрудников
  getRooms: () => [apiPath, 'edo', 'inbox/'].join('/'), // комнаты эдо
  getDepartmentRooms: () => [apiPath, 'edo', 'inbox'].join('/'), // комнаты эдо
  roomType: () => [apiPath, 'edo', 'room-type/'].join('/'),
  getAgro: () => [apiPath, 'core', 'agro-list/'].join('/'),
  ceoList: () => [apiPath, 'core', 'ceo-user-list/'].join('/'), // Список CEO
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
  sideBar: () => [apiPath, 'edo', 'applications/'].join('/'),
  sideBarCreated: () => [apiPath, 'edo', 'applications', 'created/'].join('/'),
  createApplication: () => [apiPath, 'edo', 'applications/'].join('/'),
  sideBarIncoming: () => [apiPath, 'edo', 'application-sidebar/'].join('/'),
  getTask: id => [apiPath, 'edo', 'applications', `${id}/`].join('/'),
  expensesUrl: () => [apiPath, 'edo', 'application-cost-items/'].join('/'),
  approve: id => [apiPath, 'edo', 'applications', id, 'approve/'].join('/'),
  actionsWithRow: () => [apiPath, 'edo', 'application-items/'].join('/'),
  approveByCeo: id => [apiPath, 'edo', 'applications', id, 'approve-ceo/'].join('/'),
  editApplication: id => [apiPath, 'edo', 'applications', id, 'edit/'].join('/'),
};

export const applicationActionsUrl = {
  addApprover: id => [apiPath, 'edo', 'application-items', id, 'add-approver/'].join('/'),
  removeUser: id => [apiPath, 'edo', 'application-items', id, 'remove-approver/'].join('/'),
  approveRow: id => [apiPath, 'edo', 'application-items', id, 'approve/'].join('/'),
  approveCeo: id => [apiPath, 'edo', 'applications', id, 'assign-ceo/'].join('/'),
  removeCeo: id => [apiPath, 'edo', 'applications', id, 'remove-ceo/'].join('/'),
  addManagers: id => [apiPath, 'edo', 'applications', id, 'add-managers/'].join('/'),
  removeManagers: id => [apiPath, 'edo', 'applications', id, 'remove-managers/'].join('/'),
  approveManagers: id => [apiPath, 'edo', 'applications', id, 'approve-manager/'].join('/'),
  withoutApprovalToggle: id => [apiPath, 'edo', 'application-items', `${id}/`].join('/'),
};

//Складской учёт
export const warehousingApi = {
  warehousing: () => [apiPath, 'chemicals/'].join('/'),
  pesticideNames: () => [apiPath, 'chemicals', 'pestecide-names/'].join('/'),
  pesticideNamesChange: id => [apiPath, 'chemicals', 'pestecide-names', `${id}/`].join('/'),
  pesticideNamesDelete: () => [apiPath, 'chemicals', 'pestecide-names', 'bulk-delete/'].join('/'),
  pesticides: () => [apiPath, 'chemicals', 'pestecides/'].join('/'),
  deletePesticides: () => [apiPath, 'chemicals', 'pestecides', 'bulk-delete/'].join('/'),
  pesticidesPUT: id => [apiPath, 'chemicals', 'pestecides', `${id}/`].join('/'),
  pesticideGroup: () => [apiPath, 'chemicals', 'pesticide-groups/'].join('/'),
  pesticideGroupChange: id => [apiPath, 'chemicals', 'pesticide-groups', `${id}/`].join('/'),
  pesticideGroupDelete: () => [apiPath, 'chemicals', 'pesticide-groups', 'bulk-delete/'].join('/'),
  disposalCulture: () => [apiPath, 'maps', 'crops/'].join('/'),
  disposalCultureChange: id => [apiPath, 'maps', 'crops', `${id}/`].join('/'),
  substance: () => [apiPath, 'chemicals', 'substances/'].join('/'),
  substanceChange: id => [apiPath, 'chemicals', 'substances', `${id}/`].join('/'),
  substanceDelete: () => [apiPath, 'chemicals', 'substances', 'bulk-delete/'].join('/'),
};

export const mapsUrls = {
  getPolygonCoordinates: () => [apiPath, 'maps', 'fieldshape'].join('/'),
};

export const payment = {
  payment: () => [apiPath, 'edo', 'payment-request/'].join('/'),
  getBanks: () => [apiPath, 'core', 'bank-list/'].join('/'),
  paymentID: id => [apiPath, 'edo', 'payment-request', `${id}/`].join('/'),
  addSigners: () => [apiPath, 'edo', 'payment-request-signatures/'].join('/'),
  removeSigners: id => [apiPath, 'edo', 'payment-request-signatures', `${id}/`].join('/'),
  signetRow: id => [apiPath, 'edo', 'payment-request-signatures', `${id}/`].join('/'),
  signetCeo: () => [apiPath, 'edo', 'payment-request-signatures/'].join('/'),
};

export const seeds = {
  seeds: () => [apiPath, 'chemicals', 'seeds/'].join('/'), //это партии семян
  certificates: () => [apiPath, 'chemicals', 'seeds-documents/'].join('/'), //это сертификаты  семян
  sorts: () => [apiPath, 'maps', 'sorts/'].join('/'), //это сорта семян
  generations: () => [apiPath, 'maps', 'generations/'].join('/'), // поколения семян
  deleteSeeds: () => [apiPath, 'chemicals', 'seeds', 'bulk-delete/'].join('/'),
  deleteCertificates: () => [apiPath, 'chemicals', 'seeds-documents', 'bulk-delete/'].join('/'),
};

export const reports = {
  reports: () => [apiPath, 'reports', 'payments/'].join('/'),
};

//sowing
export const sowing = {
  seeds: () => [apiPath, 'efis', 'seeds/'].join('/'),
};

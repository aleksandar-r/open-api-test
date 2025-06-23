enum BaseRoutes {
  WILDCARD = '*',
  HOME = '/'
}

const Routes = {
  WILDCARD: BaseRoutes.WILDCARD,
  HOME: (id = '') => `/${id ? id : ''}`
};

export { Routes };

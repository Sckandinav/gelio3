import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { userSelectors } from '../../store/selectors/userSelectors.js';
import { url } from '../../routes/routes.js';

export const PrivateRoute = ({ children }) => {
  const { isAuth } = useSelector(userSelectors);
  return isAuth ? children : <Navigate to={url.login()} />;
};

import React, { useState, useEffect } from 'react';
import { Dashboard } from '../Components/Dashboard/Dashboard';
import { Spinner } from '../Components/Spinner/Spinner';
import { FetchEdo } from '../api/fetchEdo.js';
import { links } from '../routes/routes.js';

export const Edo = () => {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    data: [],
  });

  console.log(state);

  useEffect(() => {
    const fetchData = async () => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const data = await FetchEdo(links.sideBar());
        setState(prev => ({ ...prev, data, isLoading: false }));
      } catch (error) {
        setState(prev => ({ ...prev, error: error.message, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  if (state.isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <Dashboard data={state.data} isDropdown={true} />
    </div>
  );
};

import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

import { Login } from './Pages/LoginPage';
import { NotFound } from './Pages/NotFound';
import { PrivateRoute } from './Components/hoc/PrivateRoute';
import { Layout } from './Components/Layout/Layout.jsx';
import { url } from './routes/routes';
import { Main } from './Pages/Main.jsx';
import { ErrorPage } from './Pages/ErrorPage.jsx';
import { Edo } from './Pages/Edo.jsx';

function App() {
  return (
    <Routes>
      <Route path={url.login()} element={<Login />} />
      <Route
        path={url.main()}
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Main />} />
        <Route path={url.edo()} element={<Edo />}></Route>
        <Route path={url.error()} element={<ErrorPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

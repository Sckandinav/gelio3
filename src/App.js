import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Login } from './Pages/LoginPage';
import { NotFound } from './Pages/NotFound';
import { PrivateRoute } from './Components/hoc/PrivateRoute';
import { Layout } from './Components/Layout/Layout.jsx';
import { url } from './routes/routes';
import { Main } from './Pages/Main.jsx';
import { ErrorPage } from './Pages/ErrorPage.jsx';
import { Edo } from './Pages/Edo.jsx';
import { RoomsList } from './Components/Edo/RoomsList/RoomsList.jsx';
import { EdoRoom } from './Components/Edo/Room/EdoRoom.jsx';
import { Support } from './Pages/Support.jsx';
import { Applications } from './Pages/Applications.jsx';
import { Application } from './Components/Applications/Application/Application.jsx';
import { Payment } from './Pages/Payment.jsx';
import { Chemistry } from './Pages/Chemistry.jsx';
import { CreationPesticide } from './Components/Pesticide/CreationPesticide.jsx';
import { Maps } from './Pages/Maps.jsx';

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
        {/* <Route index element={<Main />} /> */}
        <Route index element={<Navigate to={url.edo()} />} />
        <Route path={url.edo()} element={<Edo />}>
          <Route index element={<Navigate to={url.edoCreated()} />} />
          <Route path="created" element={<RoomsList />} />
        </Route>
        <Route path="room/:id" element={<EdoRoom />} />
        <Route path={url.applications()} element={<Applications />} />
        <Route path="application/:id" element={<Application />} />
        <Route path={url.payment()} element={<Payment />} />
        <Route path={url.chemistry()} element={<Chemistry />} />
        <Route path={url.chemistryAdd()} element={<CreationPesticide />} />
        <Route path={url.maps()} element={<Maps />} />
        <Route path={url.support()} element={<Support />} />
        <Route path={url.error()} element={<ErrorPage />} />
        <Route path={url.notFound()} element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

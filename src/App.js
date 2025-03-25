import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from 'react-router-dom';

import { Login } from './Pages/LoginPage';
import { NotFound } from './Pages/NotFound';
import { PrivateRoute } from './Components/hoc/PrivateRoute';
import { Layout } from './Components/Layout/Layout.jsx';
import { url } from './routes/routes';
// import { Main } from './Pages/Main.jsx';
import { ErrorPage } from './Pages/ErrorPage.jsx';
import { Edo } from './Pages/Edo.jsx';
import { EdoRoom } from './Components/Edo/Room/EdoRoom.jsx';
import { Support } from './Pages/Support.jsx';
import { Applications } from './Pages/Applications.jsx';
import { Application } from './Components/Applications/Application/Application.jsx';
import { Payment } from './Pages/Payment.jsx';
import { Chemistry } from './Pages/Chemistry.jsx';
import { CreationPesticide } from './Components/Pesticide/CreationPesticide.jsx';
import { PesticideItem } from './Components/Pesticide/PesticideItem.jsx';
import { Maps } from './Pages/Maps.jsx';
import { Create } from './Components/Applications/Create/Create.jsx';
import { CreatePayment } from './Components/Payment/CreatePayment.jsx';
import { PaymentItem } from './Components/Payment/PaymentItem.jsx';
import { AccessDenied } from './Pages/NotAccess.jsx';
import { SeedsPages } from './Pages/SeedsPages.jsx';
import { SeedsAdd } from './Components/Seeds/SeedsAdd.jsx';
import { SeedsItem } from './Components/Seeds/SeedsItem.jsx';

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
        </Route>
        <Route path="room/:id" element={<EdoRoom />} />
        <Route path={url.applications()} element={<Applications />} />
        <Route path="application/:id" element={<Application />} />
        <Route path={url.applicationsAdd()} element={<Create />}></Route>

        <Route path={url.payment()} element={<Payment />} />
        <Route path={url.paymentID()} element={<PaymentItem />} />
        <Route path={url.paymentAdd()} element={<CreatePayment />} />

        <Route path={url.chemistry()} element={<Chemistry />} />
        <Route path={url.chemistryAdd()} element={<CreationPesticide />} />
        <Route path={`${url.chemistryPesticideItem()}/:id`} element={<PesticideItem />} />

        <Route path={url.seeds()} element={<SeedsPages />} />
        <Route path={`${url.seeds()}/:id`} element={<SeedsItem />} />
        <Route path={url.seedsAdd()} element={<SeedsAdd />} />

        <Route path={url.maps()} element={<Maps />} />
        <Route path={url.support()} element={<Support />} />
        <Route path={url.error()} element={<ErrorPage />} />
        <Route path={url.notFound()} element={<NotFound />} />
        <Route path={url.noAccess()} element={<AccessDenied />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;

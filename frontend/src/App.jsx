import CustomerNavbar from "./customer/common/CustomerNavbar";
import NewRide from "./customer/new ride/NewRide";
import Footer from './common/Footer';
import MyProfile from "./customer/my profile/MyProfile";
import ActiveRides from "./customer/active rides/ActiveRides";
import PastRides from "./customer/past rides/PastRides";
import Index from './index/Index';
import AdminNavbar from './admin/common/AdminNavbar'
import Overview from './admin/overview/Overview'
import Drivers from './admin/drivers/Drivers'
import Customers from './admin/customers/Customers'
import DriverNavbar from './driver/common/DriverNavbar'
import DriverMyProfile from './driver/my profile/MyProfile'
import DriverPastRides from './driver/past rides/PastRides'
import Orders from './driver/orders/Orders'
import { Roles } from './security/Roles'
import { AuthProvider } from './security/AuthProvider'
import { ProtectedRoute } from './security/ProtectedRoute'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route
            path="/customer/*"
            element={
              <ProtectedRoute
                element={
                  <>
                    <CustomerNavbar />
                    <Routes>
                      <Route index element={<Navigate to="newride" />} />
                      <Route path="/newride" element={<NewRide />} />
                      <Route path="/myprofile" element={<MyProfile />} />
                      <Route path="/activerides" element={<ActiveRides />} />
                      <Route path="/pastrides" element={<PastRides />} />
                      <Route path="*" element={<Navigate to="newride" />} />
                    </Routes>
                    <Footer />
                  </>
                }
                roles={[Roles.CUSTOMER]}
              />
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute
                element={
                  <>
                    <AdminNavbar />
                    <Routes>
                      <Route path="/" element={<Navigate to="overview" />} />
                      <Route path="/overview" element={<Overview />} />
                      <Route path="/drivers" element={<Drivers />} />
                      <Route path="/customers" element={<Customers />} />
                      <Route path="*" element={<Navigate to="overview" />} />
                    </Routes>
                    <Footer />
                  </>
                }
                roles={[Roles.ADMIN]}
              />
            }
          />

          <Route
            path="/driver/*"
            element={
              <ProtectedRoute
                element={
                  <>
                    <DriverNavbar />
                    <Routes>
                      <Route path="/" element={<Navigate to="orders" />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/myprofile" element={<DriverMyProfile />} />
                      <Route path="/pastrides" element={<DriverPastRides />} />
                      <Route path="*" element={<Navigate to="orders" />} />
                    </Routes>
                    <Footer />
                  </>
                }
                roles={[Roles.DRIVER]}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
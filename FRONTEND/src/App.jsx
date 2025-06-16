import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

const RequireAuthentication = lazy(() =>
  import("./components/RequireAuthentication")
);
const InitialLoader = lazy(() => import("./components/InitialLoader"));
const VerifyStatus = lazy(() => import("./components/VerifyStatus"));
const PersistLogin = lazy(() => import("./components/PersistLogin"));
const HouseMapTiler = lazy(() => import("./pages/HouseMapTiler"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const ImagesPage = lazy(() => import("./pages/ImagesPage"));
const Trials = lazy(() => import("./pages/Trials"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const IndividualHouse = lazy(() => import("./pages/IndividualHouse"));
const PostHouse = lazy(() => import("./pages/PostHouse"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Donations = lazy(() => import("./pages/Donations"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/LogIn"));
const Help = lazy(() => import("./pages/Help"));
const Admin = lazy(() => import("./pages/Admin"));
const PersonalInfo = lazy(() => import("./pages/PersonalInfo"));

const ROLES = {
  admin: import.meta.env.VITE_ADMIN_ROLE_CONSTANT,
  landlord: import.meta.env.VITE_LANDLORD_ROLE_CONSTANT,
  tenant: import.meta.env.VITE_TENANT_ROLE_CONSTANT,
};

function App() {
  return (
    <div className="bg-black min-h-screen flex flex-col text-white text-[0.8rem]">
      <Router>
        <Suspense fallback={<InitialLoader fullscreen={true} />}>
          <Routes>
            {/* public routes */}
            <Route index element={<Home />}></Route>
            <Route path="trials" element={<Trials />}></Route>
            <Route path="house/:id" element={<IndividualHouse />}></Route>
            <Route path="images/:id" element={<ImagesPage />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="about-us" element={<AboutUs />}></Route>
            <Route path="contact-us" element={<ContactUs />}></Route>
            <Route path="donate" element={<Donations />}></Route>
            <Route path="signup" element={<SignUp />}></Route>
            <Route path="help" element={<Help />}></Route>
            <Route path="map" element={<HouseMapTiler />}></Route>
            <Route path="unauthorized" element={<Unauthorized />}></Route>

            {/* protected routes */}
            <Route element={<PersistLogin />}>
              <Route
                element={
                  <RequireAuthentication allowedRoles={[ROLES.tenant]} />
                }
              >
                <Route path="profile" element={<Profile />}></Route>
                <Route path="personal" element={<PersonalInfo />}></Route>
              </Route>

              <Route
                element={
                  <RequireAuthentication
                    allowedRoles={[ROLES.admin, ROLES.landlord]}
                  />
                }
              >
                <Route path="post-house" element={<PostHouse />}></Route>
                <Route
                  path="verify-vacancy/:id"
                  element={<VerifyStatus />}
                ></Route>
              </Route>

              <Route
                element={<RequireAuthentication allowedRoles={[ROLES.admin]} />}
              >
                <Route path="admin" element={<Admin />}></Route>
              </Route>
            </Route>

            {/* catch all */}
            <Route path="*" element={<NotFound />}></Route>
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;

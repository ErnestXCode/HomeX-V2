import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import InitialLoader from "./components/InitialLoader";
import VerifyStatus from "./components/VerifyStatus";
// import Posts from "./pages/Posts";
const RequireAuthentication = lazy(() =>
  import("./components/RequireAuthentication")
);
const PersistLogin = lazy(() => import("./components/PersistLogin"));
const ImagesPage = lazy(() => import("./pages/ImagesPage"));
const Trials = lazy(() => import("./pages/Trials"));
const Posts = lazy(() => import("./pages/Posts")); // tengeneza apa inaanza na small letter
const NotFound = lazy(() => import("./pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const IndividualHouse = lazy(() => import("./pages/IndividualHouse"));
const PostHouse = lazy(() => import("./pages/PostHouse"));
const PostHouseNext = lazy(() => import("./pages/PostHouseNext"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Donations = lazy(() => import("./pages/Donations"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/LogIn"));
const Help = lazy(() => import("./pages/Help"));
const Admin = lazy(() => import("./pages/Admin"));
const RecentlyLiked = lazy(() => import("./pages/RecentlyLiked"));
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
            <Route path="unauthorized" element={<NotFound />}></Route>

            {/* protected routes */}
            <Route element={<PersistLogin />}>
              <Route
                element={
                  <RequireAuthentication allowedRoles={[ROLES.tenant]} />
                }
              >
                <Route path="liked" element={<RecentlyLiked />}></Route>
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
                <Route path="post-house-2" element={<PostHouseNext />}></Route>
                <Route path="landlord-posts" element={<Posts />}></Route>
                <Route path="verify-vacancy/:id" element={<VerifyStatus />}></Route>
              </Route>

              <Route
                element={<RequireAuthentication allowedRoles={[ROLES.admin, ROLES.landlord]} />}
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

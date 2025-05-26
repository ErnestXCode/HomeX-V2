import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import InitialLoader from "./components/InitialLoader";
import Layout from "./components/Layout";
import RequireAuth from "./components/requireAuth";
import PersistLogin from "./components/PersistLogin";
// import PersistLogin from "./components/PersistLogin";
const Trials = lazy(() => import("./pages/Trials"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Home = lazy(() => import("./pages/Home"));
const IndividualHouse = lazy(() => import("./pages/IndividualHouse"));
const PostHouse = lazy(() => import("./pages/PostHouse"));
const PostHouseNext = lazy(() => import("./pages/PostHouseNext"));
const SignUp = lazy(() => import("./pages/SignUp"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Auth = lazy(() => import("./pages/Auth"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Donations = lazy(() => import("./pages/Donations"));
const Profile = lazy(() => import("./pages/Profile"));
const Login = lazy(() => import("./pages/LogIn"));
const Help = lazy(() => import("./pages/Help"));
const Admin = lazy(() => import("./pages/Admin"));
const RecentlyLiked = lazy(() => import("./pages/RecentlyLiked"));
const PersonalInfo = lazy(() => import("./pages/PersonalInfo"));

function App() {
  return (
    <Router>
      <Suspense fallback={<InitialLoader fullscreen={true} />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* public routes */}
            <Route index element={<Home />}></Route>
            <Route path="trials" element={<Trials />}></Route>
            <Route path="house/:id" element={<IndividualHouse />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="auth" element={<Auth />}></Route>
            <Route path="about-us" element={<AboutUs />}></Route>
            <Route path="contact-us" element={<ContactUs />}></Route>
            <Route path="donate" element={<Donations />}></Route>
            <Route path="signup" element={<SignUp />}></Route>
            <Route path="help" element={<Help />}></Route>
            <Route path="unauthorized" element={<NotFound />}></Route>

            {/* protected routes */}
           
              {/* <Route element={<RequireAuth allowedRoles={[2004]} />}> */}
                <Route path="liked" element={<RecentlyLiked />}></Route>
                <Route path="profile" element={<Profile />}></Route>
                <Route path="personal" element={<PersonalInfo />}></Route>
              {/* </Route> */}

              {/* <Route element={<RequireAuth allowedRoles={[9923, 1950]} />}> */}
                <Route path="post-house" element={<PostHouse />}></Route>
                <Route path="post-house-2" element={<PostHouseNext />}></Route>
              {/* </Route> */}

              {/* <Route element={<RequireAuth allowedRoles={[1950]} />}> */}
                <Route path="admin" element={<Admin />}></Route>
              {/* </Route> */}
           
          </Route>

          {/* catch all */}
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;

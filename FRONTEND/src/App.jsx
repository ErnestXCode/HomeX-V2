import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Trials from "./pages/Trials";
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

function App() {
  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
      <Router>
        <Suspense fallback={'Loading...'}>
          
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/trials" element={<Trials />}></Route>
            <Route path="/house/:id" element={<IndividualHouse />}></Route>
            <Route path="/post-house" element={<PostHouse />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/admin" element={<Admin />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/about-us" element={<AboutUs />}></Route>
            <Route path="/contact-us" element={<ContactUs />}></Route>
            <Route path="/donate" element={<Donations />}></Route>
            <Route path="/profile" element={<Profile />}></Route>
            <Route path="/help" element={<Help />}></Route>
          </Routes>
        
        </Suspense>
      </Router>
    </div>
  );
}

export default App;

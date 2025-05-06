import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from './components/Home';
import IndividualHouse from './components/IndividualHouse';
import PostHouse from './components/PostHouse';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SignUp from './components/SignUp';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Donations from './components/Donations';
import Profile from './components/Profile';
import Login from './components/LogIn';
import Help from './components/Help';

function App() {

  return (
    <div className='bg-[#333] min-h-screen flex flex-col text-white'>
    <Router>
      <Header />
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/house/:id' element={<IndividualHouse />}></Route>
          <Route path='/post-house' element={<PostHouse />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/signup' element={<SignUp />}></Route>
          <Route path='/about-us' element={<AboutUs />}></Route>
          <Route path='/contact-us' element={<ContactUs />}></Route>
          <Route path='/donate' element={<Donations />}></Route>
          <Route path='/profile' element={<Profile />}></Route>
          <Route path='/help' element={<Help />}></Route>
        </Routes>
        <BottomNav />
    </Router>
    </div>
  );
}

export default App;

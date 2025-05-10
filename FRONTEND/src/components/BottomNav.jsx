import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../features/users/userSlice";

const BottomNav = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <nav className="bg-black/90 p-4 fixed bottom-0 mt-auto md:hidden w-screen">
      <ul className="flex gap-3 justify-around">
        {/* use icons */}
        <li>
          <Link className="p-2" to="/">Home</Link>{" "}
        </li>
        {user?.isLandlord || user?.isAdmin ? (
          <li>
            <Link className="p-2" to="/post-house">Create</Link>{" "}
          </li>
        ) : (
          <li>
            <Link className="p-2" to="/help">Help</Link>{" "}
          </li>
        )}
        <li>
          <Link className="p-2" to="/about-us">About</Link>{" "}
        </li>
          <li>
            <Link className="p-2" to={user ? "/profile" : '/signup'}>Account</Link>{" "}
          </li>
      </ul>
    </nav>
  );
};

export default BottomNav;

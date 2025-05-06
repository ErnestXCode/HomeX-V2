import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectCurrentUser } from "../features/users/userSlice";

const BottomNav = () => {
  const user = useSelector(selectCurrentUser);
  return (
    <nav className="bg-black p-4 sticky bottom-0 mt-auto md:hidden">
      <ul className="flex gap-3 justify-around">
        {/* use icons */}
        <li>
          <Link className="p-2" to="/">Home</Link>{" "}
        </li>
        {user?.isLandlord ? (
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
        {user ? (
          <li>
            <Link className="p-2" to="/profile">Account</Link>{" "}
          </li>
        ) : (
          <li>
            <Link className="p-2" to="/signup">Sign Up</Link>{" "}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default BottomNav;

import React from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuthentication = ({ allowedRoles }) => {
  const currentUser = useSelector(selectCurrentUser);
  const roles = currentUser?.roles;
  const location = useLocation();

  if (!roles)
    return <Navigate to="/login" state={{ from: location }} replace />;
  return roles.find((role) => allowedRoles.includes(role.toString())) ? (
    // make it not compare strings to numbers
    <Outlet />
  ) : currentUser ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuthentication;

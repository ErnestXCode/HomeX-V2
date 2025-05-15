import React from "react";
import { Link } from "react-router-dom";

const RedirectAuth = ({ redirectTo, children }) => {
  return (
    <Link className="border-b-3 border-blue-500 text-blue-200" to={redirectTo}>
      {children}
    </Link>
  );
};

export default RedirectAuth;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
import { selectCurrentUser } from "../features/users/userSlice";
import InitialLoader from "./InitialLoader";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const userInfo = useSelector(selectCurrentUser);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh(); // Calls refresh token endpoint
      } catch (err) {
        console.error("Token refresh failed:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!userInfo?.accessToken) {
      verifyRefreshToken();
    } else {
      setIsLoading(false);
    }
  }, []);

  return isLoading ? <InitialLoader fullscreen={true} /> : <Outlet />;
};

export default PersistLogin;

import React, { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
import { Outlet } from "react-router-dom";
import InitialLoader from "./InitialLoader";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const userInfo = useSelector(selectCurrentUser);

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    !userInfo?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return isLoading ? <InitialLoader fullscreen={true} /> : <Outlet />;
};

export default PersistLogin;

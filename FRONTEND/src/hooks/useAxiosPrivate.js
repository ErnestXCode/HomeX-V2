import { axiosPrivate } from "../api/axios";
import React, { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const userInfo = useSelector(selectCurrentUser);
  console.log('refresh axiosprivate accesstoken', userInfo?.accessToken)

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${userInfo?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          error?.response?.data?.message === "jwt expired" &&
          !prevRequest?.sent
        ) {
          prevRequest.sent = true;
          const newAccessToken = await refresh(); // returns token now
          if (newAccessToken) {
            prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
            return axiosPrivate(prevRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, userInfo?.accessToken]);

  return axiosPrivate;
};

export default useAxiosPrivate;

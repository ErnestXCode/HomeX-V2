import { axiosPrivate } from "../api/axios";

import React, { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const userInfo = useSelector(selectCurrentUser);

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${userInfo?.accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (err) => {
        const prevRequest = err?.config;
        if (
          err.response?.data?.message === "jwt expired" &&
          !prevRequest.sent
        ) {
          prevRequest.sent = true; // custom property
          const newAccessToken = await refresh();
          prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosPrivate(prevRequest);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [refresh, userInfo]);
  return axiosPrivate;
};

export default useAxiosPrivate;

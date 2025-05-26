// import React, { useEffect, useState } from "react";
// import useRefreshToken from "../hooks/useRefreshToken";
// import { useDispatch, useSelector } from "react-redux";
// import { selectCurrentUser, signInSuccess } from "../features/users/userSlice";
// import { Outlet } from "react-router-dom";
// import axios from "../api/axios";

// const PersistLogin = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const refresh = useRefreshToken();
//   const userInfo = useSelector(selectCurrentUser);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const verifyRefreshToken = async () => {
//       try {
//         const { data } = await axios.get("/refresh", { withCredentials: true });
//         const roles = data?.roles;
//         const accessToken = data?.accessToken;

//         dispatch(signInSuccess({ roles, accessToken }));
//         console.log("done refreshing in persist, userinfo is", userInfo);
//       } catch (err) {
//         console.log(err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     !userInfo?.accessToken ? verifyRefreshToken() : setIsLoading(false);
//   }, []);

//   return isLoading ? <p>Loading...</p> : <Outlet />;
// };

// export default PersistLogin;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, signInSuccess } from "../features/users/userSlice";
import { Outlet } from "react-router-dom";
import useRefreshToken from "../hooks/useRefreshToken";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const PersistLogin = () => {
  const [prevSent, setPrevSent] = useState(false);
  const userInfo = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const refresh = useRefreshToken()

  useEffect(() => {
    const handleProfileData = async () => {
      if (userInfo.accessToken) {
        setPrevSent(true);
      }
      if (prevSent === false) {
        
        setPrevSent(true);
        try {
          // const res = await fetch(`${apiBaseUrl}/refresh`, {
          //   method: "GET",
          //   headers: {
          //     "Content-Type": "application/json",
          //   },
          //   credentials: "include",
          // });
          // console.log("response in persist", res);
          // const data = await res.json();
          // console.log("response data in persist refresh", data);
          const data = await refresh()
          console.log('data from refresh custom hook', data)
          const roles = data?.roles;
          const accessToken = data?.accessToken;

          if (!accessToken)
            throw new Error("no accestoken for persistlogin to use");

          dispatch(signInSuccess({ roles, accessToken }));
          console.log("userinfo after dipatch in persist", userInfo);
        } catch (err) {
          console.log("error in persistlogin", err);
        }
      }
    };
    handleProfileData();
  }, [userInfo?.accessToken]);
  console.log('prevSent after useEffect', prevSent)

  console.log('userinfo from persist after useEffect', userInfo)

  const handleLogger = () => {
    console.log(userInfo)
  }
  return (
    <>
      {!prevSent ? <button onClick={handleLogger}>loading...</button> : <Outlet />}
    </>
  );
};

export default PersistLogin;

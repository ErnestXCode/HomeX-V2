import React from "react";
import axios from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, signInSuccess } from "../features/users/userSlice";

// import HandleLogger from "./handleLogger";

const useRefreshToken = () => {
  const dispatch = useDispatch();
  try {
    const refresh = async () => {
      const { data } = await axios.get("/refresh", { withCredentials: true });
      const roles = data?.roles;
      const accessToken = data?.accessToken;
      console.log(data)

      dispatch(signInSuccess({ roles, accessToken }));
    };
    return refresh;
  } catch (err) {
    console.log("error kwa custom hook", err);
  }
};

export default useRefreshToken;

// import React from "react";
// import { useDispatch } from "react-redux";
// import {  signInSuccess } from "../features/users/userSlice";
// const apiBaseUrl = import.meta.env.VITE_API_URL;


// // import HandleLogger from "./handleLogger";

// const useRefreshToken = () => {
//   const dispatch = useDispatch();
//   try {
//     const refresh = async () => {
//       const response = await fetch(`${apiBaseUrl}/refresh`, {
//         method: 'GET', 
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         credentials: 'include'
//        });
//       const data = await response.json()
 
//       console.log('from custom hook', data)

//       dispatch(signInSuccess(data));
//     };
//     return refresh;
//   } catch (err) {
//     console.log("error kwa custom hook", err);
//   }
// };

// export default useRefreshToken;


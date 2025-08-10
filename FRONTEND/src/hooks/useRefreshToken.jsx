import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../features/users/userSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    try {
      const { data } = await axios.get("/refresh", { withCredentials: true });
      const { roles, accessToken, shortLists } = data;

      dispatch(signInSuccess({ roles, accessToken, shortLists }));

      return accessToken; // return it so useAxiosPrivate can retry
    } catch (err) {
      console.error("Error refreshing token:", err);
      throw err;
    }
  };

  return refresh;
};

export default useRefreshToken;

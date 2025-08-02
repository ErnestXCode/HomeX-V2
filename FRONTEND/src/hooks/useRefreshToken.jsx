import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../features/users/userSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    try {
      const { data } = await axios.get("/refresh", {
        withCredentials: true,
      });

      const { roles, accessToken, shortLists } = data;

      dispatch(signInSuccess({ roles, accessToken, shortLists }));
    } catch (err) {
      console.error("Error refreshing token:", err);
      throw err; // Important for PersistLogin to detect failure
    }
  };

  return refresh;
};

export default useRefreshToken;

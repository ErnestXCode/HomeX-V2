import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../features/users/userSlice";
import WelcomeHero from "../components/WelcomeHero";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import CustomForm from "../components/CustomForm";
import axios from "../api/axios";
import SecondaryHeader from "../components/SecondaryHeader";
import { useTranslation } from "react-i18next";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { loading } = useSelector((state) => state.user);
  const location = useLocation();
  console.log(location);

  const emailRef = useRef();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const inputDict = {
    email: "",
    password: "",
  };

  const [inputData, setInputData] = useState(inputDict);

  const handleChange = (e) => {
    setInputData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/login", JSON.stringify(inputData), {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      dispatch(signInSuccess(response.data));
      console.log(response.data);
      // data.data.accessToken

      navigate(location.state.from.pathname, { replace: true });
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const { t } = useTranslation();

  if (!isOnline) {
    return (
      <div className="h-screen w-full flex flex-col">
        <SecondaryHeader>{t("LogIn")}</SecondaryHeader>

        <div className="flex flex-col flex-1 justify-center items-center">
          <h1 className="text-2xl mb-4">{t("YourOffline")}</h1>
          <p className="mb-4">{t("CheckConnection")}</p>
          <button
            className="bg-blue-600 px-4 py-2 rounded-lg"
            onClick={() => window.location.reload()}
          >
            {t("Retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SecondaryHeader>{t("LogIn")}</SecondaryHeader>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        <CustomInputBox
          id={"email"}
          inputRef={emailRef}
          name={"email"}
          value={inputData.email}
          type={"text"} // correct later
          onChange={(e) => handleChange(e)}
        >
          {t("Email")}
        </CustomInputBox>
        <CustomInputBox
          id={"password"}
          name={"password"}
          value={inputData.password}
          type={"password"}
          onChange={(e) => handleChange(e)}
        >
          {t("Password")}
        </CustomInputBox>

        {/* disabled={loading} */}
        {/* {loading ? "Logging In..." : "Log In"} */}
        <div className="mt-4">
          <SubmitButton>{t("LogIn")}</SubmitButton>
        </div>

        <p className="font-serif text-center">
          {" "}
          {t("NotRegistered")}{" "}
          <Link
            className="border-b-3 border-blue-500 text-blue-200"
            to="/signup"
          >
            {t("Register")}
          </Link>
        </p>
      </CustomForm>
    </>
  );
};

export default Login;

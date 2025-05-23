import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../features/users/userSlice";
import WelcomeHero from "../components/WelcomeHero";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import CustomForm from "../components/CustomForm";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { loading } = useSelector((state) => state.user);

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
    dispatch(signInStart());

    try {
      const res = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });
      // look if possible with axios

      if (!res.ok) {
        dispatch(signInFailure("Failed to validate user"));
        return;
      }

      const data = await res.json();
      localStorage.setItem("user", JSON.stringify(data));
      dispatch(signInSuccess(data));
      console.log(data);

      navigate("/");
    } catch (err) {
      console.error("Error:", err.message);
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        <CustomInputBox
          id={"email"}
          inputRef={emailRef}
          name={"email"}
          value={inputData.email}
          type={"email"}
          onChange={(e) => handleChange(e)}
        >
          Email:
        </CustomInputBox>
        <CustomInputBox
          id={"password"}
          name={"password"}
          value={inputData.password}
          type={"password"}
          onChange={(e) => handleChange(e)}
        >
          Password:
        </CustomInputBox>

        {/* disabled={loading} */}
        {/* {loading ? "Logging In..." : "Log In"} */}
        <div className="mt-4">
        <SubmitButton>Log in</SubmitButton>
        </div>

        <p className="mt-4 font-serif text-center">
          {" "}
          Don't have an account?{" "}
          <Link
            className="border-b-3 border-blue-500 text-blue-200"
            to="/signup"
          >
            Sign Up
          </Link>
        </p>
      </CustomForm>
    </>
  );
};

export default Login;

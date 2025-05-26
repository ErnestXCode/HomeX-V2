import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {

  signInSuccess,
} from "../features/users/userSlice";
import WelcomeHero from "../components/WelcomeHero";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import CustomForm from "../components/CustomForm";
import axios from "../api/axios";
import SecondaryHeader from "../components/SecondaryHeader";

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

      navigate("/");
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <>
    <SecondaryHeader>Login</SecondaryHeader>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        <CustomInputBox
          id={"email"}
          inputRef={emailRef}
          name={"email"}
          value={inputData.email}
          type={"text"} // correct later
          onChange={(e) => handleChange(e)}
        >
          Email
        </CustomInputBox>
        <CustomInputBox
          id={"password"}
          name={"password"}
          value={inputData.password}
          type={"password"}
          onChange={(e) => handleChange(e)}
        >
          Password
        </CustomInputBox>

        {/* disabled={loading} */}
        {/* {loading ? "Logging In..." : "Log In"} */}
        <div className="mt-4">
          <SubmitButton>Log in</SubmitButton>
        </div>

        <p className="font-serif text-center">
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

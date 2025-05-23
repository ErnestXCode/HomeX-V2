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
        method: 'POST', 
        credentials: 'include', 
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(inputData)
      });
      // look if possible with axios

      if (!res.ok) {
        dispatch(signInFailure("Failed to validate user"));
        return;
      }

      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data))
      dispatch(signInSuccess(data));
      console.log(data)
  
      navigate("/");
    } catch (err) {
      console.error("Error:", err.message);
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <>
      <WelcomeHero />
      <form
        onSubmit={handleSubmit}
        className="bg-black mb-10 mt-2 p-3 flex flex-col md:w-[700px] md:ml-auto md:mr-auto md:border-0 rounded-2xl"
      >
        <CustomInputBox
          id={"email"}
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
        <SubmitButton>Log in</SubmitButton>

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
      </form>
    </>
  );
};

export default Login;

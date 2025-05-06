import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../features/users/userSlice";

const LogIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const emailRef = useRef();

  useEffect(() => {
    emailRef.current.focus();
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
      const validUser = await axios.post(
        "http://localhost:5000/login",
        inputData
      );

      if (validUser.status !== 200) {
        dispatch(signInFailure("Failed to validate user"));
        return;
      }

      const data = await validUser.data;
      console.log(data);
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.error("Error:", err.message);
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-black mb-10 border-2 mt-2 p-3 flex flex-col md:w-[700px] md:ml-auto md:mr-auto md:border-0 rounded-2xl"
    >
      <div className="m-2 rounded-2xl p-2 bg-blue-600 text-white font-bold">
        
        </div>
      <label className="mt-2 mb-1 font-semibold" htmlFor="email">
        Email:{" "}
      </label>
      <input
        ref={emailRef}
        required
        autoComplete="off"
        onChange={handleChange}
        value={inputData.email}
        name="email"
        type="email"
        id="email"
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <label className="mt-2 mb-1 font-semibold" htmlFor="password">
        Password:{" "}
      </label>
      <input
        onChange={handleChange}
        required
        value={inputData.password}
        autoComplete="off"
        name="password"
        type="password"
        id="password"
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white cursor-pointer hover:bg-blue-500 active:border-3 hover:text-white w-fit text-black border-2 border-black pt-2 pb-2 pr-3 pl-3 mr-auto ml-auto rounded-2xl font-bold"
      >
        {loading ? "Logging In..." : "Log In"}
      </button>

      <p className="mt-4 font-serif">
        {" "}
        Don't have an account?{" "}
        <Link className="border-b-3 border-blue-500 text-blue-200" to="/signup">
          Sign Up
        </Link>
      </p>
    </form>
  );
};

export default LogIn;

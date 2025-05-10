import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../features/users/userSlice";
import WelcomeHero from "../components/WelcomeHero";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const nameRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const inputDict = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  };
  const [inputData, setInputData] = useState(inputDict);
  const [isLandlord, setIsLandLord] = useState(false);

  const handleChange = (e) => {
    setInputData((prevData) => {
      const { name, value } = e.target;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  const handleCheckBoxChange = () => {
    setIsLandLord((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const newUser = await axios.post(`${apiBaseUrl}/users`, {
        ...inputData,
        isLandlord,
      });
      console.log(newUser);

      if (newUser.status !== 200) {
        dispatch(signInFailure("Failed to create user"));
        return;
      }

      const data = await newUser.data;
      console.log(data);
      dispatch(signInSuccess(data));
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
        className="bg-black mb-10 mt-2 p-3 flex flex-col md:w-[700px] md:ml-auto md:mr-auto md:border-0 rounded-2xl"
        onSubmit={handleSubmit}
      >
        <label className="mt-2 mb-1 font-normal" htmlFor="name">
          Name:{" "}
        </label>
        <input
          ref={nameRef}
          name="name"
          required
          value={inputData.name}
          onChange={handleChange}
          type="text"
          id="name"
          className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
        />
        <label className="mt-2 mb-1 font-normal" htmlFor="email">
          Email:{" "}
        </label>
        <input
          name="email"
          value={inputData.email}
          required
          onChange={handleChange}
          type="email"
          id="email"
          autoComplete="off"
          className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
        />
        <label className="mt-2 mb-1 font-normal" htmlFor="phoneNumber">
          Phone number:{" "}
        </label>
        <input
          name="phoneNumber"
          value={inputData.phoneNumber}
          autoComplete="off"
          required
          onChange={handleChange}
          type="text"
          id="phoneNumber"
          className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
        />
        <label className="mt-2 mb-1 font-normal" htmlFor="password">
          Password:{" "}
        </label>
        <input
          name="password"
          value={inputData.password}
          autoComplete="off"
          required
          onChange={handleChange}
          type="password"
          id="password"
          className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
        />
        <section className="flex items-center gap-4 mb-2">
          <input
            name="isLandlord"
            value={isLandlord}
            onChange={handleCheckBoxChange}
            id="isLandlord"
            type="checkbox"
            className="appearance-none w-7 h-7 border-blue-500 border-2 text-white cursor-pointer
        checked:bg-blue-500
        "
          />
          <label htmlFor="isLandlord" className="mt-2 mb-1 font-normal">
            Are you a Landlord ?{" "}
          </label>
        </section>
        <section className="flex justify-around items-center mt-4 mb-4 gap-2">
          <input type="checkbox" name="" id="radio"
           required
          className="appearance-none w-5 h-5 border-blue-400 border-2 text-white cursor-pointer rounded-full
          checked:bg-blue-400 "
            />
          <label htmlFor="radio">
            I have read and agree to accept{" "}
            <span className="text-blue-400 underline">
              <Link to="/">User Agreement</Link>
            </span>
          </label>
        </section>
        <button className="bg-blue-600 mb-2 cursor-pointer hover:bg-blue-500 active:border-3 hover:text-white w-[100%] text-slate-50 border-2 border-black pt-2 pb-2 pr-3 pl-3 mr-auto ml-auto rounded-2xl font-normal">
          Register
        </button>
        <p className="mt-4 font-serif text-center">
          Already have an account?{" "}
          <Link
            className="border-b-3 border-blue-600 text-blue-200"
            to="/login"
          >
            Log In
          </Link>
        </p>
      </form>
    </>
  );
};

export default SignUp;

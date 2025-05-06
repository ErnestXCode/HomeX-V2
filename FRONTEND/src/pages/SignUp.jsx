import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../features/users/userSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const nameRef = useRef();
  const dispatch  = useDispatch()

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  const inputDict = {
    name: "",
    email: "",
    phoneNumber: "",
    password: ""
  };
  const [inputData, setInputData] = useState(inputDict);
  const [isLandlord, setIsLandLord] = useState(false);

  const handleChange = (e) => {
    setInputData((prevData) => {
      const { name, value} = e.target
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
 const handleCheckBoxChange = () => {
  setIsLandLord(prevState => !prevState)
 }
   
 
   const handleSubmit = async (e) => {
     e.preventDefault();
     dispatch(signInStart());
 
     try {
      const newUser = await axios.post("http://localhost:5000/users", inputData);
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

     }}

  return (
    <form
      className="bg-black mb-10 border-2 mt-2 p-3 flex flex-col md:w-[700px] md:ml-auto md:mr-auto md:border-0 rounded-2xl"
      onSubmit={handleSubmit}
    >
      <div className="m-2 rounded-2xl p-2 bg-blue-600 text-white font-bold">
        
      </div>
      <label className="mt-2 mb-1 font-semibold" htmlFor="name">
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
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <label className="mt-2 mb-1 font-semibold" htmlFor="email">
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
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <label className="mt-2 mb-1 font-semibold" htmlFor="phoneNumber">
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
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <label className="mt-2 mb-1 font-semibold" htmlFor="password">
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
        className="bg-blue-300 text-black p-2 pl-3 font-bold rounded-2xl mb-3 border-2 border-white"
      />
      <label htmlFor="isLandlord" className="mt-2 mb-1 font-semibold">
        Are you a Landlord ?{" "}
      </label>
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

      <button className="bg-white cursor-pointer hover:bg-blue-500 active:border-3 hover:text-white w-fit text-black border-2 border-black pt-2 pb-2 pr-3 pl-3 mr-auto ml-auto rounded-2xl font-bold">
        Sign In
      </button>
      <p className="mt-4 font-serif">
        Already have an account?{" "}
        <Link className="border-b-3 border-blue-500 text-blue-200" to="/login">
          Log In
        </Link>
      </p>
    </form>
  );
}

export default SignUp;

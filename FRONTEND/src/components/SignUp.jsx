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
// import WelcomeHero from "./WelcomeHero";
import CustomInputBox from "./CustomInputBox";
import Modal from "./Modal";
import SubmitButton from "./SubmitButton";
import CustomForm from "./CustomForm";
import RedirectAuth from "./RedirectAuth";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const SignUp = () => {
  const navigate = useNavigate();
  const nameRef = useRef();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    nameRef.current?.focus();
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
    console.log('started')
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
      localStorage.setItem("user", JSON.stringify(data));
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (err) {
      console.error("Error:", err);

      dispatch(signInFailure(err.message));
    }
  };

  return (
    <>
      <CustomForm onSubmit={() => handleSubmit()}>
        <CustomInputBox
          id={"name"}
          name={"name"}
          value={inputData.name}
          type={"text"}
          onChange={(e) => handleChange(e)}
        >
          Name:
        </CustomInputBox>
        <CustomInputBox
          id={"email"}
          name={"email"}
          value={inputData?.email}
          type={"email"}
          onChange={(e) => handleChange(e)}
        >
          Email:
        </CustomInputBox>
        <CustomInputBox
          id={"phoneNumber"}
          name={"phoneNumber"}
          value={inputData?.phoneNumber}
          type={"text"}
          onChange={(e) => handleChange(e)}
        >
          Phone number:
        </CustomInputBox>
        <CustomInputBox
          id={"password"}
          name={"password"}
          value={inputData?.password}
          type={"password"}
          onChange={(e) => handleChange(e)}
        >
          Password:
        </CustomInputBox>
        <section className="flex items-center gap-4 mb-2">
          <input
            name="isLandlord"
            value={isLandlord}
            onChange={handleCheckBoxChange}
            id="isLandlord"
            type="checkbox"
            className="appearance-none w-4 h-4 border-blue-500 border-2 text-white cursor-pointer
        checked:bg-blue-500
        "
          />
          <label htmlFor="isLandlord" className="mt-2  mb-1 text-[.8rem]">
            Are you a Landlord ?{" "}
          </label>
        </section>
        <section className="flex justify-around items-center mt-4 mb-4 gap-2">
          <input
            type="checkbox"
            name=""
            id="radio"
            required
            className="appearance-none w-3  h-3 border-blue-400 border-2 text-white cursor-pointer rounded-full
          checked:bg-blue-400 "
          />
          <label htmlFor="radio" className="text-[.8rem]">
            I have read and agree to accept{" "}
            <span className="text-blue-400 underline">
              <button onClick={openModal}>User Agreement</button>
              <Modal isOpen={showModal} onClick={() => closeModal()}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed
                illum quidem, a numquam eum rerum laudantium. Maiores
                perferendis quidem est. Inventore aspernatur ullam optio
                dignissimos deleniti voluptatem iste consequuntur eum.
              </Modal>
            </span>
          </label>
        </section>
        <SubmitButton>Register</SubmitButton>
        <p className="mt-4 font-serif text-center text-[.8rem]">
          Already have an account?{" "}
          <RedirectAuth redirectTo={"/login"}>Log in</RedirectAuth>
        </p>
      </CustomForm>
    </>
  );
};

export default SignUp;

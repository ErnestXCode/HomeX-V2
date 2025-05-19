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
import CustomInputBox from "../components/CustomInputBox";
import Modal from "../components/Modal";
import SubmitButton from "../components/SubmitButton";
import BottomNav from "../components/BottomNav";
import CustomForm from "../components/CustomForm";
import CustomCheckBox from "../components/CustomCheckBox";
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
      console.error("Error:", err.message);

      dispatch(signInFailure(err.message));
    }
  };

  return (
    <>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
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
        <section className="flex items-center gap-4 mb-4 mt-2">
          <CustomCheckBox
            name="isLandlord"
            value={isLandlord}
            onChange={(e) => handleCheckBoxChange(e)}
            id="isLandlord"
          >
            Are you a Landlord ?{" "}
          </CustomCheckBox>
        </section>
        <section className="flex justify-around items-center gap-2">
          <CustomCheckBox
            // name=""
            id="radio"
            // required
          >
            <label htmlFor="radio" className="text-[.65rem]">
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
          </CustomCheckBox>
        </section>
        <SubmitButton>Register</SubmitButton>
        <p className="mt-4 font-serif text-center text-[.8rem]">
          Already have an account?{" "}
          <Link
            className="border-b-3 border-blue-600 text-blue-200"
            to="/login"
          >
            Log In
          </Link>
        </p>
      </CustomForm>
      <BottomNav />
    </>
  );
};

export default SignUp;

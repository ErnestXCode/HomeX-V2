import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CustomInputBox from "../components/CustomInputBox";
import Modal from "../components/Modal";
import SubmitButton from "../components/SubmitButton";
import BottomNav from "../components/BottomNav";
import CustomForm from "../components/CustomForm";
import CustomCheckBox from "../components/CustomCheckBox";
import axios from "../api/axios";
import SecondaryHeader from "../components/SecondaryHeader";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../features/users/userSlice";
import UserAgreement from "../components/UserAgreement";
const landLord_role = import.meta.env.VITE_LANDLORD_ROLE_CONSTANT;
const admin_role = import.meta.env.VITE_ADMIN_ROLE_CONSTANT;
const tenant_role = import.meta.env.VITE_TENANT_ROLE_CONSTANT;

const SignUp = () => {
  const navigate = useNavigate();
  const nameRef = useRef();
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
  const handleCheckBoxChange = (e) => {
    setIsLandLord(e.target.checked);
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newUser = await axios.post(
        "/users",
        JSON.stringify({
          ...inputData,
          roles: isLandlord && {
            landlord: landLord_role,
            admin: admin_role,
          },
        }),
        {
          // put constant like axios post into constant variables maybe even dotenv, look up if it will be bad
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(signInSuccess(newUser.data));

      navigate("/");
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [showModalTwo, setShowModalTwo] = useState(true);
  const [agreed, setAgreed] = useState(false);

  const handleModalAndForm = () => {
    setShowModalTwo(false);
    navigate(-1);
  };

  const handleContinueToSignup = () => {
    setShowForm(true);
  };

  const handleCheckBoxChangeUser = (e) => {
    setAgreed(e.target.checked);
  };
  return (
    <>
      <section className="">
        <>
          <SecondaryHeader>Register</SecondaryHeader>
          {showForm ? (
            <CustomForm onSubmit={(e) => handleSubmit(e)}>
              <CustomInputBox
                id={"name"}
                inputRef={nameRef}
                name={"name"}
                value={inputData.name}
                type={"text"}
                onChange={(e) => handleChange(e)}
              >
                Name
              </CustomInputBox>
              <CustomInputBox
                id={"email"}
                name={"email"}
                value={inputData?.email}
                type={"email"}
                onChange={(e) => handleChange(e)}
              >
                Email
              </CustomInputBox>
              <CustomInputBox
                id={"phoneNumber"}
                name={"phoneNumber"}
                value={inputData?.phoneNumber}
                type={"text"}
                onChange={(e) => handleChange(e)}
              >
                Phone number
              </CustomInputBox>
              <CustomInputBox
                id={"password"}
                name={"password"}
                value={inputData?.password}
                type={"password"}
                onChange={(e) => handleChange(e)}
              >
                Password
              </CustomInputBox>

              <SubmitButton>Register</SubmitButton>
              <p className="font-serif text-center text-[.8rem]">
                Already have an account?{" "}
                <Link
                  className="border-b-3 border-blue-600 text-blue-200"
                  to="/login"
                >
                  Log In
                </Link>
              </p>
            </CustomForm>
          ) : (
            <Modal
              borderTop={true}
              isOpen={showModalTwo}
              onClick={() => handleModalAndForm()}
            >
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
                  onChange={(e) => handleCheckBoxChangeUser(e)}
                >
                  <label htmlFor="radio" className="text-[.65rem]">
                    I have read and agree to accept{" "}
                    <span className="text-blue-400 underline">
                      <button onClick={openModal}>User Agreement</button>
                      <Modal isOpen={showModal} onClick={() => closeModal()}>
                        <div className="bg-gray-950 text-white border-t-1 rounded-3xl p-3">
                          <div>
                            Lorem ipsum dolor sit, amet consectetur adipisicing
                            elit. Est reiciendis in ullam doloribus ratione eius
                            itaque excepturi molestiae. Ratione animi libero,
                            voluptates suscipit enim nulla incidunt blanditiis
                            eos exercitationem doloremque. Illum maxime porro,
                            facere nihil exercitationem, facilis qui vel at
                            quaerat totam numquam, pariatur voluptate quas modi
                            nulla beatae ea. Ad molestiae earum ipsum nam odio
                            quibusdam dolores quo eaque? Nesciunt, ver minus
                            aliquid delectus dolore explicabo corrupti fugiat
                            non adipisci magnam quo natus recusandae fugit
                            voluptate consequatur maxime doloremque, culpa
                            cumque blanditiis! Cupiditate minima at saepe illum
                            quod.
                          </div>
                          <button
                            onClick={() => setAgreed(true)}
                            className="w-full bg-blue-600 text-white p-2 mt-4 rounded-2xl"
                          >
                            Agree
                          </button>
                        </div>
                      </Modal>
                    </span>
                  </label>
                </CustomCheckBox>
              </section>
              <button
                disabled={!agreed}
                className={`w-full p-2 bg-blue-600 mt-4 rounded-2xl disabled:bg-blue-600/50 disbaled:text-white/50`}
                onClick={handleContinueToSignup}
              >
                Continue
              </button>
            </Modal>
          )}
          <BottomNav />
        </>
      </section>
    </>
  );
};

export default SignUp;

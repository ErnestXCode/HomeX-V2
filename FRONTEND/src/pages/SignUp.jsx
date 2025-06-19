import React, { useRef, useState } from "react";
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
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
const landLord_role = import.meta.env.VITE_LANDLORD_ROLE_CONSTANT;
const admin_role = import.meta.env.VITE_ADMIN_ROLE_CONSTANT;

const SignUp = () => {
  // states and vars
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nameRef = useRef();

  const [submitState, setSubmitState] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showModalTwo, setShowModalTwo] = useState(true);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (showForm) nameRef.current?.focus();
  }, [showForm]);

  // modal specify where its for exactly
  const [showUserAgreementModal, setShowUserAgreementModal] = useState(false);
  const openModal = () => {
    setShowUserAgreementModal(true);
  };
  const closeModal = () => {
    setShowUserAgreementModal(false);
  };

  // input state
  const inputDict = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  };
  const [inputData, setInputData] = useState(inputDict);
  const [isLandlord, setIsLandLord] = useState(null);

  const handleChange = (e) => {
    setInputData((prevData) => {
      const { name, value } = e.target;
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  // use radio
  const handleCheckBoxChange = (e) => {
    setIsLandLord(e.target.checked);
  };

  // submit, name properly

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLandlord) setSubmitState(1);

    if (submitState === 0) {
      setSubmitState(1);
      return;
    }
    // make sure number is okay and email as well after sending in backend or frontend

    try {
      const newUser = await axios.post(
        "/users",
        JSON.stringify({
          ...inputData,
          roles: isLandlord && {
            landlord: landLord_role,
            // get rid of admin in production
            // admin: admin_role,
          },
        }),
        {
          // put constant like axios post into constant variables maybe even dotenv, look up if it will be bad '/users'
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      dispatch(signInSuccess(newUser.data));

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

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

  console.log(isLandlord);

  const { t } = useTranslation();

  return (
    <>
      <section className="">
        <>
          <SecondaryHeader>{t("Register")}</SecondaryHeader>
          {showForm ? (
            <CustomForm onSubmit={(e) => handleSubmit(e)}>
              {submitState === 0 ? (
                <>
                  <CustomInputBox
                    id={"name"}
                    inputRef={nameRef}
                    name={"name"}
                    value={inputData.name}
                    type={"text"}
                    onChange={(e) => handleChange(e)}
                  >
                    {t("Name")}
                  </CustomInputBox>
                  <CustomInputBox
                    id={"email"}
                    name={"email"}
                    value={inputData?.email}
                    type={"email"}
                    onChange={(e) => handleChange(e)}
                  >
                    {t("Email")}
                  </CustomInputBox>
                  <CustomInputBox
                    id={"password"}
                    name={"password"}
                    value={inputData?.password}
                    type={"password"}
                    onChange={(e) => handleChange(e)}
                  >
                    {t("Password")}
                  </CustomInputBox>
                  <SubmitButton>
                    {isLandlord ? "Next" : "Register"}
                  </SubmitButton>{" "}
                </>
              ) : (
                <>
                  <CustomInputBox
                    inputRef={nameRef}
                    id={"phoneNumber"}
                    name={"phoneNumber"}
                    value={inputData?.phoneNumber}
                    type={"number"}
                    onChange={(e) => handleChange(e)}
                  >
                    {t("PhoneNumber")}
                  </CustomInputBox>
                  <ul className="p-4 pl-10 list-disc">
                    <li></li>
                    <li></li>
                  </ul>
                  <SubmitButton>{t("Register")}</SubmitButton>
                </>
              )}

              <p className="font-serif text-center text-[.8rem]">
                {t("AlreadyRegistered")}{" "}
                <Link
                  className="border-b-3 border-blue-600 text-blue-200"
                  to="/login"
                >
                  {t("LogIn")}
                </Link>
              </p>
            </CustomForm>
          ) : (
            <Modal
              borderTop={true}
              isOpen={showModalTwo}
              onClick={() => handleModalAndForm()}
            >
              <div className="text-center text-base mb-3">
                {t("AreYouLandlord")}
              </div>
              <section className="mb-4 mt-2 bg-gray-900 p-2 pt-3 pb-3 rounded-2xl">
                <section className="w-full flex items-end justify-around">
                  <CustomCheckBox
                    radioBtn={true}
                    name="isLandlord"
                    value={isLandlord}
                    onChange={(e) => handleCheckBoxChange(e)}
                    id="isLandlord"
                    disableFullWidth={true}
                  >
                    {t("Yes")}{" "}
                  </CustomCheckBox>

                  <CustomCheckBox
                    radioBtn={true}
                    onChange={() => setIsLandLord(false)}
                    name="isLandlord"
                    disableFullWidth={true}
                  >
                    {t("No")}{" "}
                  </CustomCheckBox>
                </section>
              </section>
              <section className="flex justify-around items-center gap-2">
                <CustomCheckBox
                  // name=""
                  id="radio"
                  // required
                  onChange={(e) => handleCheckBoxChangeUser(e)}
                >
                  <label htmlFor="radio" className="text-[.65rem]">
                    {t("AgreeUserAgreement")}{" "}
                    <span className="text-blue-400 underline">
                      <button onClick={openModal}>{t("UserAgreement")}</button>
                      {showUserAgreementModal && (
                        <div className="pt-50">
                          <Modal
                            isOpen={showUserAgreementModal}
                            onClick={() => closeModal()}
                          >
                            <div className="bg-gray-950 text-white border-t-1 rounded-3xl p-3 ">
                              <div>
                                Lorem ipsum dolor sit, amet consectetur
                                adipisicing elit. Est reiciendis in ullam
                                doloribus ratione eius itaque excepturi
                                molestiae. Ratione animi libero, voluptates
                                suscipit enim nulla incidunt blanditiis eos
                                exercitationem doloremque. Illum maxime porro,
                                facere nihil exercitationem, facilis qui vel at
                                quaerat totam numquam, pariatur voluptate quas
                                modi nulla beatae ea. Ad molestiae earum ipsum
                                nam odio quibusdam dolores quo eaque? Nesciunt,
                                ver minus aliquid delectus dolore explicabo
                                corrupti fugiat non adipisci magnam quo natus
                                recusandae fugit voluptate consequatur maxime
                                doloremque, culpa cumque blanditiis! Cupiditate
                                minima at saepe illum quod.
                              </div>
                              <button
                                onClick={() => {
                                  setAgreed(true);
                                  setShowUserAgreementModal(false);
                                }}
                                className="w-full bg-blue-600 text-white p-2 mt-4 rounded-2xl"
                              >
                                {t("Agree")}
                              </button>
                            </div>
                          </Modal>
                        </div>
                      )}
                    </span>
                  </label>
                </CustomCheckBox>
              </section>
              <button
                disabled={isLandlord === null || !agreed}
                className={`w-full p-2 bg-blue-600 mt-4 rounded-2xl disabled:bg-blue-600/50 disbaled:text-white/50`}
                onClick={handleContinueToSignup}
              >
                {t("Continue")}
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

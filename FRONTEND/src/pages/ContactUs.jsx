import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomForm from "../components/CustomForm";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import SecondaryHeader from "../components/SecondaryHeader";
import { useTranslation } from "react-i18next";

const ContactUs = () => {
  const { t } = useTranslation();
  const nameRef = useRef();
  const inputDict = {
    name: "",
    email: "",
    message: "",
  };
  const navigate = useNavigate();
  const [inputData, setInputData] = useState(inputDict);
  const handleSubmit = (e) => {
    e.preventDefault();
    // do something
    console.log(inputData.message);
    navigate("/");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    nameRef.current?.focus();
  }, []);
  return (
    <>
      <SecondaryHeader>{t("ContactUs")}</SecondaryHeader>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        <CustomInputBox
          ref={nameRef}
          name="name"
          required
          value={inputData.name}
          onChange={handleChange}
          type="text"
          id="name"
          className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
        >
          {t("Name")}
        </CustomInputBox>

        <CustomInputBox
          name="email"
          value={inputData.email}
          required
          onChange={handleChange}
          type="email"
          id="email"
          autoComplete="off"
          className="bg-gray-700 text-slate-50 p-2 pl-3 font-normal rounded-2xl mb-3 border-2 border-blue-600"
        >
          {t("Email")}
        </CustomInputBox>

        <label className="m-5 mt-3 mb-0 font-normal" htmlFor="message">
          Message
        </label>
        <textarea
          rows="5"
          name="message"
          value={inputData.message}
          required
          onChange={handleChange}
          type="text"
          id="message"
          className="bg-gray-700 m-3 mb-4 text-slate-50 p-2 pl-3 font-normal rounded-3xl"
        />

        <SubmitButton>Send message</SubmitButton>
      </CustomForm>
    </>
  );
};

export default ContactUs;

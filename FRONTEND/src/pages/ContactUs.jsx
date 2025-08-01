import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomForm from "../components/CustomForm";
import CustomInputBox from "../components/CustomInputBox";
import SubmitButton from "../components/SubmitButton";
import SecondaryHeader from "../components/SecondaryHeader";
import { useTranslation } from "react-i18next";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const { t } = useTranslation();
  const nameRef = useRef();
  const navigate = useNavigate();

  const [inputData, setInputData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_5hs4i26",       // ✅ your Service ID
        "template_1maciu4",      // ✅ your Template ID
        {
          from_name: inputData.name,
          reply_to: inputData.email,
          message: inputData.message,
        },
        "f2ZFzPg9nvkUFnjIX"       // ✅ your Public Key
      )
      .then(() => {
        alert("Message sent successfully!");
        setInputData({ name: "", email: "", message: "" });
        navigate("/");
      })
      .catch((error) => {
        console.error("Failed to send message:", error);
        alert("Something went wrong. Try again.");
      });
  };

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  return (
    <>
      <SecondaryHeader>{t("ContactUs")}</SecondaryHeader>
      <CustomForm onSubmit={handleSubmit}>
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
          id="message"
          className="bg-gray-700 m-3 mb-4 text-slate-50 p-2 pl-3 font-normal rounded-3xl"
        />

        <SubmitButton>Send message</SubmitButton>
      </CustomForm>
    </>
  );
};

export default ContactUs;

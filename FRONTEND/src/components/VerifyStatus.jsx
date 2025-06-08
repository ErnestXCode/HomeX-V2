import React, { useState } from "react";
import CustomForm from "./CustomForm";
import CustomInputBox from "./CustomInputBox";
import SecondaryHeader from "./SecondaryHeader";
import SubmitButton from "./SubmitButton";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/users/userSlice";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const VerifyStatus = () => {
  const [numOfHouses, setNumOfHouses] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const userInfo = useSelector(selectCurrentUser);

  const handleChange = (e) => {
    setNumOfHouses(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // make an api call
    console.log(numOfHouses);
    if (numOfHouses === null) return;
    try {
      const res = await fetch(`${apiBaseUrl}/verify?id=${id}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo?.accessToken}`,
        },
        body: JSON.stringify({numOfHouses}),
      });

      const data = await res.json();
      console.log(data);
      navigate(-1);
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div>
      <SecondaryHeader>Verify Vacancy</SecondaryHeader>
      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        <CustomInputBox
          name={"numOfHouses"}
          value={numOfHouses}
          onChange={(e) => handleChange(e)}
          type={"number"}
          id={"numOfHouses"}
        >
          How many rooms available
        </CustomInputBox>
        <SubmitButton>Verify</SubmitButton>
      </CustomForm>
    </div>
  );
};

export default VerifyStatus;

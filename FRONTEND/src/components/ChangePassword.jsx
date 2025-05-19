import React from "react";
import CustomForm from "./CustomForm";
import CustomInputBox from "./CustomInputBox";
import SubmitButton from "./SubmitButton";

const ChangePassword = () => {
  return (
    <CustomForm>
      <CustomInputBox>Enter old password</CustomInputBox>
      <CustomInputBox>Enter new password</CustomInputBox>
      <CustomInputBox>Confirm new password</CustomInputBox>
      <div className="mt-2">
        <SubmitButton>Change password</SubmitButton>
      </div>
    </CustomForm>
  );
};

export default ChangePassword;

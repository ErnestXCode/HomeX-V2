import React from 'react'
import CustomForm from './CustomForm'
import CustomInputBox from './CustomInputBox'
import SubmitButton from './SubmitButton'

const ChangeUsername = () => {
  return (
    <CustomForm>
      <CustomInputBox>Enter new username</CustomInputBox>
      <SubmitButton>Change username</SubmitButton>
    </CustomForm>
  )
}

export default ChangeUsername

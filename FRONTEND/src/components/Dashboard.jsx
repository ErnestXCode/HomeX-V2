import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import CustomForm from "./CustomForm";
import CustomInputBox from "./CustomInputBox";
import SubmitButton from "./SubmitButton";
import ViewButton from "./ViewButton";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const UserData = useQuery({
    queryKey: ["users"],
    queryFn: async () => await axios.get(`${apiBaseUrl}/users`),
  });
  const HouseData = useQuery({
    queryKey: ["houses"],
    queryFn: async () => await axios.get(`${apiBaseUrl}/houses`),
  });
  // console.log('housedata', HouseData?.data?.data)

  const AllHouses = HouseData?.data?.data;
  const AllUsers = UserData?.data?.data;
  const numOfAllUsers = AllUsers?.length;
  const numOfAllHouses = AllHouses?.length;

  const [area, setArea] = useState("");
  const handleChange = (e) => {
    setArea(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiBaseUrl}/areas`, { area });
      const data = res?.data;
      console.log("successful", data);
    } catch (err) {
      console.log("Error", err);
    }
    setArea("");
  };
  const queryClient = new QueryClient();

  useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => queryClient.invalidateQueries("areas"),
  });
  const { data } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => await axios.get(`${apiBaseUrl}/areas`),
  });
  const AllAreas = data?.data.map((area) => (
    <div
      className="flex items-center justify-between mt-1 p-1 pb-2 border-b"
      key={area._id}
    >
      <p>{area.area}</p>
      <ViewButton>Delete</ViewButton>
    </div>
  ));

  return (
    <>
      <h1 className="font-bold text-2xl text-center m-2">Dashboard</h1>
      <nav>
        <ul className="flex justify-around items-center">
          <li>Areas</li>
          <li>Users</li>
          <li>Houses</li>
        </ul>
      </nav>
      <h2 className="font-semibold m-2 mt-4 text-center">
        Number Users and Houses
      </h2>
      <div className="bg-gray-900 m-2 p-3 rounded-2xl bottom-b-1">
        Users : {numOfAllUsers}
        <br />
        Houses : {numOfAllHouses}
      </div>
      <h2 className="font-semibold m-2 mt-4 text-center">
        Area CRUD Operations
      </h2>

      <CustomForm onSubmit={(e) => handleSubmit(e)}>
        <CustomInputBox
          name={"area"}
          value={area}
          onChange={(e) => handleChange(e)}
          type={"text"}
          id={"area"}
        >
          Add area
        </CustomInputBox>
        <div className="p-3">
          <SubmitButton>Create</SubmitButton>
        </div>
      </CustomForm>
      <div className="m-2 p-2">{AllAreas}</div>
    </>
  );
};

export default Dashboard;

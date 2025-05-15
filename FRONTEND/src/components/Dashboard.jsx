import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import React from "react";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {

const UserData = useQuery({
  queryKey: ['users'], 
  queryFn: async() =>  await axios.get(`${apiBaseUrl}/users`)
})
const HouseData = useQuery({
  queryKey: ['houses'], 
  queryFn: async() =>  await axios.get(`${apiBaseUrl}/houses`)
})

const AllHouses = HouseData?.data?.data
const AllUsers = UserData?.data?.data
const numOfAllUsers = AllUsers?.length
const numOfAllHouses = AllHouses?.length

  return (
   <div>
    Users : {numOfAllUsers}
    <br />
    Houses : {numOfAllHouses}
   </div>
  );
};

export default Dashboard;

import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import CustomForm from "./CustomForm";
import CustomInputBox from "./CustomInputBox";
import SubmitButton from "./SubmitButton";
import ViewButton from "./ViewButton";
import BottomNav from "./BottomNav";
import { selectCurrentUser } from "../features/users/userSlice";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  CartesianAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useSelector } from "react-redux";
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
  // const numOfAllHouses = AllHouses?.length;

  const [area, setArea] = useState("");
  const handleChange = (e) => {
    setArea(e.target?.value);
  };

  const userInfo = useSelector(selectCurrentUser);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${apiBaseUrl}/areas`,
        { area },
        {
          withCredentials: true,
          headers: {
            Authrization: `Bearer ${userInfo.accessToken}`,
          },
        }
      );
      const data = res?.data;
      console.log("successful", data);
    } catch (err) {
      console.log("Error", err);
    }
    setArea("");
  };
  const queryClient = new QueryClient();

  const sumn = useMutation({
    mutationFn: handleSubmit,
    onSuccess: () => queryClient.invalidateQueries("areas"),
  });
  const { data } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => await axios.get(`${apiBaseUrl}/areas`),
  });
  const AllAreas = data?.data.map((area) => (
    <div
      className="flex items-center justify-between mt-1 p-1 pb-2 border-b border-gray-500"
      key={area?._id}
    >
      <p>{area?.area}</p>
      <ViewButton>Delete</ViewButton>
    </div>
  ));

  const [display, setDisplay] = useState("displayUsers");

  const displayUsers = () => {
    setDisplay("displayUsers");
  };

  const displayAreas = () => {
    setDisplay("displayAreas");
  };
  const displayHouses = () => {
    setDisplay("displayHouses");
  };
  let AllTenants = 0;
  let AllLandLords = 0;
  if (AllUsers) {
    AllTenants = AllUsers.filter((user) => user?.isLandlord === false)?.length;
    AllLandLords = AllUsers.filter((user) => user?.isLandlord === true)?.length;
  }

  console.log(AllUsers);

  const dummydata = [
    {
      roles: 3,
      name: "nester",
    },
    {
      roles: 2,
      name: "kama",
    },
    {
      roles: 1,
      name: "john",
    },
    {
      roles: 6,
      name: "john",
    },
    {
      roles: 10,
      name: "john",
    },
    {
      roles: 11,
      name: "john",
    },
    {
      roles: 5,
      name: "john",
    },
    {
      roles: 1,
      name: "john",
    },
    {
      roles: 13,
      name: "john",
    },
    {
      roles: 1,
      name: "john",
    },
    {
      roles: 3,
      name: "ksos",
    },
  ];

  const userOverall = (
    <>
      <h2 className="font-semibold m-2 mt-4 text-center">
        Number of Users, tenants and Landlords
      </h2>
      <div className="bg-gray-900 m-2 p-3 rounded-2xl bottom-b-1 flex items-center justify-around w-full">
        <div> Users : {numOfAllUsers}</div>
        <div>Tenants : {AllTenants}</div>
        <div> Landlords :{AllLandLords}</div>
      </div>
        <div>DUMMY DATA</div>
        <div className="w-full p-1 pr-8 h-64">
             <ResponsiveContainer height={"100%"} width={"100%"}>
               <BarChart width={48} height={48} data={dummydata}>
                 <Bar dataKey="roles" fill="#00f" />
                 <CartesianGrid stroke="#333" strokeOpacity={"50%"} />
                 <YAxis />
                 <XAxis />
                 <Tooltip />
                 <Legend />
               </BarChart>
             </ResponsiveContainer>
           </div>

      <h2 className="font-semibold m-2 mt-4 text-center">Create an Admin</h2>
      <CustomForm>
        <CustomInputBox>Create Admin</CustomInputBox>
        <div className="p-3">
          <SubmitButton>Create</SubmitButton>
        </div>
      </CustomForm>
    </>
  );

  const areaOverall = (
    <>
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

  const houseOverall = <>HouseData should be here</>;

  const displayOverall =
    display === "displayUsers"
      ? userOverall
      : display === "displayAreas"
      ? areaOverall
      : houseOverall;

  return (
    <>
      <h1 className="font-bold text-2xl text-center m-2">Dashboard</h1>
      <nav>
        <ul className="flex justify-around items-center">
          <li>
            <button onClick={displayAreas}>Areas</button>
          </li>
          <li>
            <button onClick={displayUsers}>Users</button>
          </li>
          <li>
            <button onClick={displayHouses}>Houses</button>
          </li>
        </ul>
      </nav>

      {displayOverall}
      <BottomNav />
    </>
  );
};

export default Dashboard;

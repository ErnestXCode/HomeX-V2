import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CustomInputBox from "./CustomInputBox";
import Modal from "./Modal";
import SubmitButton from "./SubmitButton";
import BottomNav from "./BottomNav";
import CustomForm from "./CustomForm";
import CustomCheckBox from "./CustomCheckBox";
import axios from "../api/axios";
import SecondaryHeader from "./SecondaryHeader";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { signInSuccess } from "../features/users/userSlice";
const landLord_role = import.meta.env.VITE_LANDLORD_ROLE_CONSTANT;
const admin_role = import.meta.env.VITE_ADMIN_ROLE_CONSTANT;

const COLORS = ["#60a5fa", "#38bdf8", "#0ea5e9"];

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [areaName, setAreaName] = useState("");
  const [editingAreaId, setEditingAreaId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const nameRef = useRef();

  const inputDict = {
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  };
  const [inputData, setInputData] = useState(inputDict);

  const { data: summary, isLoading: loadingSummary } = useQuery({
    queryKey: ["summary"],
    queryFn: async () => {
      const res = await axios.get(`/summary`, { withCredentials: true });
      return res.data;
    },
  });

  const { data: roles, isLoading: loadingRoles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await axios.get(`/role-distribution`, {
        withCredentials: true,
      });
      return res.data;
    },
  });

  const { data: housesByArea, isLoading: loadingHouses } = useQuery({
    queryKey: ["housesByArea"],
    queryFn: async () => {
      const res = await axios.get(`/houses-by-area`, { withCredentials: true });
      return res.data;
    },
  });

  const { data: allAreas, isLoading: loadingAreas } = useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const res = await axios.get(`/areas`, { withCredentials: true });
      return res.data;
    },
  });

  const createArea = useMutation({
    mutationFn: async (newArea) => {
      return await axios.post(`/areas`, newArea, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["areas"]);
      setAreaName("");
    },
    onError: (err) => {
      alert(
        "Error creating area: " + err?.response?.data?.message || err.message
      );
    },
  });

  const deleteArea = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`/areas/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["areas"]);
    },
  });

  const updateArea = useMutation({
    mutationFn: async ({ id, area }) => {
      return await axios.patch(
        `/areas/${id}`,
        { area },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      setEditingAreaId(null);
      queryClient.invalidateQueries(["areas"]);
    },
  });

  const transformedRoles = Array.isArray(roles)
    ? roles
    : roles && typeof roles === "object"
    ? Object.entries(roles).map(([role, count]) => ({ role, count }))
    : [];

  if (loadingSummary || loadingRoles || loadingHouses || loadingAreas) {
    return (
      <div className="text-white text-center p-4">Loading dashboard...</div>
    );
  }

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

  // submit, name properly

  const handleSubmit = async (e) => {
    e.preventDefault();
    // make sure number is okay and email as well after sending in backend or frontend

    try {
      const newUser = await axios.post(
        "/users",
        JSON.stringify({
          ...inputData,
          roles: {
            landlord: landLord_role,
            admin: admin_role,
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
      console.log(newUser)

    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 space-y-8">
      <h1 className="text-2xl font-bold text-center text-blue-400">
        Admin Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          Users: {summary.users}
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          Tenants: {summary.tenants}
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          Landlords: {summary.landlords}
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          Admins: {summary.admins}
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          Houses: {summary.houses}
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          Areas: {summary.areas}
        </div>
        <div className="bg-gray-800 p-4 rounded-2xl shadow">
          Revenue: KES {summary.totalRevenue}
        </div>
      </div>

      {/* Role Distribution */}
      <div className="w-full h-96 bg-gray-800 rounded-2xl shadow p-4">
        <h2 className="text-center font-semibold text-blue-300 mb-2">
          User Role Distribution
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={transformedRoles}
              dataKey="count"
              nameKey="role"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {transformedRoles.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", color: "white" }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Houses by Area */}
      <div className="w-full h-96 bg-gray-800 rounded-2xl shadow p-4">
        <h2 className="text-center font-semibold text-blue-300 mb-2">
          Houses by Area
        </h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={housesByArea}>
            <XAxis dataKey="area" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1f2937", color: "white" }}
            />
            <Legend />
            <Bar dataKey="totalHouses" fill="#3b82f6" name="Total Houses" />
            <Bar dataKey="vacantHouses" fill="#0ea5e9" name="Vacant Houses" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Area Management */}
      <div className="bg-gray-800 p-4 rounded-2xl shadow">
        <h2 className="text-center font-semibold text-blue-300 mb-4">
          Manage Areas
        </h2>
        {/* Create */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (areaName.trim()) createArea.mutate({ area: areaName.trim() });
          }}
          className="flex flex-col sm:flex-row gap-2 items-center justify-center"
        >
          <input
            type="text"
            placeholder="Enter area name"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
            className="bg-gray-700 text-white p-2 rounded w-full sm:w-1/2 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white font-semibold"
          >
            Add Area
          </button>
        </form>

        {/* Area List */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {allAreas?.map((area) => (
            <div
              key={area._id}
              className="bg-gray-700 p-3 rounded flex items-center justify-between"
            >
              {editingAreaId === area._id ? (
                <div className="flex-grow mr-2 flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-gray-800 text-white p-1 px-2 rounded w-full"
                  />
                  <button
                    onClick={() =>
                      updateArea.mutate({ id: area._id, area: editedName })
                    }
                    className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingAreaId(null)}
                    className="bg-gray-500 hover:bg-gray-600 px-2 py-1 rounded text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-white">{area.area}</span>
                  <div className="space-x-2">
                    <button
                      onClick={() => {
                        setEditingAreaId(area._id);
                        setEditedName(area.area);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Delete this area?")) {
                          deleteArea.mutate(area._id);
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <>
        <section className="">
          <>
            <SecondaryHeader>Create Admin</SecondaryHeader>
            {
              <CustomForm onSubmit={(e) => handleSubmit(e)}>
                {
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
                    <SubmitButton>Create </SubmitButton>{" "}
                  </>
                }

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
            }
            <BottomNav />
          </>
        </section>
      </>
    </div>
  );
};

export default Dashboard;

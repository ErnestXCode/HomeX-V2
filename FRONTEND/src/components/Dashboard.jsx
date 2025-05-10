import axios from "axios";

import React, { useEffect, useState } from "react";
const apiBaseUrl = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const dashboardInfo = {
    AllUsers: [],
    tenants: [],
    landlords: [],
    AllHouses: [],
    noOfAllUsers: 0,
    noOfHouses: 0,
    noOfLandlords: 0,
    noOfTenants: 0,
  };
  const [dashboardDisplay, setdashboardDisplay] = useState(dashboardInfo);
  // const [reloader, setReloader] = useState(true)

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/users`)
      .then((res) =>
        setdashboardDisplay((prevData) => {
          return {
            ...prevData,
            AllUsers: res.data,
          };
        })
      )
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`${apiBaseUrl}/houses`)
      .then((res) =>
        setdashboardDisplay((prevData) => {
          return {
            ...prevData,
            AllHouses: res.data,
          };
        })
      )
      .catch((err) => console.log(err));
  }, []);

  const { AllHouses, AllUsers } = dashboardDisplay;

  // useEffect(() => {
  //   setdashboardDisplay((prevData) => {
  //     return {
  //       ...prevData,
  //       noOfAllUsers: dashboardDisplay?.AllUsers?.length,
  //       noOfHouses: dashboardDisplay?.AllHouses?.length,
  //     };
  //   });
  // }, []);


  const [display, setDisplay] = useState([]);

  const chooseDisplay = (filter) => {
    if (filter === "houses") {
      setDisplay(AllHouses);
    } else if (filter === "users") {
      setDisplay(AllUsers);
    } else {
      setDisplay([]);
    }
  };

  // const handleDelete = async (id) => {try {
  //   const res = await axios.delete(`http://localhost:5000/users/${id}`)
  //   setReloader(prevState => !prevState)
  //   console.log(res)
  // } catch (err) {
  //   console.log(err)
  // }
  // }

  const chosenDisplay =display ?  display.map(item => <div className="bg-[#333] p-3 m-2 flex items-center" key={item._id}><p className="mr-auto">{item.area ? item.area : item.email}</p>
  {/* <button onClick={() => handleDelete(item._id)} className="bg-black p-2 active:bg-black/70">{item.email ? 'delete':''}</button> */}
    
  </div>) : <p>Nothing to Show here</p>

  return (
    <div>
      <nav>
        <ul className="flex justify-around">
          <li>
            <button onClick={() => chooseDisplay("houses")}>Houses</button>{" "}
            {dashboardDisplay?.noOfHouses}
          </li>
          <li>
            <button onClick={() => chooseDisplay("users")}>Users</button>{" "}
            {dashboardDisplay?.noOfAllUsers}
          </li>
          <li>
            <button>Landlords</button> {dashboardDisplay?.noOfLandlords}{" "}
          </li>
          <li>
            <button>Tenants</button> {dashboardDisplay?.noOfTenants}
          </li>
          {/* this wil set some state which will display what we want */}
        </ul>
      </nav>
      {chosenDisplay}
    </div>
  );
};

export default Dashboard;

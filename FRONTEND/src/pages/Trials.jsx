import React, { useEffect, useRef, useState } from "react";

const Trials = () => {
  const [data, setData] = useState("");

const handleLogs = () => {
    const success = (pos) => {
      const lat = pos.coords.latitude
      const long = pos.coords.longitude
      console.log(lat, long)
      console.log(pos)
    };
    const error = (err) => {
      console.log(err)
    };
    const options = {

    };
    navigator?.geolocation?.watchPosition(success, error, options);
  }
  return (
    <div className="">
      <progress value="50" max="100" className="m-4"></progress>
      {data}
      <button onClick={handleLogs}>map</button>
    </div>
  );
};

export default Trials;

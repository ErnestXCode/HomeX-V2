import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
const maptilerkey = import.meta.env.VITE_MAP_TILER_KEY

const HouseMapTiler = () => {
  const center = { lat: 0.480933615528359, lng: 35.29814997853885 };
  
  const zoom = 9;

  return (
    <div style={{ height: "600px", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=${maptilerkey}`}
          attribution='&copy; <a href="https://www.maptiler.com/copyright" target="_blank" rel="noopener noreferrer">MapTiler</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
        />
      </MapContainer>
    </div>
  );
};

export default HouseMapTiler;

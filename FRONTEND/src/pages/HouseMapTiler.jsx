import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import L from "leaflet";
const maptilerkey = import.meta.env.VITE_MAP_TILER_KEY;

const markerIcon = new L.Icon({
  // iconUrl: SOME_ICON,
  iconSize: [35, 45],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

const HouseMapTiler = () => {
  const center = { lat: 0.480933615528359, lng: 35.29814997853885 };
  const [userCoords, setUserCoords] = useState([]);
  const zoom = 9;

  const success = (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;

    setUserCoords([lat, lng]);
  };

  const error = (err) => {
    console.log(err);
  };

  navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
  });

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=${maptilerkey}`}
          attribution='&copy; <a href="https://www.maptiler.com/copyright" target="_blank" rel="noopener noreferrer">MapTiler</a> | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>'
        />
        <Marker
          position={[0.480933615528359, 35.29814997853885]}
          icon={markerIcon}
        >
          <Popup>
            <p>House location</p>
          </Popup>
        </Marker>
        <Marker position={userCoords} icon={markerIcon}>
          <Popup>
            <p>My location</p>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default HouseMapTiler;

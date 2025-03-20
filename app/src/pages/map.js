import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function App() {
  const [destination, setDestination] = useState([29.6483, -82.3445]); 

  // New boundary coordinates
  const northBound = 29.6518;
  const southBound = 29.6448; 
  const westBound = -82.3503;
  const eastBound = -82.3392;

  return (
    <div className="relative h-screen w-screen">
      <MapContainer
        center={destination}
        zoom={17}
        minZoom={5}
        maxZoom={20}
        style={{ height: '100vh', width: '100vw' }}
        scrollWheelZoom={true}
        zoomControl={false}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker
          position={destination}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              if (lat < southBound || lat > northBound || lng < westBound || lng > eastBound) {
                alert('Marker is outside the allowed boundaries!');
              } else {
                setDestination([lat, lng]);  
              }
            },
          }}
        />
      </MapContainer>
    </div>
  );
}

export default App;
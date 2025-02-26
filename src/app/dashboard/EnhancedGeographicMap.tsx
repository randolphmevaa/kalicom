"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { motion } from "framer-motion";
// We'll use a simple inline SVG for the marker icon inspired by FiMapPin
import "mapbox-gl/dist/mapbox-gl.css";

// Set your Mapbox access token
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFya2F2ZSIsImEiOiJjbHpzZTh4cTUyYnZqMmtxdWIxenR3OGx3In0.ld7PEisTtlvEqY9g7XHkmQ';

// Define the type for call location data
interface CallLocation {
  name: string;
  coordinates: [number, number];
  calls: number;
  radius: number;
}

// Sample data – replace or extend this with your own call location data
const callLocations: CallLocation[] = [
  { name: "Paris", coordinates: [2.3522, 48.8566], calls: 150, radius: 10 },
  { name: "London", coordinates: [-0.1276, 51.5074], calls: 200, radius: 12 },
  { name: "New York", coordinates: [-74.006, 40.7128], calls: 250, radius: 11 }
];

const EnhancedGeographicMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the Mapbox map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [2.3522, 48.8566], // [longitude, latitude]
      zoom: 1.5,
      bearing: 0,
      pitch: 30,
    });

    // Add built-in controls
    mapRef.current.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current.addControl(new mapboxgl.FullscreenControl(), "top-right");
    mapRef.current.addControl(new mapboxgl.ScaleControl());

    // Add custom animated markers
    callLocations.forEach((location) => {
      // Create a container for the marker
      const markerEl = document.createElement("div");
      markerEl.className = "relative cursor-pointer group";

      // Outer animated ring (using Tailwind's animate-pulse for a pulsating effect)
      const ring = document.createElement("div");
      ring.className = "absolute inset-0 bg-[#004AC8] rounded-full opacity-20 animate-pulse";
      ring.style.width = `${location.radius * 8}px`;
      ring.style.height = `${location.radius * 8}px`;
      ring.style.marginLeft = `-${location.radius * 4}px`;
      ring.style.marginTop = `-${location.radius * 4}px`;
      markerEl.appendChild(ring);

      // Inner marker icon container with a gradient background and hover scaling effect
      const icon = document.createElement("div");
      icon.className =
        "flex items-center justify-center bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] text-white rounded-full shadow-lg transition-transform group-hover:scale-105";
      icon.style.width = `${location.radius * 4}px`;
      icon.style.height = `${location.radius * 4}px`;
      // Insert an inline SVG icon inspired by FiMapPin
      icon.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11c0 2.25 3 5 6 7 3-2 6-4.75 6-7 0-1.657-1.343-3-3-3-1.657 0-3 1.343-3 3z" />
        </svg>
      `;
      markerEl.appendChild(icon);

      // Add a click event to open a popup with details about the location
      markerEl.addEventListener("click", (e) => {
        e.stopPropagation();
        const popupContent = `
          <div class="p-4 bg-white rounded-xl shadow-lg min-w-[200px]">
            <h4 class="font-bold text-lg mb-2 text-[#1B0353]">${location.name}</h4>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2 h-2 bg-[#004AC8] rounded-full"></div>
              <span class="text-sm font-medium">${location.calls.toLocaleString()} appels</span>
            </div>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 text-gray-500">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11c0 2.25 3 5 6 7 3-2 6-4.75 6-7 0-1.657-1.343-3-3-3-1.657 0-3 1.343-3 3z" />
              </svg>
              <span class="text-sm text-gray-600">${location.coordinates[0].toFixed(4)}, ${location.coordinates[1].toFixed(4)}</span>
            </div>
          </div>
        `;
        new mapboxgl.Popup({ offset: 25 })
          .setLngLat(location.coordinates)
          .setHTML(popupContent)
          .addTo(mapRef.current!);
      });

      // Attach the marker element to the map at the specified coordinates
      new mapboxgl.Marker({ element: markerEl })
        .setLngLat(location.coordinates)
        .addTo(mapRef.current!);
    });

    // Cleanup map instance on unmount
    return () => mapRef.current?.remove();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white p-6 rounded-3xl shadow-xl mb-8 overflow-hidden"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Répartition Géographique</h3>
          <p className="text-sm text-gray-500">
            Visualisation en temps réel des appels par localisation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div
            className="px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: "rgba(75,178,246,0.2)", color: "#1B0353" }}
          >
            Total: {callLocations.reduce((sum, loc) => sum + loc.calls, 0)} appels
          </div>
          <button
            onClick={() => {
              // Reset the map view using the flyTo method for smooth transition
              mapRef.current?.flyTo({
                center: [2.3522, 48.8566],
                zoom: 1.5,
                bearing: 0,
                pitch: 30,
              });
            }}
            className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-[#4BB2F6]/20"
            style={{ color: "#1B0353" }}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 relative">
        <div ref={mapContainerRef} className="w-full h-[600px]" />
        {/* Custom Legend */}
        <div className="absolute left-4 bottom-4 bg-white p-4 rounded-xl shadow-lg">
          <h4 className="font-medium mb-3 text-[#1B0353]">Légende des appels</h4>
          <div className="flex flex-col gap-2">
            {[100, 500, 1000].map((size) => (
              <div key={size} className="flex items-center gap-3">
                <div
                  className="bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] rounded-full"
                  style={{
                    width: `${Math.sqrt(size) * 0.4}px`,
                    height: `${Math.sqrt(size) * 0.4}px`,
                  }}
                />
                <span className="text-sm text-gray-600">{size}+ appels</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Global styles for custom popup */}
      <style jsx global>{`
        .mapboxgl-popup-content {
          background: transparent !important;
          padding: 0 !important;
          box-shadow: none !important;
        }
        .mapboxgl-popup-tip {
          display: none !important;
        }
      `}</style>
    </motion.div>
  );
};

export default EnhancedGeographicMap;

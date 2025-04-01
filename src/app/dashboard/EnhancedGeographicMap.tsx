"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
// Import types for type checking, but still lazy load the actual library
import type { Map,  MapboxOptions } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Define the type for call location data
interface CallLocation {
  name: string;
  coordinates: [number, number];
  calls: number;
  radius: number;
}

// Sample data
const callLocations: CallLocation[] = [
  { name: "Paris", coordinates: [2.3522, 48.8566], calls: 150, radius: 10 },
  { name: "London", coordinates: [-0.1276, 51.5074], calls: 200, radius: 12 },
  { name: "New York", coordinates: [-74.006, 40.7128], calls: 250, radius: 11 }
];

const EnhancedGeographicMap = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const totalCalls = callLocations.reduce((sum, loc) => sum + loc.calls, 0);

  useEffect(() => {
    let mapboxgl: typeof import("mapbox-gl") | null = null;
    
    const loadMapbox = async () => {
      try {
        // Dynamic import of mapbox-gl
        const mapboxModule = await import('mapbox-gl');
        mapboxgl = mapboxModule;
        
        // Set the token after import
        mapboxgl.default.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 
          'pk.eyJ1IjoibWFya2F2ZSIsImEiOiJjbHpzZTh4cTUyYnZqMmtxdWIxenR3OGx3In0.ld7PEisTtlvEqY9g7XHkmQ';
        
        setMapboxLoaded(true);
        initializeMap(mapboxgl);
      } catch (error) {
        console.error("Failed to load Mapbox:", error);
      }
    };

    const initializeMap = (mapboxgl: typeof import("mapbox-gl")) => {
      if (!mapContainerRef.current) return;

      const mapOptions: MapboxOptions = {
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/navigation-night-v1",
        center: [2.3522, 48.8566],
        zoom: 1.5,
        pitch: 30,
      };

      // Initialize the map
      mapRef.current = new mapboxgl.default.Map(mapOptions);

      // Only proceed if map was initialized successfully
      if (mapRef.current) {
        // Add only essential controls
        mapRef.current.addControl(
          new mapboxgl.default.NavigationControl({ showCompass: false }), 
          "top-right"
        );

        // Add markers only after the map has loaded
        mapRef.current.on('load', () => {
          if (mapboxgl) {
            addMapMarkers(mapboxgl);
          }
        });
      }
    };

    const addMapMarkers = (mapboxgl: typeof import("mapbox-gl")) => {
      if (!mapRef.current) return;
      
      callLocations.forEach((location) => {
        // Create a simplified marker element
        const markerEl = document.createElement("div");
        markerEl.className = "relative cursor-pointer group";

        // Outer animated ring
        const ring = document.createElement("div");
        ring.className = "absolute inset-0 bg-[#004AC8] rounded-full opacity-20 animate-pulse";
        ring.style.width = `${location.radius * 8}px`;
        ring.style.height = `${location.radius * 8}px`;
        ring.style.marginLeft = `-${location.radius * 4}px`;
        ring.style.marginTop = `-${location.radius * 4}px`;
        markerEl.appendChild(ring);

        // Inner marker with simplified SVG
        const icon = document.createElement("div");
        icon.className = "flex items-center justify-center bg-gradient-to-br from-[#004AC8] to-[#4BB2F6] text-white rounded-full shadow-lg transition-transform group-hover:scale-105";
        icon.style.width = `${location.radius * 4}px`;
        icon.style.height = `${location.radius * 4}px`;
        
        // Simplified SVG
        icon.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5">
            <path fill="white" d="M12 11c0-1.657-1.343-3-3-3S6 9.343 6 11c0 2.25 3 5 6 7 3-2 6-4.75 6-7 0-1.657-1.343-3-3-3-1.657 0-3 1.343-3 3z" />
          </svg>
        `;
        markerEl.appendChild(icon);

        // Click handler for popup
        markerEl.addEventListener("click", (e) => {
          e.stopPropagation();
          if (!mapRef.current) return;
          
          const popupContent = `
            <div class="p-4 bg-white rounded-xl shadow-lg min-w-[200px]">
              <h4 class="font-bold text-lg mb-2 text-[#1B0353]">${location.name}</h4>
              <div class="flex items-center gap-2 mb-3">
                <div class="w-2 h-2 bg-[#004AC8] rounded-full"></div>
                <span class="text-sm font-medium">${location.calls.toLocaleString()} appels</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-gray-600">${location.coordinates[0].toFixed(4)}, ${location.coordinates[1].toFixed(4)}</span>
              </div>
            </div>
          `;
          
          // Even though we already checked mapRef.current at the start of this function and at the beginning
          // of this event handler, we'll check again for TypeScript's sake
          if (mapRef.current) {
            new mapboxgl.default.Popup({ offset: 25 })
              .setLngLat(location.coordinates)
              .setHTML(popupContent)
              .addTo(mapRef.current);
          }
        });

        // Add marker to map - we've already checked mapRef.current at the beginning of this function,
        // but let's be extra safe with TypeScript
        if (mapRef.current) {
          new mapboxgl.default.Marker({ element: markerEl })
            .setLngLat(location.coordinates)
            .addTo(mapRef.current);
        }
      });
    };

    loadMapbox();

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const resetMap = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [2.3522, 48.8566],
        zoom: 1.5,
        pitch: 30,
      });
    }
  };

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
            Total: {totalCalls} appels
          </div>
          <button
            onClick={resetMap}
            className="px-4 py-2 rounded-lg text-sm font-medium transition hover:bg-[#4BB2F6]/20"
            style={{ color: "#1B0353" }}
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Map Container with Loading State */}
      <div className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50 relative">
        {!mapboxLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="text-gray-500">Chargement de la carte...</div>
          </div>
        )}
        <div ref={mapContainerRef} className="w-full h-[600px]" />
        
        {/* Legend (Only shown when map is loaded) */}
        {mapboxLoaded && (
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
        )}
      </div>
      
      {/* Global styles for popup */}
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
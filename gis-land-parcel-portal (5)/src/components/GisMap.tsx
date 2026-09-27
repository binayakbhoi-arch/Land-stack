"use client";

import React, { useEffect, useRef } from "react";
import { Parcel } from "@/db/schema";
import "leaflet/dist/leaflet.css";

interface GisMapProps {
  parcels: Parcel[];
  selectedParcel: Parcel | null;
  onSelectParcel: (parcel: Parcel) => void;
  activeLayer: "osm" | "satellite" | "topo";
  showBoundaries: boolean;
  showLabels: boolean;
  filterLandUse: string;
}

export default function GisMap({
  parcels,
  selectedParcel,
  onSelectParcel,
  activeLayer,
  showBoundaries,
  showLabels,
  filterLandUse,
}: GisMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const polygonLayerGroupRef = useRef<any>(null);

  // Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      const L = (await import("leaflet")).default;

      if (!mapInstanceRef.current && mapContainerRef.current) {
        // Center around India (default Bangalore / Pan-India view)
        const map = L.map(mapContainerRef.current, {
          center: [13.235, 77.712],
          zoom: 13,
          zoomControl: false,
        });

        // Add custom zoom control top-right
        L.control.zoom({ position: "topright" }).addTo(map);

        mapInstanceRef.current = map;
        polygonLayerGroupRef.current = L.layerGroup().addTo(map);
      }

      // Update Tile Layer
      if (mapInstanceRef.current) {
        if (tileLayerRef.current) {
          mapInstanceRef.current.removeLayer(tileLayerRef.current);
        }

        let tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
        let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

        if (activeLayer === "satellite") {
          tileUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
          attribution = "Tiles &copy; Esri, Maxar, Earthstar Geographics";
        } else if (activeLayer === "topo") {
          tileUrl = "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png";
          attribution = "Map data: &copy; OpenTopoMap contributors";
        }

        tileLayerRef.current = L.tileLayer(tileUrl, {
          attribution,
          maxZoom: 19,
        }).addTo(mapInstanceRef.current);
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
    };
  }, [activeLayer]);

  // Render Polygons & Markers
  useEffect(() => {
    async function updatePolygons() {
      if (!mapInstanceRef.current || !polygonLayerGroupRef.current) return;
      const L = (await import("leaflet")).default;

      polygonLayerGroupRef.current.clearLayers();

      const displayedParcels = filterLandUse === "All" 
        ? parcels 
        : parcels.filter(p => p.landUse === filterLandUse);

      displayedParcels.forEach((parcel) => {
        const isSelected = selectedParcel?.ulpin === parcel.ulpin;
        const coords = parcel.coordinatesJson as [number, number][];

        let strokeColor = "#0284c7"; // Sky blue
        let fillColor = "#38bdf8";

        if (parcel.landUse === "Agricultural") {
          strokeColor = "#15803d"; // Green
          fillColor = "#22c55e";
        } else if (parcel.landUse === "Residential") {
          strokeColor = "#b45309"; // Amber
          fillColor = "#f59e0b";
        } else if (parcel.landUse === "Industrial") {
          strokeColor = "#6d28d9"; // Purple
          fillColor = "#a855f7";
        } else if (parcel.landUse === "Commercial") {
          strokeColor = "#0369a1"; // Deep Blue
          fillColor = "#0ea5e9";
        } else if (parcel.landUse === "Ecological Buffer") {
          strokeColor = "#047857"; // Emerald Forest
          fillColor = "#10b981";
        }

        if (parcel.hasAnomaly) {
          strokeColor = "#dc2626"; // Red warning
          fillColor = "#f87171";
        }

        if (showBoundaries && coords && coords.length > 0) {
          const polygon = L.polygon(coords, {
            color: strokeColor,
            weight: isSelected ? 4 : 2,
            opacity: 0.95,
            fillColor: fillColor,
            fillOpacity: isSelected ? 0.6 : 0.35,
            dashArray: isSelected ? "4, 4" : undefined,
          });

          polygon.on("click", () => {
            onSelectParcel(parcel);
          });

          // Tooltip on hover
          const tooltipContent = `
            <div style="font-family: inherit; font-size: 11px; padding: 2px;">
              <strong style="color: #0f172a; display: block;">${parcel.ulpin}</strong>
              <div style="color: #475569;">${parcel.ownerName}</div>
              <div style="color: #0369a1; font-weight: 600; margin-top: 2px;">${parcel.landUse} • ${parcel.areaAcres} Acres</div>
              ${parcel.hasAnomaly ? '<span style="color: #b91c1c; font-weight: bold; font-size: 10px;">⚠️ Anomaly Flagged</span>' : ''}
            </div>
          `;

          polygon.bindTooltip(tooltipContent, {
            sticky: true,
            direction: "top",
            opacity: 0.95,
          });

          polygonLayerGroupRef.current.addLayer(polygon);
        }

        // Add Centroid Marker with label
        const markerIcon = L.divIcon({
          className: "custom-gis-pin",
          html: `
            <div style="
              display: flex;
              align-items: center;
              background: ${isSelected ? "#0f172a" : "white"};
              color: ${isSelected ? "#ffffff" : "#1e293b"};
              border: 1.5px solid ${isSelected ? "#38bdf8" : strokeColor};
              border-radius: 9999px;
              padding: 2px 8px;
              box-shadow: 0 4px 6px -1px rgba(0,0,0,0.15);
              font-size: 10px;
              font-weight: 700;
              white-space: nowrap;
              cursor: pointer;
              transform: translate(-50%, -50%);
            ">
              <span style="
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: ${strokeColor};
                margin-right: 5px;
                display: inline-block;
              "></span>
              ${showLabels ? parcel.surveyNumber : parcel.ulpin.slice(-5)}
            </div>
          `,
          iconSize: [80, 24],
          iconAnchor: [40, 12],
        });

        const marker = L.marker([parcel.lat, parcel.lng], { icon: markerIcon });
        marker.on("click", () => {
          onSelectParcel(parcel);
        });
        polygonLayerGroupRef.current.addLayer(marker);
      });
    }

    updatePolygons();
  }, [parcels, selectedParcel, showBoundaries, showLabels, filterLandUse, onSelectParcel]);

  // Pan to selected parcel smoothly
  useEffect(() => {
    if (selectedParcel && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([selectedParcel.lat, selectedParcel.lng], 15, {
        duration: 1.2,
      });
    }
  }, [selectedParcel]);

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[640px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Floating Map Legend & Watermark */}
      <div className="absolute bottom-3 left-3 z-10 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-lg border border-slate-200/80 text-[11px] text-slate-700 max-w-xs pointer-events-auto">
        <div className="font-semibold text-slate-900 flex items-center justify-between pb-1.5 border-b border-slate-100">
          <span>Cadastral GIS Legend</span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">Bhu-Aadhaar</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1.5 text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-emerald-500 border border-emerald-700"></span>
            <span>Agricultural</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-500 border border-amber-700"></span>
            <span>Residential</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-sky-500 border border-sky-700"></span>
            <span>Commercial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-purple-500 border border-purple-700"></span>
            <span>Industrial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-teal-500 border border-teal-700"></span>
            <span>Buffer / Govt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-rose-500 border border-rose-700 animate-pulse"></span>
            <span className="text-rose-700 font-semibold">Anomaly Flag</span>
          </div>
        </div>
      </div>
    </div>
  );
}

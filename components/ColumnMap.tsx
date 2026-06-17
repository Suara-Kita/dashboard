"use client";

import { useCallback } from "react";
import maplibregl from "maplibre-gl";
import CyberMap from "./CyberMap";
import PEMANIS from "@/data/pemanis";
import KEMELAH from "@/data/kemelah";

export default function ColumnMap() {
  const handleMapLoad = useCallback((map: maplibregl.Map) => {
    // Pemanis boundary (cyan)
    map.addSource("pemanis", {
      type: "geojson",
      data: PEMANIS,
    });

    map.addLayer({
      id: "pemanis-fill",
      type: "fill",
      source: "pemanis",
      paint: {
        "fill-color": "#eddb39",
        "fill-opacity": 0.2,
      },
    });

    map.addLayer({
      id: "pemanis-outline",
      type: "line",
      source: "pemanis",
      paint: {
        "line-color": "#00f0ff",
        "line-width": 2,
        "line-opacity": 0.6,
      },
    });

    // Kemelah boundary (teal)
    map.addSource("kemelah", {
      type: "geojson",
      data: KEMELAH,
    });

    map.addLayer({
      id: "kemelah-fill",
      type: "fill",
      source: "kemelah",
      paint: {
        "fill-color": "#80a63a",
        "fill-opacity": 0.6,
      },
    });

    map.addLayer({
      id: "kemelah-outline",
      type: "line",
      source: "kemelah",
      paint: {
        "line-color": "#00a3a3",
        "line-width": 2,
        "line-opacity": 0.6,
      },
    });

    // Segamat glow marker
    map.addSource("segamat", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [102.81672873138913, 2.520758287960639],
        },
        properties: { name: "Segamat, Johor" },
      },
    });

    map.addLayer({
      id: "segamat-glow",
      type: "circle",
      source: "segamat",
      paint: {
        "circle-radius": 35,
        "circle-color": "#00ff41",
        "circle-blur": 0.85,
        "circle-opacity": 0.5,
      },
    });

    map.addLayer({
      id: "segamat-core",
      type: "circle",
      source: "segamat",
      paint: {
        "circle-radius": 6,
        "circle-color": "#00ff41",
        "circle-opacity": 1,
      },
    });

    // Zoom to combined Pemanis + Kemelah bounds
    map.fitBounds(
      [
        [102.775507, 2.368394],
        [103.058426, 2.684523],
      ],
      { padding: 50 },
    );
  }, []);

  return (
    <div className="w-full h-full">
      <CyberMap
        center={[102.81672873138913, 2.520758287960639]}
        zoom={13}
        onLoad={handleMapLoad}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle, transparent 40%, black 100%)",
        }}
      />
    </div>
  );
}

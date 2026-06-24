"use client";

import { useCallback } from "react";
import maplibregl from "maplibre-gl";
import CyberMap from "./CyberMap";
import PEMANIS from "@/data/pemanis";
import KEMELAH from "@/data/kemelah";
import PDM from "@/data/pdm";
import PUSAT from "@/data/pusat_daerah_mengundi";

function addGlowLayer(
  map: maplibregl.Map,
  id: string,
  source: string,
  color: string,
  radius = 28,
) {
  map.addLayer({
    id: `${id}-glow`,
    type: "circle",
    source,
    paint: {
      "circle-radius": radius,
      "circle-color": color,
      "circle-blur": 0.85,
      "circle-opacity": 0.4,
    },
  });

  map.addLayer({
    id: `${id}-core`,
    type: "circle",
    source,
    paint: {
      "circle-radius": 5,
      "circle-color": color,
      "circle-opacity": 1,
    },
  });
}

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

    // PDM points (yellow)
    map.addSource("pdm", {
      type: "geojson",
      data: PDM,
    });
    addGlowLayer(map, "pdm", "pdm", "#ffd700");

    // Pusat Daerah Mengundi points (green)
    map.addSource("pusat", {
      type: "geojson",
      data: PUSAT,
    });
    addGlowLayer(map, "pusat", "pusat", "#00ff41");

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

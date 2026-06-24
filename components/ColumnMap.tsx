"use client";

import { useCallback, useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import CyberMap from "./CyberMap";
import PEMANIS from "@/data/pemanis";
import KEMELAH from "@/data/kemelah";
import PUSAT from "@/data/pusat_daerah_mengundi";

interface ColumnMapProps {
  markerStyle: "green" | "saluran";
}

const SALURAN_EXPRESSION = [
  "interpolate",
  ["linear"],
  ["get", "saluran"],
  1, "#00ff41",
  7, "#ff0000",
] as unknown as maplibregl.ExpressionSpecification;

export default function ColumnMap({ markerStyle }: ColumnMapProps) {
  const mapRef = useRef<maplibregl.Map | null>(null);

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

    map.addSource("pusat", {
      type: "geojson",
      data: PUSAT,
    });

    map.addLayer({
      id: "pusat-glow",
      type: "circle",
      source: "pusat",
      paint: {
        "circle-radius": 28,
        "circle-color": "#00ff41",
        "circle-blur": 0.85,
        "circle-opacity": 0.4,
      },
    });

    map.addLayer({
      id: "pusat-core",
      type: "circle",
      source: "pusat",
      paint: {
        "circle-radius": 5,
        "circle-color": "#00ff41",
        "circle-opacity": 1,
      },
    });

    mapRef.current = map;

    // Zoom to combined Pemanis + Kemelah bounds
    map.fitBounds(
      [
        [102.775507, 2.368394],
        [103.058426, 2.684523],
      ],
      { padding: 50 },
    );
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getLayer("pusat-glow") || !map.getLayer("pusat-core")) return;

    const color = markerStyle === "green"
      ? "#00ff41"
      : SALURAN_EXPRESSION;

    map.setPaintProperty("pusat-glow", "circle-color", color);
    map.setPaintProperty("pusat-core", "circle-color", color);
  }, [markerStyle]);

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

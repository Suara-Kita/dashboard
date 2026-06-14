'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface CyberMapProps {
  center: [number, number];
  zoom: number;
  onLoad?: (map: maplibregl.Map) => void;
}

const CYBER_STYLE = {
  version: 8,
  sources: {
    openmaptiles: {
      type: 'vector' as const,
      url: 'https://tiles.openfreemap.org/planet',
    },
  },
  layers: [
    { id: 'background', type: 'background' as const, paint: { 'background-color': '#0a0e1a' } },
    {
      id: 'water',
      type: 'fill' as const,
      source: 'openmaptiles',
      'source-layer': 'water',
      paint: { 'fill-color': '#0d1b2a', 'fill-opacity': 0.8 },
    },
    {
      id: 'road_motorway',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', ['get', 'class'], 'motorway'],
      paint: { 'line-color': '#00f0ff', 'line-width': 2, 'line-opacity': 0.8 },
    },
    {
      id: 'road_trunk',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', ['get', 'class'], 'trunk'],
      paint: { 'line-color': '#00f0ff', 'line-width': 1.5, 'line-opacity': 0.6 },
    },
    {
      id: 'road_primary',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', ['get', 'class'], 'primary'],
      paint: { 'line-color': '#00a3a3', 'line-width': 1.2, 'line-opacity': 0.5 },
    },
    {
      id: 'road_secondary',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', ['get', 'class'], 'secondary'],
      paint: { 'line-color': '#00a3a3', 'line-width': 0.8, 'line-opacity': 0.4 },
    },
    {
      id: 'road_tertiary',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', ['get', 'class'], 'tertiary'],
      paint: { 'line-color': '#006666', 'line-width': 0.5, 'line-opacity': 0.3 },
    },
    {
      id: 'road_minor',
      type: 'line' as const,
      source: 'openmaptiles',
      'source-layer': 'transportation',
      filter: ['==', ['get', 'class'], 'minor'],
      paint: { 'line-color': '#004444', 'line-width': 0.3, 'line-opacity': 0.2 },
    },
  ],
};

export default function CyberMap({ center, zoom, onLoad }: CyberMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CYBER_STYLE as unknown as maplibregl.StyleSpecification,
      center,
      zoom,
      attributionControl: false,
    });

    map.on('load', () => {
      onLoad?.(map);
    });

    return () => map.remove();
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}

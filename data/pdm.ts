import type { FeatureCollection } from "geojson";
import raw from "./pdm.json";

function parseCoord(coord: string): [number, number] {
  const [lat, lng] = coord.split(",").map(Number);
  return [lng, lat];
}

const features = (raw.sekijang as any[])
  .filter((e: any) => e.pdm_coordinate)
  .map((e: any) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: parseCoord(e.pdm_coordinate),
    },
    properties: {
      nama_pdm: e.nama_pdm,
      kod_pdm: e.kod_pdm,
      dun: e.dun,
    },
  }));

const PDM: FeatureCollection = {
  type: "FeatureCollection",
  features,
};

export default PDM;

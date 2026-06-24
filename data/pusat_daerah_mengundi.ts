import type { FeatureCollection } from "geojson";
import raw from "./pusat_daerah_mengundi.json";

function parseCoord(coord: string): [number, number] {
  const [lat, lng] = coord.split(",").map(Number);
  return [lng, lat];
}

const features = (raw.sekijang as any[])
  .filter((e: any) => e.pusat_daerah_mengundi_coordinate)
  .map((e: any) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: parseCoord(e.pusat_daerah_mengundi_coordinate),
    },
    properties: {
      kod_pdm: e.kod_pdm,
      pusat_daerah_mengundi: e.pusat_daerah_mengundi,
      saluran: e.saluran,
    },
  }));

const PUSAT: FeatureCollection = {
  type: "FeatureCollection",
  features,
};

export default PUSAT;

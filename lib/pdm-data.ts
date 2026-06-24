import rawPdm from "@/data/pdm.json";
import rawPusat from "@/data/pusat_daerah_mengundi.json";

export interface PdmEntry {
  kod_pdm: string;
  nama_pdm: string;
  dun: string;
  alamat_pdm: string;
  pusat_daerah_mengundi: string;
  saluran: number;
  ketua_pdm_pengerusi: string;
  no_telefon: string;
  pdm_lat: number;
  pdm_lng: number;
  pusat_lat: number;
  pusat_lng: number;
}

const pdmMap = new Map<string, any>();
for (const e of (rawPdm.sekijang as any[])) {
  pdmMap.set(e.kod_pdm, e);
}

function val(obj: any, key: string, fallback: string): string {
  return obj && obj[key] != null ? String(obj[key]) : fallback;
}

export const pdmEntries: PdmEntry[] = (rawPusat.sekijang as any[]).map((e: any) => {
  const full = pdmMap.get(e.kod_pdm);
  const parseCoord = (c: string | undefined) => {
    if (!c) return [0, 0];
    const parts = c.split(",").map(Number);
    return [parts[0] || 0, parts[1] || 0];
  };
  const pdmCoord = val(full, "pdm_coordinate", "");
  const [pdmLat, pdmLng] = parseCoord(pdmCoord);
  const [pusatLat, pusatLng] = parseCoord(e.pusat_daerah_mengundi_coordinate);
  return {
    kod_pdm: e.kod_pdm,
    nama_pdm: val(full, "nama_pdm", e.kod_pdm),
    dun: val(full, "dun", ""),
    alamat_pdm: val(full, "alamat_pdm", ""),
    pusat_daerah_mengundi: e.pusat_daerah_mengundi,
    saluran: e.saluran,
    ketua_pdm_pengerusi: val(full, "ketua_pdm_pengerusi", ""),
    no_telefon: val(full, "no_telefon", ""),
    pdm_lat: pdmLat,
    pdm_lng: pdmLng,
    pusat_lat: pusatLat,
    pusat_lng: pusatLng,
  };
});

export const dunList = [...new Set(pdmEntries.map((e) => e.dun).filter(Boolean))];

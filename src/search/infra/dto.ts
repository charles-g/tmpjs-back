
export interface CompanySearchResultRow {
  id_company: number;
  name: string;
  distance_to_worker_in_km: number;
  street: string;
  city: string;
  zip_code: string;
  country: string;
  coordinates_lat: number;
  coordinates_lon: number;
}


export interface TableRowCompany {
  id_company: number;
  name: string;
}

export interface TableRowCompanyAddress {
  id_company_address: number;
  company_id: number;
  street: string;
  city: string;
  zip_code: string;
  country: string;
  coordinates_lat: number;
  coordinates_lon: number;
}

export interface TableRowCompanySkill {
  id_company_skill: number;
  company_id: number;
  skill_id: number;
}

export interface TableRowSkill {
  id_skill: number;
  name: string;
}

export interface TableRowPostContractFeedback {
  id_post_contract_feedback: number;
  company_id: number;
  worker_id: number;
  worker_feedback_is_positive: boolean;
  worker_feedback_is_negative: boolean;
}

export interface TableRowWorker {
  id_worker: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface TableRowWorkerSkill {
  id_worker_skill: number;
  worker_id: number;
  skill_id: number;
}

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

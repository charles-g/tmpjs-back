import { CompanySearchResult } from "../domain/dto/company-search-result";
import { CompanySearchResultRow } from "./dto";


export class SearchResultsMapper {
   mapToCompanySearchResults(
    companies: any[],
    contracts: any,
    skills: any,
    feedbacks: any,
  ): Array<CompanySearchResult> {

    if (!companies || !companies.length) {
      return [];
    }

    return companies.map((row: CompanySearchResultRow) => {
      return {
        companyId: row.id_company,
        companyName: row.name,
        distanceToWorkerInKm: row.distance_to_worker_in_km,
        companyAddress: {
          street: row.street,
          city: row.city,
          zipCode: row.zip_code,
          country: row.country,
          coordinates: {
            lat: row.coordinates_lat,
            lon: row.coordinates_lon,
          },
        },
        companyAvailableContractTimeSlots: contracts[row.id_company] || [],
        companySkills: skills[row.id_company] || [],
        postContractFeedbacks: {
          positiveCount: feedbacks[row.id_company]?.[0]?.positive_feedback_count || 0,
          negativeCount: feedbacks[row.id_company]?.[0]?.negative_feedback_count || 0,
        }
      };
    });
  }

}


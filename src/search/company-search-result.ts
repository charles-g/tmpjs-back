export interface CompanySearchResult {
  companyId: number;
  companyName: string;
  distanceToWorkerInKm: number;
  companyAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    }
  };
  companyAvailableContractTimeSlots: Array<{
    dayDate: Date;
  }>
  companySkills: Array<{
    skillId: number;
    skillName: string;
  }>
  postContractFeedbacks: {
    positiveCount: number;
    negativeCount: number;
  }
}

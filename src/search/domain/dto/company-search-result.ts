
export interface SearchResult {
  worker: any;
  count: number;
  items: Array<CompanySearchResult>;
}

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
  },
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

export interface SearchDocument {
  readonly companyId: number;
  readonly companyName: string;
  readonly dayDate: Date;
  readonly timestamp: number;
  readonly contractPositionName: string;
  readonly contractPositionId: number;
  readonly distanceToWorkerInKm: number;
  readonly companyAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  readonly companySkills: {
    skillId: number;
    skillName: string;
  }[];
  readonly postContractFeedbacks: {
    positiveCount: number;
    negativeCount: number;
    positivePercentage: number;
  };
  readonly _geoloc: {
    lat: number;
    lng: number;
  }
}


export type CriteriaQuery = {
  workerId: number;
  positionId: number;
  maxDistance?: number;
  minSkills?: number;
  skills?: number[];
  dates?: {
    min: Date;
    max: Date;
  };
};

export abstract class ICompanyFinder {
  abstract getCompanies(query: CriteriaQuery): Promise<any>;
}

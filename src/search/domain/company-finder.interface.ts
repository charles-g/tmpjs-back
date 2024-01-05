export abstract class ICompanyFinder {
  abstract getCompanies(workerId: number, maxDistance: number, minSkills: number): Promise<any>;
}

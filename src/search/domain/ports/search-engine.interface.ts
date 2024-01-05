export abstract class ISearchEngine {
  public abstract addDocumentsToIndex(documents: any[]): Promise<any>;
  public abstract searchCompanies(
    position: string | null,
    maxDistance: number | null,
    skills: Array<string> | null,
    dates: {min: number, max:number} | null
  ): Promise<any>;
}

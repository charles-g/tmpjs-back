import { ISearchEngine } from "./ports/search-engine.interface";

type SearchCompaniesUseCaseQuery = {
  position: string | null,
  maxDistance: number | null,
  skills: Array<string> | null,
  dates: {
    min: Date,
    max: Date,
  } | null,
};

export class SearchCompaniesUseCase {

  private searchEngine: ISearchEngine;

  public constructor(ISearchEngine) {
    this.searchEngine = ISearchEngine;
  }

  async execute(query: SearchCompaniesUseCaseQuery): Promise<any> {
    const { position, maxDistance, skills, dates } = query;
    const timestamps = {
      min: dates?.min.getTime()/1000 || null,
      max: dates?.max.getTime()/1000 || null,
    };
    const documents = await this.searchEngine.searchCompanies(position, maxDistance, skills, timestamps);
    return documents;
  }

}

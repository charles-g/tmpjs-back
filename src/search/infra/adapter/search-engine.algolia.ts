import algoliasearch from 'algoliasearch';
import { ISearchEngine } from "../../domain/ports/search-engine.interface";

export enum FacetAttributes {
  company = 'companyName',
  address = 'companyAddress',
  skills = 'companySkills.skillName',
  position = 'contractPositionName',
  feedbacks = 'postContractFeedbacks.positivePercentage',
  timestamp = 'timestamp',
}

export class SearchEngineAlgolia implements ISearchEngine {

  private algoliaClient;
  private index;

  constructor(appId, apiKey, indexName) {
    this.algoliaClient = algoliasearch(appId, apiKey);
    this.index = this.algoliaClient.initIndex(indexName);
  }

  async addDocumentsToIndex(documents: any[]): Promise<any> {
    await this.index.saveObjects(documents);
  }

  private makeFacetFilters(facetName: string, facetValues: Array<string>): Array<string> {
    return facetValues.map(facetValue => `${facetName}:${facetValue}`);
  }

  private makeNumericRangeFilters(fieldName: string, datesRange: {min: number, max:number}): string {
    return `${fieldName}:${datesRange.min} TO ${datesRange.max}`;
  }

  private makeAllFacetFilters(position, skillValues) {
    const skillsPart = skillValues ? this.makeFacetFilters(FacetAttributes.skills, skillValues) : [];
    const positionPart = this.makeFacetFilters(FacetAttributes.position, [position]);

    return [skillsPart, positionPart];
  }

  async searchCompanies(
    position: string | null,
    maxDistance: number | null,
    skills: Array<string> | null,
    datesRange: {min: number, max:number} | null
  ): Promise<any> {

    const numericFilters = datesRange ? this.makeNumericRangeFilters(FacetAttributes.timestamp, datesRange) : '';

    try {
      const results = await this.index.search('', {
        facetFilters: this.makeAllFacetFilters(position, skills),
        numericFilters,
      });

      return results;
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}

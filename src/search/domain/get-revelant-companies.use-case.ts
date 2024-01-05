import { Injectable } from '@nestjs/common';
import { ICompanyFinder } from "./ports/company-finder.interface";

type UseCaseQuery = {
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

@Injectable()
export class GetRelevantCompanies {

  constructor(private finder: ICompanyFinder) {
  }

  async execute(query: UseCaseQuery): Promise<any> {
      return await this.finder.getCompanies(query);
  }
}

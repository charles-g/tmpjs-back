import { Injectable } from '@nestjs/common';
import { ICompanyFinder } from "./company-finder.interface";

@Injectable()
export class GetRelevantCompanies {

  constructor(private finder: ICompanyFinder) {
  }

  async execute(query: {
      workerId: number,
      maxDistance: number,
      minSkills: number,
     }) {
      return await this.finder.getCompanies(
        query.workerId,
        query.maxDistance,
        query.minSkills,
      );
  }

}

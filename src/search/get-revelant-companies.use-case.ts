import { Injectable } from '@nestjs/common';
import { DataAccessObject } from "./data-access-object";

@Injectable()
export class GetRelevantCompanies {

  constructor(private repository: DataAccessObject) {
  }

  async execute(query: {
      workerId: number,
      maxDistance: number,
      minSkills: number,
     }) {
      return await this.repository.getCompanies(
        query.workerId,
        query.maxDistance,
        query.minSkills,
      );
  }

}

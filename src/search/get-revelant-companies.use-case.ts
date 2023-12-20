import { Injectable } from '@nestjs/common';
import { Repository } from "./repository";

@Injectable()
export class GetRelevantCompanies {

  constructor(private repository: Repository) {
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

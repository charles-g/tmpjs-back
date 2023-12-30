import { PrismaClient, Prisma } from "@prisma/client";
import {FactorySearchResults} from "./factory";
import { CompanyInfoDocument, SearchResult } from "./company-search-result";

export class DataAccessObject {

  private prisma = new PrismaClient();
  private factory = new FactorySearchResults();

  private organizeByCompanyId(rows: any, key = 'company_id') {
    const finalDataStructure = {};
    rows.forEach((row: any) => {
      if (!finalDataStructure[row[key]]) {
        finalDataStructure[row[key]] = [];
      }
      finalDataStructure[row[key]].push(row);
    });
    return finalDataStructure;
  }

  private async getFeedbacks(companyIds: number[]) {
    const postContractFeedbacks = await this.prisma.$queryRaw
      `SELECT
          pcf."company_id",
          CAST(COUNT(DISTINCT CASE WHEN pcf."worker_feedback_positive"
                        THEN pcf."id_post_contract_feedback" END) AS INTEGER)
                        AS positive_feedback_count,
          CAST(COUNT(DISTINCT CASE WHEN NOT pcf."worker_feedback_positive"
                        THEN pcf."id_post_contract_feedback" END) AS INTEGER)
                        AS negative_feedback_count
      FROM "PostContractFeedback" pcf
      WHERE pcf."company_id" IN (${Prisma.join(companyIds)})
      GROUP BY pcf."company_id";
      `;
    const fbById = this.organizeByCompanyId(postContractFeedbacks, 'company_id');
    return fbById;
  }

  private async getSkills(companyIds: number[]) {
    const companySkills = await this.prisma.$queryRaw
      `SELECT *
        FROM "CompanySkill"
        JOIN "Skill" ON "CompanySkill"."skill_id" = "Skill"."id_skill"
        WHERE "company_id" IN (${Prisma.join(companyIds)});`;

    return this.organizeByCompanyId(companySkills);
  }

  private async getContracts(companyIds: number[]) {
    const companyAvailableContractTimeSlots = await this.prisma.$queryRaw
      `SELECT *
        FROM "CompanyAvailableContractTimeSlot"
        WHERE "company_id" IN (${Prisma.join(companyIds)})`;

    return this.organizeByCompanyId(companyAvailableContractTimeSlots);
  }

  private getWorkerDetails(workerId: number) {
    const skills = this.prisma.$queryRaw
      `SELECT ws.skill_id, s.name
        FROM "Worker"
        JOIN "WorkerSkill" ws ON "Worker"."id_worker" = ws."worker_id"
        JOIN "Skill" s ON ws."skill_id" = s."id_skill"
        WHERE "Worker"."id_worker" = ${workerId}`;

    const availabilities = this.prisma.$queryRaw
      `SELECT * FROM "WorkerAvailability" WHERE "worker_id" = ${workerId}`;

    return Promise.all([skills, availabilities]);
  }

  private async getCompaniesWithMatchingSkills(
    workerId: number,
    minMatchingSkillsCount: number
  ) : Promise<Array<any>> {
    return this.prisma.$queryRaw
      `SELECT c."id_company"
        FROM "Company" c
        JOIN "CompanySkill" cs ON c."id_company" = cs."company_id"
        JOIN "Skill" s ON cs."skill_id" = s."id_skill"
        JOIN "WorkerSkill" ws ON cs."skill_id" = ws."skill_id"
        JOIN "Worker" w ON w."id_worker" = ws."worker_id"
        WHERE w."id_worker" = ${workerId}
        GROUP BY c."id_company"
        HAVING COUNT(DISTINCT cs."skill_id") >= ${minMatchingSkillsCount}`;
  }

  async getCompanies(
    workerId: number,
    maxDistanceInKm: number,
    minMatchingSkillsCount: number,
  ): Promise<SearchResult> {

    const companiesWithMatchingSkills = await this.getCompaniesWithMatchingSkills(workerId, minMatchingSkillsCount);
    const companyIdsWithMatchingSkills = companiesWithMatchingSkills.map((row: any) => row.id_company);

    const companies : Array<any> = await this.prisma.$queryRaw
      `SELECT
            c.id_company,
            c.name,
            wa_company.*,
            ca.*,
            ST_DistanceSphere(
                ST_SetSRID(ST_MakePoint(wa_company.coordinates_lon, wa_company.coordinates_lat), 4326),
                ST_SetSRID(ST_MakePoint(ca.coordinates_lon, ca.coordinates_lat), 4326)
            ) / 1000 AS distance_to_worker_in_km
        FROM "Company" c
        JOIN "Worker" w ON w."id_worker" = ${workerId}
        JOIN "CompanyAvailableContractTimeSlot" cat ON c."id_company" = cat."company_id"
        JOIN "WorkerAvailability" wa ON w."id_worker" = wa."worker_id" AND wa."day_date" = cat."day_date"
        JOIN "CompanyAddress" ca ON c."id_company" = ca."company_id"
        JOIN "WorkerAddress" wa_company ON w."id_worker" = wa_company."worker_id"
        WHERE c."id_company" IN (${Prisma.join(companyIdsWithMatchingSkills)})
        GROUP BY c."id_company", wa_company.coordinates_lon, wa_company.coordinates_lat, wa_company.id_worker_address, ca.id_company_address, ca.coordinates_lon, ca.coordinates_lat
        HAVING ST_DistanceSphere(
                    ST_SetSRID(ST_MakePoint(wa_company.coordinates_lon, wa_company.coordinates_lat), 4326),
                    ST_SetSRID(ST_MakePoint(ca.coordinates_lon, ca.coordinates_lat), 4326)
                ) / 1000 <= ${maxDistanceInKm}
        ORDER BY distance_to_worker_in_km`
    ;

    if (!companies || !Array.isArray(companies) || !companies.length) {
      return {
        worker: {},
        count: 0,
        items: [],
      };
    }

    const companyIds = companies.map((company: any) => parseInt(company.id_company));
    const contracts = await this.getContracts(companyIds);
    const skills = await this.getSkills(companyIds);
    const feedbacks = await this.getFeedbacks(companyIds);
    const [workerSkills, workerAvailabilities] = await this.getWorkerDetails(workerId);

    return {
      worker: {
        skills: workerSkills,
        availabilities: workerAvailabilities,
      },
      count: companies.length,
      items: this.factory.makeCompanySearchResults(companies, contracts, skills, feedbacks)
    };
  }

  private makeIndexDocument(
    companies: Array<any>,
    contracts: any,
    skills: any,
    feedbacks: any
  ) : CompanyInfoDocument[] {
    return companies.map((c) => {
      return this.mapRowToStructure(c, contracts, skills, feedbacks);
    });
  }

  private mapRowToStructure(company: any, contracts: any, skills: any, feedbacks: any) : CompanyInfoDocument {
    return {
      companyId: company.id_company,
      companyName: company.name,
      distanceToWorkerInKm: company.distance_to_worker_in_km,
      companyAddress: {
        street: company.street,
        city: company.city,
        zipCode: company.zip_code,
        country: company.country,
        coordinates: {
          lat: company.coordinates_lat,
          lon: company.coordinates_lon
        }
      },
      "_geoloc": {
        lat: company.coordinates_lat,
        lng: company.coordinates_lon
      },
      companyAvailableContractTimeSlots: contracts[company.id_company].map((contract) => {
        return {
          dayDate: contract.day_date,
          // convert to timestamp in seconds
          timestamp: Math.floor(new Date(contract.day_date).getTime() / 1000),
        };
      }),
      companySkills: skills[company.id_company].map((skill) => {
        return {
          skillId: skill.skill_id,
          skillName: skill.name
        };
      }),
      postContractFeedbacks: {
        positiveCount: feedbacks[company.id_company][0].positive_feedback_count,
        negativeCount: feedbacks[company.id_company][0].negative_feedback_count,
        positivePercentage: this.getPercentagePositive(feedbacks[company.id_company]),
      }
    };
  }

  private getPercentagePositive(feedbacks: any) {
    return feedbacks[0].positive_feedback_count / (feedbacks[0].positive_feedback_count + feedbacks[0].negative_feedback_count) * 100;
  }

  async getAllDocuments() : Promise<Array<CompanyInfoDocument>> {
    const companies : Array<any> = await this.prisma.$queryRaw
      `SELECT
            c.id_company,
            c.name,
            ca.*
        FROM "Company" c
        JOIN "CompanyAddress" ca ON c."id_company" = ca."company_id"`
    ;

    if (!companies || !Array.isArray(companies) || !companies.length) {
      return [];
    }

    const companyIds = companies.map((company: any) => parseInt(company.id_company));
    const contracts = await this.getContracts(companyIds);
    const feedbacks = await this.getFeedbacks(companyIds);
    const skills = await this.getSkills(companyIds);

    return this.makeIndexDocument(companies, contracts, skills, feedbacks);
  }

}

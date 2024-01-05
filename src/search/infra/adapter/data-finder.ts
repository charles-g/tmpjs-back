import { PrismaClient, Prisma } from "@prisma/client";
import {SearchResultsMapper} from "../mapper";
import { SearchResult } from "../../domain/dto/company-search-result";
import { CriteriaQuery, ICompanyFinder } from "../../domain/ports/company-finder.interface";

export class DataFinder implements ICompanyFinder {

  private prisma = new PrismaClient();
  private mapper = new SearchResultsMapper();

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
          CAST(COUNT(DISTINCT CASE WHEN pcf."worker_feedback_is_positive"
                        THEN pcf."id_post_contract_feedback" END) AS INTEGER)
                        AS positive_feedback_count,
          CAST(COUNT(DISTINCT CASE WHEN NOT pcf."worker_feedback_is_positive"
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

  private async getContracts(companyIds: number[], positionId: number) {
    const companyAvailableContractTimeSlots = await this.prisma.$queryRaw
      `SELECT c.*, cp.name AS contract_position_name
        FROM "CompanyAvailableContractTimeSlot" c
        JOIN "ContractPosition" cp ON c."contract_position_id" = cp."id_contract_position"
        WHERE c."company_id" IN (${Prisma.join(companyIds)}) AND c."contract_position_id" = ${positionId}`;

    return this.organizeByCompanyId(companyAvailableContractTimeSlots);
  }

  private async getCompaniesWithMatchingSkills(
    workerId: number,
    skills: Array<number>
  ) : Promise<Array<any>> {
    return this.prisma.$queryRaw
      `SELECT c."id_company"
        FROM "Company" c
        JOIN "CompanySkill" cs ON c."id_company" = cs."company_id"
        JOIN "Skill" s ON cs."skill_id" = s."id_skill"
        JOIN "WorkerSkill" ws ON cs."skill_id" = ws."skill_id"
        JOIN "Worker" w ON w."id_worker" = ws."worker_id"
        WHERE w."id_worker" = ${workerId} AND s."id_skill" IN (${Prisma.join(skills)})
        GROUP BY c."id_company"`;
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

  async getCompanies(
    params: CriteriaQuery
  ): Promise<SearchResult> {

    const workerId = params.workerId;
    const positionId = params.positionId;
    const maxDistanceInKm = params.maxDistance || 10;
    const skills = params.skills || [];
    const datesRange = params.dates;

    const companiesWithMatchingSkills = await this.getCompaniesWithMatchingSkills(workerId, skills);
    const companyIdsWithMatchingSkills = companiesWithMatchingSkills.map((row: any) => row.id_company);

    let sql = Prisma.sql`SELECT
                            c.id_company,
                            c.name,
                            wa.*,
                            ca.*,
                            ST_DistanceSphere(
                                ST_SetSRID(ST_MakePoint(wa.coordinates_lon, wa.coordinates_lat), 4326),
                                ST_SetSRID(ST_MakePoint(ca.coordinates_lon, ca.coordinates_lat), 4326)
                            ) / 1000 AS distance_to_worker_in_km
                        FROM "Company" c
                        JOIN "Worker" w ON w."id_worker" = ${workerId}
                        JOIN "CompanyAvailableContractTimeSlot" cat ON c."id_company" = cat."company_id"
                        JOIN "CompanyAddress" ca ON c."id_company" = ca."company_id"
                        JOIN "WorkerAddress" wa ON w."id_worker" = wa."worker_id"
                        WHERE cat."contract_position_id" = ${positionId}
                        AND cat."day_date" BETWEEN 
                            ${datesRange.min.toISOString()}::TIMESTAMP
                            AND 
                            ${datesRange.max.toISOString()}::TIMESTAMP`;

    if (skills.length > 0 && companyIdsWithMatchingSkills.length > 0) {
      sql = Prisma.sql`${sql} AND c."id_company" IN (${Prisma.join(companyIdsWithMatchingSkills)})`;
    }

    sql = Prisma.sql`${sql}
                      GROUP BY c."id_company", wa.coordinates_lon, wa.coordinates_lat, wa.id_worker_address, ca.id_company_address, ca.coordinates_lon, ca.coordinates_lat
                      HAVING ST_DistanceSphere(
                                  ST_SetSRID(ST_MakePoint(wa.coordinates_lon, wa.coordinates_lat), 4326),
                                  ST_SetSRID(ST_MakePoint(ca.coordinates_lon, ca.coordinates_lat), 4326)
                              ) / 1000 <= ${maxDistanceInKm}
                      ORDER BY distance_to_worker_in_km`;

    const companies = await this.prisma.$queryRaw(sql);

    if (!companies || !Array.isArray(companies) || !companies.length) {
      return {
        worker: {},
        count: 0,
        items: [],
      };
    }

    const companyIds = companies.map((company: any) => parseInt(company.id_company));
    const contracts = await this.getContracts(companyIds, positionId);
    const skillsData = await this.getSkills(companyIds);
    const feedbacks = await this.getFeedbacks(companyIds);
    const [workerSkills, workerAvailabilities] = await this.getWorkerDetails(workerId);

    return {
      worker: {
        skills: workerSkills,
        availabilities: workerAvailabilities,
      },
      count: companies.length,
      items: this.mapper.mapToCompanySearchResults(companies, contracts, skillsData, feedbacks)
    };
  }
}

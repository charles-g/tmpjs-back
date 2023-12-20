import { PrismaClient, Prisma } from "@prisma/client";
import { CompanySearchResult } from "./company-search-result";

interface CompanySearchResultRow {
  id_company: number;
  name: string;
  distance_to_worker_in_km: number;
  street: string;
  city: string;
  zip_code: string;
  country: string;
  coordinates_lat: number;
  coordinates_lon: number;
}

export class Repository {

  private prisma = new PrismaClient();

  private makeCompanySearchResults(
    companies: any[],
    contracts: any,
    skills: any,
    feedbacks: any,
  ): Array<CompanySearchResult> {

    if (!companies || !companies.length) {
      return [];
    }

    return companies.map((row: CompanySearchResultRow) => {
      return {
        companyId: row.id_company,
        companyName: row.name,
        distanceToWorkerInKm: row.distance_to_worker_in_km,
        companyAddress: {
          street: row.street,
          city: row.city,
          zipCode: row.zip_code,
          country: row.country,
          coordinates: {
            lat: row.coordinates_lat,
            lon: row.coordinates_lon,
          },
        },
        companyAvailableContractTimeSlots: contracts[row.id_company] || [],
        companySkills: skills[row.id_company] || [],
        postContractFeedbacks: {
          positiveCount: feedbacks[row.id_company]?.[0]?.positive_feedback_count || 0,
          negativeCount: feedbacks[row.id_company]?.[0]?.negative_feedback_count || 0,
        }
      };
    });
  }

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
          CAST(COUNT(DISTINCT CASE WHEN pcf."company_feedback_positive" THEN pcf."id_post_contract_feedback" END) AS INTEGER) AS positive_feedback_count,
          CAST(COUNT(DISTINCT CASE WHEN NOT pcf."company_feedback_positive" THEN pcf."id_post_contract_feedback" END) AS INTEGER) AS negative_feedback_count
      FROM "PostContractFeedback" pcf
      WHERE pcf."company_id" IN (${Prisma.join(companyIds)})
      GROUP BY pcf."company_id";
      `;

    return this.organizeByCompanyId(postContractFeedbacks, 'company_id');
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

  async getCompanies(
    workerId: number,
    maxDistanceInKm: number,
    minMatchingSkillsCount: number,
  ): Promise<any> {

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
        JOIN "CompanyAvailableContractTimeSlot" cat ON c."id_company" = cat."company_id"
        JOIN "CompanySkill" cs ON c."id_company" = cs."company_id"
        JOIN "Skill" s ON cs."skill_id" = s."id_skill"
        JOIN "WorkerSkill" ws ON cs."skill_id" = ws."skill_id"
        JOIN "WorkerAvailability" wa ON ws."worker_id" = wa."worker_id" AND wa."day_date" = cat."day_date"
        JOIN "CompanyAddress" ca ON c."id_company" = ca."company_id"
        JOIN "Worker" w ON w."id_worker" = ${workerId}
        JOIN "WorkerAddress" wa_company ON w."id_worker" = wa_company."worker_id"
        GROUP BY c."id_company", wa_company.coordinates_lon, wa_company.coordinates_lat, wa_company.id_worker_address, ca.id_company_address, ca.coordinates_lon, ca.coordinates_lat
        HAVING COUNT(DISTINCT ws."skill_id") >= ${minMatchingSkillsCount} AND ST_DistanceSphere(
                                                                    ST_SetSRID(ST_MakePoint(wa_company.coordinates_lon, wa_company.coordinates_lat), 4326),
                                                                    ST_SetSRID(ST_MakePoint(ca.coordinates_lon, ca.coordinates_lat), 4326)
                                                                ) / 1000 <= ${maxDistanceInKm}
        ORDER BY distance_to_worker_in_km;`
    ;

    if (!companies || !Array.isArray(companies) || !companies.length) {
      return [];
    }

    const companyIds = companies.map((company: any) => parseInt(company.id_company));
    const contracts = await this.getContracts(companyIds);
    const skills = await this.getSkills(companyIds);
    const feedbacks = await this.getFeedbacks(companyIds);

    return this.makeCompanySearchResults(companies, contracts, skills, feedbacks);
  }
}

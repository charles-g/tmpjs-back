import { PrismaClient, Prisma } from "@prisma/client";
import { SearchDocument, SearchResult } from "../../domain/dto/company-search-result";
import { IDocumentRepository } from "../../domain/ports/document-repository.interface";

export class DataAccessObject implements IDocumentRepository {

  private prisma;

  constructor(prisma: PrismaClient = new PrismaClient()) {
    this.prisma = prisma;
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

  private async getContracts(companyIds: number[]) {
    const companyAvailableContractTimeSlots = await this.prisma.$queryRaw
      `SELECT c.*, cp.name AS contract_position_name
        FROM "CompanyAvailableContractTimeSlot" c
        JOIN "ContractPosition" cp ON c."contract_position_id" = cp."id_contract_position"
        WHERE c."company_id" IN (${Prisma.join(companyIds)})`;

    return this.organizeByCompanyId(companyAvailableContractTimeSlots);
  }

  private makeIndexDocument(
    timeslots: Array<any>,
    skills: any,
    feedbacks: any
  ) : SearchDocument[] {
    return timeslots.map((timeslot) => {
      return this.mapRowToStructure(timeslot, skills, feedbacks);
    });
  }

  private mapRowToStructure(timeslot: any, skills: any, feedbacks: any) : SearchDocument {
    return {
      companyId: timeslot.id_company,
      companyName: timeslot.name,
      dayDate: timeslot.day_date,
      timestamp: Math.floor(new Date(timeslot.day_date).getTime() / 1000),
      contractPositionId: timeslot.contract_position_id,
      contractPositionName: timeslot.contract_position_name,
      distanceToWorkerInKm: timeslot.distance_to_worker_in_km,
      companyAddress: {
        street: timeslot.street,
        city: timeslot.city,
        zipCode: timeslot.zip_code,
        country: timeslot.country,
        coordinates: {
          lat: timeslot.coordinates_lat,
          lon: timeslot.coordinates_lon
        }
      },
      "_geoloc": {
        lat: timeslot.coordinates_lat,
        lng: timeslot.coordinates_lon
      },
      companySkills: skills[timeslot.id_company].map((skill) => {
        return {
          skillId: skill.skill_id,
          skillName: skill.name
        };
      }),
      postContractFeedbacks: {
        positiveCount: feedbacks[timeslot.id_company][0].positive_feedback_count,
        negativeCount: feedbacks[timeslot.id_company][0].negative_feedback_count,
        positivePercentage: this.getPercentagePositive(feedbacks[timeslot.id_company]),
      }
    };
  }

  private getPercentagePositive(feedbacks: any) {
    return feedbacks[0].positive_feedback_count / (feedbacks[0].positive_feedback_count + feedbacks[0].negative_feedback_count) * 100;
  }

  async getAllDocuments() : Promise<Array<SearchDocument>> {
    const companies : Array<any> = await this.prisma.$queryRaw
      `SELECT
            c.id_company,
            c.name,
            cp.name AS contract_position_name,
            cp.id_contract_position as contract_position_id,
            ca.*,
            cat.*
        FROM "CompanyAvailableContractTimeSlot" cat
        JOIN "ContractPosition" cp ON cat."contract_position_id" = cp."id_contract_position"
        JOIN "Company" c ON c."id_company" = cat."company_id"
        JOIN "CompanyAddress" ca ON c."id_company" = ca."company_id"`
    ;

    if (!companies || !Array.isArray(companies) || !companies.length) {
      return [];
    }

    const companyIds = companies.map((company: any) => parseInt(company.id_company));
    // const contracts = await this.getContracts(companyIds);
    const feedbacks = await this.getFeedbacks(companyIds);
    const skills = await this.getSkills(companyIds);

    return this.makeIndexDocument(companies, skills, feedbacks);
  }

}

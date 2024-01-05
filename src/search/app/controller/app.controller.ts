import { ClassSerializerInterceptor, Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { GetRelevantCompanies } from '../../domain/get-revelant-companies.use-case';
import { DataAccessObject } from "../../infra/data-access-object";

@Controller()
export class AppController {
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/companies')
  async getCompanies(
    @Res({ passthrough: true }) res: Response,
    @Query('workerId') workerId = '1',
    @Query('maxDistance') maxDistance = '25',
    @Query('minSkills') minSkills = '1',
  ) {
    const getRelevantCompanies = new GetRelevantCompanies(
      new DataAccessObject(),
    );
    return await getRelevantCompanies.execute({
      workerId: parseInt(workerId, 10),
      maxDistance: parseInt(maxDistance, 10),
      minSkills: parseInt(minSkills, 10),
    });
  }
}

import { ClassSerializerInterceptor, Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { GetRelevantCompanies } from '../search/get-revelant-companies.use-case';

@Controller()
export class AppController {
  constructor(private readonly getRelevantCompanies: GetRelevantCompanies) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/companies')
  async getCompanies(
    @Res({ passthrough: true }) res: Response,
    @Query('workerId') workerId = '1',
    @Query('maxDistance') maxDistance = '25',
    @Query('minSkills') minSkills = '1',
  ) {
    return await this.getRelevantCompanies.execute({
      workerId: parseInt(workerId, 10),
      maxDistance: parseInt(maxDistance, 10),
      minSkills: parseInt(minSkills, 10),
    });
  }
}

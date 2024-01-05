import { ClassSerializerInterceptor, Controller, Get, Query, Res, UseInterceptors } from "@nestjs/common";
import { GetRelevantCompanies } from '../../domain/get-revelant-companies.use-case';
import { SearchEngineAlgolia } from "../../infra/adapter/search-engine.algolia";
import { SearchCompaniesUseCase } from "../../domain/search-companies.use-case";
import { DataFinder } from "../../infra/adapter/data-finder";

@Controller()
export class AppController {

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/find')
  async findCompanies(
    @Res({ passthrough: true }) res: Response,
    @Query('workerId') workerId = '1',
    @Query('maxDistance') maxDistance = '50',
  ) {
    const getRelevantCompanies = new GetRelevantCompanies(
      new DataFinder(),
    );
    return await getRelevantCompanies.execute({
      workerId: parseInt(workerId, 10),
      positionId: 1,
      maxDistance: parseInt(maxDistance, 10),
      skills: [3, 2],
      dates: {
        min: new Date('2024-01-11'),
        max: new Date('2024-01-18'),
      },
    });
  }

  @Get('/search')
  async search(
    @Res({ passthrough: true }) res: Response,
  ) {
    const searchCompanies = new SearchCompaniesUseCase(
      new SearchEngineAlgolia(
        process.env.ALGOLIA_APP_ID,
        process.env.ALGOLIA_SEARCH_API_KEY,
        process.env.ALGOLIA_INDEX_NAME
      ),
    );

    return await searchCompanies.execute({
      position: 'Coordinateur',
      maxDistance: 30,
      skills: ['Programmation'],
      dates: {
        min: new Date('2024-01-01'),
        max: new Date('2024-01-17'),
      },
    });
  }
}

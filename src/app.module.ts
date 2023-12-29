import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { GetRelevantCompanies } from './search/get-revelant-companies.use-case';
import { PrismaService } from "./misc/app.prisma-service";
import { DataAccessObject } from "./search/data-access-object";
import { AddToIndex } from "./search/add-to-index";
import { ISearchEngine } from "./search/search-engine.interface";
import { SearchEngineFake } from "./search/search-engine.fake";

const searchEngineImpl = {
  provide: ISearchEngine,
  useClass: SearchEngineFake
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    GetRelevantCompanies,
    PrismaService,
    DataAccessObject,
    AddToIndex,
    searchEngineImpl
  ],
})
export class AppModule {}

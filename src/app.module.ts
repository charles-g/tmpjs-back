import { Module } from '@nestjs/common';
import { AppController } from './search/app/controller/app.controller';
import { GetRelevantCompanies } from './search/domain/get-revelant-companies.use-case';
import { DataAccessObject } from "./search/infra/data-access-object";
import { AddToIndex } from "./search/domain/add-to-index.use-case";
import { ISearchEngine } from "./search/domain/search-engine.interface";
import { SearchEngineFake } from "./search/infra/search-engine.fake";
import { IDocumentRepository } from "./search/domain/document-repository.interface";
import { ICompanyFinder } from "./search/domain/company-finder.interface";

const searchEngineImpl = {
  provide: ISearchEngine,
  useClass: SearchEngineFake
}

const companyFinderImpl = {
  provide: ICompanyFinder,
  useClass: DataAccessObject
}

const documentRepositoryImpl = {
  provide: IDocumentRepository,
  useClass: DataAccessObject
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    GetRelevantCompanies,
    DataAccessObject,
    AddToIndex,
    searchEngineImpl,
    companyFinderImpl,
    documentRepositoryImpl
  ],
})
export class AppModule {}

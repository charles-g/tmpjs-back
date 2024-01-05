import { Module } from '@nestjs/common';
import { AppController } from './search/app/controller/app.controller';
import { DataAccessObject } from "./search/infra/adapter/data-access-object";
import { AddToIndex } from "./search/domain/add-to-index.use-case";
import { ISearchEngine } from "./search/domain/ports/search-engine.interface";
import { SearchEngineFake } from "./search/infra/adapter/search-engine.fake";
import { IDocumentRepository } from "./search/domain/ports/document-repository.interface";

const searchEngineProvider = {
  provide: ISearchEngine,
  useClass: SearchEngineFake
}

const documentRepositoryProvider = {
  provide: IDocumentRepository,
  useClass: DataAccessObject
}

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    DataAccessObject,
    AddToIndex,
    searchEngineProvider,
    documentRepositoryProvider,
  ],
})
export class AppModule {}

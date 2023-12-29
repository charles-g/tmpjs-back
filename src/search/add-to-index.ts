import { Injectable } from "@nestjs/common";
import { ISearchEngine } from "./search-engine.interface";
import { DataAccessObject } from "./data-access-object";

@Injectable()
export class AddToIndex {

  private readonly repository: DataAccessObject;
  private readonly searchEngine: ISearchEngine;

  public constructor(
    repository : DataAccessObject,
    searchEngine: ISearchEngine,
  ) {
    this.repository = repository;
    this.searchEngine = searchEngine;
  }

  public async execute() {
    // Get all CompanySearchResult and add them to the index
    const items = await this.repository.getAllDocuments();
    await this.searchEngine.addDocumentsToIndex(items);
    // const promises = [];
    // documents.forEach((document) => {
    //   promises.push(this.searchEngine.addDocumentToIndex(document));
    // });
    // await Promise.all(promises);
  }

}

import { Injectable } from "@nestjs/common";
import { ISearchEngine } from "./ports/search-engine.interface";
import { IDocumentRepository } from "./ports/document-repository.interface";

@Injectable()
export class AddToIndex {

  private readonly documentRepository: IDocumentRepository;
  private readonly searchEngine: ISearchEngine;

  public constructor(
    documentRepository : IDocumentRepository,
    searchEngine: ISearchEngine,
  ) {
    this.documentRepository = documentRepository;
    this.searchEngine = searchEngine;
  }

  public async execute() {
    const items = await this.documentRepository.getAllDocuments();
    await this.searchEngine.addDocumentsToIndex(items);
  }

}

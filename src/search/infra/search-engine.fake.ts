import { ISearchEngine } from "../domain/search-engine.interface";
import * as fs from "fs";

export class SearchEngineFake implements ISearchEngine {

  private writeToJsonFile(documents: any[], filePath: string): void {
    const jsonString = JSON.stringify(documents, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf-8');
    console.log(`Data written to ${filePath}`);
  }

  public async addDocumentsToIndex(documents: any[]): Promise<void> {
    this.writeToJsonFile(documents, 'search-index.json');
  }
}

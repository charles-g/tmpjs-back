import { ISearchEngine } from "./search-engine.interface";
import * as fs from "fs";

export class SearchEngineFake implements ISearchEngine {

  private writeToJsonFile(documents: any[], filePath: string): void {
    // Convert the array to a JSON string
    const jsonString = JSON.stringify(documents, null, 2); // The third parameter (2) specifies the number of spaces for indentation
    // Write the JSON string to the file
    fs.writeFileSync(filePath, jsonString, 'utf-8');
    console.log(`Data written to ${filePath}`);
  }

  public async addDocumentToIndex(document: any): Promise<void> {
  }

  public async addDocumentsToIndex(documents: any[]): Promise<void> {
    // write to file
    this.writeToJsonFile(documents, 'search-index.json');
  }
}

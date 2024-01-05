import { ISearchEngine } from "../../domain/ports/search-engine.interface";
import * as fs from "fs";

export class SearchEngineFake implements ISearchEngine {

  private writeToJsonFile(documents: any[], filePath: string): void {
    const jsonString = JSON.stringify(documents, null, 2);
    fs.writeFileSync(filePath, jsonString, 'utf-8');
    console.log(`Data written to ${filePath}`);
  }

  public async addDocumentsToIndex(documents: any[]): Promise<void> {
    this.writeToJsonFile(documents, 'documents/search-index.json');
  }

  public async searchCompanies(
    position: string | null,
    maxDistance: number | null,
    skills: Array<string> | null,
    dates: {min: number, max:number} | null
  ): Promise<any> {
    const searchIndex = JSON.parse(fs.readFileSync('search-index.json', 'utf-8'));
    return searchIndex;
  }
}

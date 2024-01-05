export abstract class ISearchEngine {
  public abstract addDocumentsToIndex(documents: any[]): Promise<any>;
}

export abstract class ISearchEngine {
  public abstract addDocumentToIndex(document: any): Promise<any>;

  public abstract addDocumentsToIndex(documents: any[]): Promise<any>;
}

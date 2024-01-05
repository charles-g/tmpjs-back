import { CompanyInfoDocument } from "./dto/company-search-result";

export abstract class IDocumentRepository {
  abstract getAllDocuments(): Promise<Array<CompanyInfoDocument>>;
}

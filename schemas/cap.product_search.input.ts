/**
 * CAP Product Search Input Schema
 * 
 * Input parameters for the cap:product_search skill.
 */
export interface ProductSearchInput {
  /** 
   * Search query string for finding products
   */
  query: string;

  /**
   * Query interpretation mode.
   * 
   * - `keyword`: Bag-of-words style matching where terms may appear in any order. This is the default and MUST be supported by Merchant Agents.
   * - `phrase`: Phrase or natural-language matching where term order and proximity matter.
   * 
   * If omitted, clients SHOULD assume `keyword`. Merchant Agents MAY infer mode from input as they see fit.
   */
  queryMode?: 'keyword' | 'phrase';

  /**
   * Optional filter expression to refine the product search.
   * 
   * See CAP Specification §5.2.2 “Query Formulation” for the
   * RECOMMENDED SQL WHERE-like format and guidance on merchant-declared support.
   */
  filter?: string;

  /** 
   * Number of results to skip for pagination
   * @default 0
   */
  offset?: number;

  /** 
   * Maximum number of results to return
   * @default 20
   * @maximum 100 (hard limit)
   */
  limit?: number;
}

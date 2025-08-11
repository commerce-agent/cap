/**
 * CAP Product Search Output Schema
 * 
 * Response format for the cap:product_search skill.
 * Aligned with schema.org Product schema for interoperability.
 */

/**
 * Product availability status (based on schema.org ItemAvailability)
 */
export type ProductAvailability = 'inStock' | 'outOfStock' | 'preOrder';

/**
 * Product offer information (schema.org Offer semantics)
 */
export interface ProductOffer {
  /** 
   * Unique offer identifier (CAP Offer URN format)
   * Format: urn:Offer:<offerId> where <offerId> is opaque merchant-specific identifier
   */
  id?: string;

  /** 
   * Offer price as decimal string for precision (schema.org Offer.price semantics)
   */
  price?: string;

  /** 
   * Currency code (schema.org Offer.priceCurrency semantics, ISO 4217)
   */
  priceCurrency?: string;

  /** 
   * Offer availability status (schema.org Offer.availability semantics)
   */
  availability?: ProductAvailability;

  // Extensible: Additional schema.org Offer fields like seller, url, priceValidUntil, etc.
  [key: string]: unknown;
}

/**
 * Summary information for a product in search results
 * 
 * All fields except `id` follow schema.org Product semantics.
 * The `id` field uses CAP's specific Product URN format.
 * Designed to be LLM-friendly with rich descriptive content.
 */
export interface ProductSummary {
  /** 
   * Unique product identifier (CAP Product URN format)
   * Format: urn:Product:<property>:<value>
   */
  id: string;

  /** 
   * Product name/title (schema.org Product.name semantics)
   */
  name: string;

  /** 
   * Rich product description for LLM understanding
   * Unstructured text providing context, features, and details
   */
  description?: string;

  /** 
   * URL to product thumbnail image (schema.org Product.image semantics)
   */
  image?: string;

  /** 
   * Product offers array (schema.org Product.offers semantics)
   * Contains pricing, availability, and offer-specific information
   */
  offers?: ProductOffer[];

  // Extensible: Merchants may include additional fields following schema.org Product semantics
  // such as brand, category, manufacturer, model, etc.
  [key: string]: unknown;
}

/**
 * Contextual information to help LLMs understand and interpret the search results
 * Provides guidance on search intent, filtering applied, result quality, and recommendations
 */
export interface SearchOutputContext {
  /**
   * Description of the search results
   * This is a free-form text field that can be used to provide additional context to the LLM
   */
  description?: string;

  /**
   * Optional suggestions for additional refinements that the client could offer to the user.
   * 
   * Each tuple describes an attribute that is meaningful in the current result set context:
   *   [attributeName, valueType, humanDescription]
   * 
   * - attributeName: canonical attribute identifier (e.g., "price", "screenSize")
   * - valueType: simple type hint for UI/LLM (e.g., "string", "number", "enum", "range")
   * - humanDescription: short description of the filter (e.g., "Screen size in inches", "Price in USD")
   * 
   * Merchants MAY include additional guidance via the humanDescription, including enumerated value hints.
   */
  refineFilters?: [string, string, string][];

  
}

/**
 * Response for cap:product_search skill
 * Designed to provide both structured data and contextual information for LLM processing
 */
export interface ProductSearchOutput {
  /** 
   * Array of product summaries matching the search
   */
  products: ProductSummary[];

  /** 
   * Total number of products available (for pagination)
   */
  totalResults: number;

  /** 
   * Number of results skipped (from request)
   */
  offset: number;

  /** 
   * Number of results returned in this response
   */
  limit: number;

  /** 
   * Contextual information to help LLMs understand and interpret the search results
   * Provides guidance on search intent, filtering applied, result quality, and recommendations
   */
  context?: SearchOutputContext;
}

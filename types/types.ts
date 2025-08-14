/**
 * CAP (Commerce Agent Protocol) TypeScript Type Definitions
 * 
 * This file contains all TypeScript types used in the CAP specification.
 * Each interface is wrapped in snippet section fences for individual reference.
 */

// =============================================================================
// Common Types
// =============================================================================

// --8<-- [start:ProductAvailability]
/**
 * Product availability status (based on schema.org ItemAvailability)
 */
export type ProductAvailability = 'inStock' | 'outOfStock' | 'preOrder';
// --8<-- [end:ProductAvailability]

// --8<-- [start:ProductOffer]
/**
 * Product offer information (schema.org Offer semantics)
 */
export interface ProductOffer {
  /**
   * Unique offer identifier
   */
  identifier: string;
  
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

  /**
   * Additional type classification for offers (schema.org Offer.additionalType semantics)
   * 
   * Used for Standard Offers to specify promotional patterns using CAP Standard Offer URNs.
   * 
   * Examples:
   * - "urn:cap:StandardOffer:BOGO50" - Buy one, get one 50% off
   * - "urn:cap:StandardOffer:BTGOF" - Buy two, get one free
   * - "urn:cap:StandardOffer:PCT20" - 20% off
   * 
   * Can also accept other URI-identified classifications or arrays of classifications.
   * Standard Offers registry: https://cap-spec.org/registry/standard-offers/
   */
  additionalType?: string | string[];

  // Extensible: Additional schema.org Offer fields like seller, url, priceValidUntil, etc.
  [key: string]: unknown;
}
// --8<-- [end:ProductOffer]

// --8<-- [start:ProductSummary]
/**
 * Summary information for a product in search results
 * 
 * All fields except `id` follow schema.org Product semantics.
 * The `id` field is an opaque product identifier provided by the merchant.
 * Designed to be LLM-friendly with rich descriptive content.
 */
export interface ProductSummary {
  /** 
   * Unique product identifier (opaque string provided by merchant)
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
// --8<-- [end:ProductSummary]

// --8<-- [start:ProductVariant]
/**
 * Product variant information
 * 
 * Represents a specific variant of a product (e.g., different size, color, configuration).
 * Follows schema.org Product.hasVariant semantics where each variant is itself a Product.
 */
export interface ProductVariant {
  /** 
   * Variant identifier (unique within the parent product)
   * Format: merchant-specific variant ID
   */
  id?: string;

  /** 
   * Variant name/title for display
   * Human-readable description (e.g., "Large Red", "32GB WiFi")
   */
  name?: string;

  /** 
   * Variant offers array (schema.org Product.offers semantics)
   * Contains variant-specific pricing and availability
   */
  offers?: ProductOffer[];

  /** 
   * Variant images array (schema.org Product.image semantics)
   * Images specific to this variant
   */
  images?: string[];

  // Extensible: Merchants SHOULD include variant-specific schema.org Product fields
  // Examples: size, color, material, pattern, sku, gtin, weight, additionalProperty, etc.
  // Each variant property should follow schema.org Product semantics
  [key: string]: unknown;
}
// --8<-- [end:ProductVariant]

// --8<-- [start:ProductReviewSummary]
/**
 * Product review summary information
 * 
 * Follows schema.org AggregateRating semantics for review data.
 * See https://schema.org/AggregateRating for additional properties.
 */
export interface ProductReviewSummary {
  /** 
   * Average rating value (schema.org AggregateRating.ratingValue semantics)
   * Typically on a 1-5 scale, but merchants MAY use different scales
   */
  ratingValue?: number;

  /** 
   * Total number of reviews (schema.org AggregateRating.reviewCount semantics)
   */
  reviewCount?: number;

  /** 
   * Total number of ratings (schema.org AggregateRating.ratingCount semantics)
   * May differ from reviewCount if ratings without text reviews are included
   */
  ratingCount?: number;

  // Extensible: Merchants SHOULD include additional schema.org AggregateRating fields
  // Examples: worstRating, bestRating, ratingExplanation, etc.
  [key: string]: unknown;
}
// --8<-- [end:ProductReviewSummary]

// --8<-- [start:ShippingOption]
/**
 * Shipping option information
 * 
 * Represents available shipping methods for a product.
 * Follows schema.org OfferShippingDetails and DeliveryMethod semantics.
 */
export interface ShippingOption {
  /** 
   * Shipping method name (e.g., "Standard", "Express", "Overnight")
   * Human-readable shipping option identifier
   */
  name: string;

  /** 
   * Shipping cost as decimal string (schema.org OfferShippingDetails.shippingRate semantics)
   */
  price?: string;

  /** 
   * Currency code (ISO 4217) for shipping cost
   */
  priceCurrency?: string;

  /** 
   * Estimated delivery date or timeframe
   * ISO 8601 date format or human-readable timeframe
   */
  estimatedDelivery?: string;

  // Extensible: Merchants SHOULD include additional schema.org shipping-related fields
  // Examples: deliveryTime, shippingDestination, transitTimeLabel, doesNotShip, etc.
  [key: string]: unknown;
}
// --8<-- [end:ShippingOption]

// --8<-- [start:CartTotals]
/**
 * Cart totals and pricing information
 */
export interface CartTotals {
  /** 
   * Subtotal (sum of all line totals) as decimal string
   */
  subtotal: string;

  /** 
   * Currency code for all amounts
   */
  currency: string;

  /** 
   * Total tax amount as decimal string
   */
  tax?: string;

  /** 
   * Shipping cost as decimal string
   */
  shipping?: string;

  /** 
   * Discount amount as decimal string (if any)
   */
  discount?: string;

  /** 
   * Final total as decimal string
   */
  total: string;

  /** 
   * Detailed tax calculations (if includeTaxCalculations was true)
   */
  taxDetails?: TaxCalculation[];

  /** 
   * Estimated tax (when exact calculation not available)
   */
  estimatedTax?: boolean;
}
// --8<-- [end:CartTotals]

// --8<-- [start:TaxCalculation]
/**
 * Tax calculation details
 */
export interface TaxCalculation {
  /** 
   * Tax type (e.g., "sales_tax", "vat", "gst")
   */
  type: string;

  /** 
   * Tax rate as decimal (e.g., 0.0875 for 8.75%)
   */
  rate: number;

  /** 
   * Tax amount as decimal string
   */
  amount: string;

  /** 
   * Currency code
   */
  currency: string;

  /** 
   * Tax jurisdiction (e.g., "CA", "NY", "UK")
   */
  jurisdiction?: string;
}
// --8<-- [end:TaxCalculation]

// --8<-- [start:UserDataConsent]
/**
 * User data consent values
 */
export type UserDataConsent = 
  | 'absent'     // No consent provided (default)
  | 'none'       // Explicit rejection of consent
  | 'all';       // Consent to the standard "all" policy
// --8<-- [end:UserDataConsent]

// --8<-- [start:LocalePreferences]
/**
 * User language and locale preferences
 */
export interface LocalePreferences {
  /** 
   * Preferred language (IETF BCP 47 language tag)
   * Example: "en-US", "es-ES", "fr-CA"
   */
  language?: string;

  /** 
   * Preferred country/region (ISO 3166-1 alpha-2)
   * Used for localized content and shipping
   */
  country?: string;

  /** 
   * Preferred currency (ISO 4217)
   * Example: "USD", "EUR", "GBP"
   */
  currency?: string;

  /** 
   * Timezone (IANA Time Zone Database)
   * Example: "America/New_York", "Europe/London"
   */
  timezone?: string;
}
// --8<-- [end:LocalePreferences]

// --8<-- [start:ShoppingPreferences]
/**
 * Shopping and product preferences
 */
export interface ShoppingPreferences {
  /** 
   * Preferred product categories or interests
   */
  categories?: string[];

  /** 
   * Preferred brands
   */
  brands?: string[];

  /** 
   * Price range preferences
   */
  priceRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };

  /** 
   * Size preferences (clothing, shoes, etc.)
   */
  sizes?: Record<string, string>;

  /** 
   * Color preferences
   */
  colors?: string[];

  /** 
   * Style or aesthetic preferences
   */
  styles?: string[];

  /** 
   * Specific product features of interest
   */
  features?: string[];
}
// --8<-- [end:ShoppingPreferences]

// --8<-- [start:AccessibilityPreferences]
/**
 * Accessibility preferences
 */
export interface AccessibilityPreferences {
  /** 
   * Screen reader compatibility
   */
  screenReader?: boolean;

  /** 
   * High contrast mode preference
   */
  highContrast?: boolean;

  /** 
   * Large text preference
   */
  largeText?: boolean;

  /** 
   * Reduced motion preference
   */
  reducedMotion?: boolean;

  /** 
   * Audio description preference
   */
  audioDescription?: boolean;
}
// --8<-- [end:AccessibilityPreferences]

// --8<-- [start:CommunicationPreferences]
/**
 * Communication preferences
 */
export interface CommunicationPreferences {
  /** 
   * Preferred communication language
   */
  language?: string;

  /** 
   * Email notification preferences
   */
  email?: {
    marketing?: boolean;
    orderUpdates?: boolean;
    recommendations?: boolean;
    newsletters?: boolean;
  };

  /** 
   * SMS notification preferences
   */
  sms?: {
    orderUpdates?: boolean;
    deliveryNotifications?: boolean;
    promotions?: boolean;
  };

  /** 
   * Preferred contact method
   */
  preferredMethod?: 'email' | 'sms' | 'phone' | 'none';
}
// --8<-- [end:CommunicationPreferences]

// --8<-- [start:ShippingAddress]
/**
 * Customer shipping address
 */
export interface ShippingAddress {
  /** 
   * Full name for delivery
   */
  name: string;

  /** 
   * Street address line 1
   */
  addressLine1: string;

  /** 
   * Street address line 2 (optional)
   */
  addressLine2?: string;

  /** 
   * City
   */
  city: string;

  /** 
   * State/Province/Region
   */
  state: string;

  /** 
   * Postal/ZIP code
   */
  postalCode: string;

  /** 
   * Country code (ISO 3166-1 alpha-2)
   */
  country: string;

  /** 
   * Phone number for delivery
   */
  phone?: string;

  /** 
   * Delivery instructions
   */
  instructions?: string;
}
// --8<-- [end:ShippingAddress]

// --8<-- [start:BillingAddress]
/**
 * Customer billing address
 */
export interface BillingAddress {
  /** 
   * Full name on billing account
   */
  name: string;

  /** 
   * Street address line 1
   */
  addressLine1: string;

  /** 
   * Street address line 2 (optional)
   */
  addressLine2?: string;

  /** 
   * City
   */
  city: string;

  /** 
   * State/Province/Region
   */
  state: string;

  /** 
   * Postal/ZIP code
   */
  postalCode: string;

  /** 
   * Country code (ISO 3166-1 alpha-2)
   */
  country: string;
}
// --8<-- [end:BillingAddress]

// --8<-- [start:OrderStatus]
/**
 * Order status values
 */
export type OrderStatus = 
  | 'pending_payment'      // Awaiting payment
  | 'payment_processing'   // Payment being processed
  | 'confirmed'           // Order confirmed and paid
  | 'processing'          // Being prepared/manufactured
  | 'shipped'             // In transit
  | 'out_for_delivery'    // Out for delivery
  | 'delivered'           // Successfully delivered
  | 'failed'              // Payment or processing failed
  | 'cancelled'           // Order cancelled
  | 'returned'            // Order returned
  | 'refunded';           // Order refunded
// --8<-- [end:OrderStatus]

// --8<-- [start:PaymentStatus]
/**
 * Payment status information
 */
export interface PaymentStatus {
  /** 
   * Payment status
   */
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';

  /** 
   * Payment method used
   */
  method?: string;

  /** 
   * Payment processor
   */
  processor?: string;

  /** 
   * Payment amount
   */
  amount?: string;

  /** 
   * Currency code
   */
  currency?: string;

  /** 
   * Payment date/time (ISO 8601)
   */
  paidAt?: string;

  /** 
   * Refund information (if applicable)
   */
  refund?: {
    amount: string;
    currency: string;
    reason?: string;
    refundedAt: string;
  };

  /** 
   * Transaction identifier from payment processor
   */
  transactionId?: string;
}
// --8<-- [end:PaymentStatus]

// --8<-- [start:TrackingInfo]
/**
 * Tracking information for shipments
 */
export interface TrackingInfo {
  /** 
   * Tracking number
   */
  trackingNumber: string;

  /** 
   * Shipping carrier
   */
  carrier: string;

  /** 
   * Carrier tracking URL
   */
  trackingUrl?: string;

  /** 
   * Current tracking status
   */
  status: 'label_created' | 'picked_up' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'exception';

  /** 
   * Last known location
   */
  currentLocation?: string;

  /** 
   * Estimated delivery date (ISO 8601)
   */
  estimatedDelivery?: string;

  /** 
   * Actual delivery date (ISO 8601)
   */
  deliveredAt?: string;

  /** 
   * Recent tracking events
   */
  events?: Array<{
    timestamp: string;
    status: string;
    location?: string;
    description: string;
  }>;
}
// --8<-- [end:TrackingInfo]

// --8<-- [start:CartAction]
/**
 * Cart operation types
 */
export type CartAction = 'view' | 'add' | 'update' | 'remove' | 'clear';
// --8<-- [end:CartAction]

// =============================================================================
// Product Search Types
// =============================================================================

// --8<-- [start:ProductSearchInput]
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
   * See CAP Specification §5.2.2 "Query Formulation" for the
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
// --8<-- [end:ProductSearchInput]

// --8<-- [start:SearchOutputContext]
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
// --8<-- [end:SearchOutputContext]

// --8<-- [start:ProductSearchOutput]
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
// --8<-- [end:ProductSearchOutput]

// =============================================================================
// Product Get Types
// =============================================================================

// --8<-- [start:ProductGetInput]
/**
 * CAP Product Get Input Schema
 * 
 * Input parameters for the cap:product_get skill.
 * 
 * Returns comprehensive product information by default, following schema.org Product semantics.
 * Default response includes: name, description, images, offers (with price, currency, availability),
 * variants, reviews, and other available schema.org Product fields.
 */
export interface ProductGetInput {
  /** 
   * Array of product identifiers to retrieve.
   * Each identifier is an opaque string provided by the merchant.
   * 
   * Examples:
   * - "ABC123"
   * - "PROD456"
   * - "1234567890123"
   */
  productIds: string[];

  /**
   * Optional field selector to limit response data.
   * If omitted, returns comprehensive product information including all available
   * schema.org Product fields, offers with availability, variants, and reviews.
   * 
   * When specified, merchants SHOULD return only the requested fields:
   * - Individual schema.org Product fields: "name", "brand", "gtin", "weight", etc.
   * - Field groups: "basic" (core fields), "offers" (pricing/availability), "variants", "reviews"
   * 
   * Availability information (schema.org Offer.availability) is included by default
   * when offers are returned, either explicitly requested or in comprehensive response.
   */
  fields?: string[];
}
// --8<-- [end:ProductGetInput]

// --8<-- [start:ProductDetail]
/**
 * Detailed product information
 * 
 * Follows schema.org Product semantics with extensibility.
 * Consistent with ProductSummary structure from product_search.
 */
export interface ProductDetail {
  /** 
   * Unique product identifier (opaque string provided by merchant)
   */
  id: string;

  /** 
   * Product name/title (schema.org Product.name semantics)
   */
  name: string;

  /** 
   * Rich product description for detailed understanding
   * Unstructured text providing context, features, specifications, and details
   * (schema.org Product.description semantics)
   */
  description?: string;

  /** 
   * Product images array (schema.org Product.image semantics)
   * Primary product image should be first in array
   */
  images?: string[];

  /** 
   * Product offers array (schema.org Product.offers semantics)
   * Contains pricing, availability, and offer-specific information
   */
  offers?: ProductOffer[];

  /** 
   * Product variants (different sizes, colors, configurations, etc.)
   * Represents schema.org Product.hasVariant semantics
   */
  variants?: ProductVariant[];

  /** 
   * Review summary information
   * Aggregated customer feedback data
   */
  reviews?: ProductReviewSummary;

  /** 
   * Available shipping options for this product
   * Merchant-specific delivery methods and costs
   */
  shipping?: ShippingOption[];

  /** 
   * Product URL on merchant's website (schema.org Product.url semantics)
   * Direct link to the product page
   */
  url?: string;

  // Extensible: Merchants SHOULD include additional schema.org Product fields
  // Examples: brand, category, manufacturer, model, gtin, mpn, sku, weight, etc.
  // See schema.org Product specification for complete field list
  [key: string]: unknown;
}
// --8<-- [end:ProductDetail]

// --8<-- [start:ProductGetOutput]
/**
 * Response for cap:product_get skill
 */
export interface ProductGetOutput {
  /** 
   * Array of detailed product information
   * Order matches the input productIds array
   */
  products: (ProductDetail | null)[];

  /** 
   * Array indicating which products were not found
   * Maps to the same indices as the input productIds array
   */
  notFound?: string[];

  /** 
   * Contextual information about the response
   */
  context?: {
    /** 
     * Description of any limitations or notes about the response
     */
    description?: string;

    /** 
     * Timestamp when product information was last updated
     */
    lastUpdated?: string;
  };
}
// --8<-- [end:ProductGetOutput]

// =============================================================================
// Cart Management Types
// =============================================================================

// --8<-- [start:CartItem]
/**
 * Item to add or update in the cart
 */
export interface CartItem {
  /** 
   * Product identifier (opaque string provided by merchant)
   */
  productId: string;

  /** 
   * Specific variant identifier (if applicable)
   */
  variantId?: string;

  /** 
   * Variant attributes (if not using variantId)
   * Example: { "size": "Large", "color": "Red" }
   */
  variantAttributes?: Record<string, string>;

  /** 
   * Quantity to add/update to
   * For 'update' action: new total quantity
   * For 'add' action: quantity to add
   */
  quantity: number;

  /** 
   * Client-provided item identifier for tracking
   * Useful for managing multiple instances of the same product with different variants
   */
  clientItemId?: string;
}
// --8<-- [end:CartItem]

// --8<-- [start:CartItemReference]
/**
 * Reference to an existing cart item for update/remove operations
 */
export interface CartItemReference {
  /** 
   * Cart line item ID (from previous cart responses)
   */
  cartItemId?: string;

  /** 
   * Client-provided item identifier
   */
  clientItemId?: string;

  /** 
   * Product identifier (alternative to cartItemId)
   */
  productId?: string;

  /** 
   * Variant identifier (if using productId)
   */
  variantId?: string;

  /** 
   * Variant attributes (if using productId without variantId)
   */
  variantAttributes?: Record<string, string>;
}
// --8<-- [end:CartItemReference]

// --8<-- [start:CartManageInput]
export interface CartManageInput {
  /** 
   * The cart operation to perform
   */
  action: CartAction;

  /** 
   * Cart identifier (if working with a specific cart)
   * If omitted, uses the user's default/active cart
   */
  cartId?: string;

  /** 
   * Items to add to cart (for 'add' action)
   */
  addItems?: CartItem[];

  /** 
   * Items to update in cart (for 'update' action)
   * Quantity represents the new total quantity
   */
  updateItems?: (CartItemReference & { quantity: number })[];

  /** 
   * Items to remove from cart (for 'remove' action)
   */
  removeItems?: CartItemReference[];

  /** 
   * For 'update' action on single item - new quantity
   * Alternative to using updateItems array for single item operations
   */
  quantity?: number;

  /** 
   * For single item operations - item reference
   * Alternative to using arrays for single item operations
   */
  item?: CartItemReference;

  /** 
   * Include detailed product information in response
   * @default false
   */
  includeProductDetails?: boolean;

  /** 
   * Include available shipping options in response
   * @default false
   */
  includeShippingOptions?: boolean;

  /** 
   * Include tax calculations in response
   * @default false
   */
  includeTaxCalculations?: boolean;
}
// --8<-- [end:CartManageInput]

// --8<-- [start:CartLineItem]
/**
 * Individual cart line item
 */
export interface CartLineItem {
  /** 
   * Unique cart line item identifier
   */
  cartItemId: string;

  /** 
   * Product identifier (opaque string provided by merchant)
   */
  productId: string;

  /** 
   * Product name for display
   */
  productName: string;

  /** 
   * Variant identifier (if applicable)
   */
  variantId?: string;

  /** 
   * Variant attributes (if applicable)
   * Example: { "size": "Large", "color": "Red" }
   */
  variantAttributes?: Record<string, string>;

  /** 
   * Human-readable variant description
   */
  variantDescription?: string;

  /** 
   * Quantity in cart
   */
  quantity: number;

  /** 
   * Unit price as decimal string
   */
  unitPrice: string;

  /** 
   * Currency code (ISO 4217)
   */
  priceCurrency: string;

  /** 
   * Line total (unit price × quantity) as decimal string
   */
  lineTotal: string;

  /** 
   * Product availability status
   */
  availability?: 'inStock' | 'outOfStock' | 'limitedStock' | 'preOrder';

  /** 
   * Maximum quantity available (if limited)
   */
  maxQuantity?: number;

  /** 
   * Product image URL
   */
  image?: string;

  /** 
   * Product URL on merchant site
   */
  productUrl?: string;

  /** 
   * Client-provided item identifier (if provided in add request)
   */
  clientItemId?: string;

  /** 
   * Detailed product information (if includeProductDetails was true)
   */
  productDetails?: ProductSummary;

  /** 
   * Any warnings or notes about this item
   */
  warnings?: string[];
}
// --8<-- [end:CartLineItem]

// --8<-- [start:CartState]
/**
 * Cart state and metadata
 */
export interface CartState {
  /** 
   * Unique cart identifier
   */
  cartId: string;

  /** 
   * Total number of items in cart
   */
  itemCount: number;

  /** 
   * Cart creation timestamp (ISO 8601)
   */
  createdAt?: string;

  /** 
   * Last modification timestamp (ISO 8601)
   */
  updatedAt?: string;

  /** 
   * Cart expiration timestamp (ISO 8601)
   */
  expiresAt?: string;

  /** 
   * Whether the cart is ready for checkout
   */
  readyForCheckout?: boolean;

  /** 
   * Any cart-level warnings or messages
   */
  warnings?: string[];
}
// --8<-- [end:CartState]

// --8<-- [start:CartOperationResult]
/**
 * Result of cart operation
 */
export interface CartOperationResult {
  /** 
   * Whether the operation was successful
   */
  success: boolean;

  /** 
   * Error message (if operation failed)
   */
  error?: string;

  /** 
   * Items that were successfully processed
   */
  successfulItems?: string[];

  /** 
   * Items that failed processing with reasons
   */
  failedItems?: Array<{
    item: string;
    reason: string;
  }>;
}
// --8<-- [end:CartOperationResult]

// --8<-- [start:CartManageOutput]
/**
 * Response for cap:cart_manage skill
 */
export interface CartManageOutput {
  /** 
   * Result of the requested operation
   */
  operation: CartOperationResult;

  /** 
   * Current cart state after the operation
   */
  cart: CartState;

  /** 
   * Cart line items
   */
  items: CartLineItem[];

  /** 
   * Cart totals and pricing
   */
  totals: CartTotals;

  /** 
   * Available shipping options (if includeShippingOptions was true)
   */
  shippingOptions?: ShippingOption[];

  /** 
   * Contextual information
   */
  context?: {
    /** 
     * Description of any limitations or notes
     */
    description?: string;

    /** 
     * Timestamp of this cart state
     */
    timestamp?: string;

    /** 
     * Whether prices are estimates
     */
    estimatedPricing?: boolean;
  };
}
// --8<-- [end:CartManageOutput]

// =============================================================================
// Order Status Types
// =============================================================================

// --8<-- [start:OrderStatusInput]
/**
 * CAP Order Status Input Schema
 * 
 * Input parameters for the cap:order_status skill.
 */
export interface OrderStatusInput {
  /** 
   * Order identifier(s) to check status for
   * Can be order ID, order number, or other merchant-recognized identifier
   */
  orderIds: string[];

  /** 
   * Include detailed tracking information in response
   * @default false
   */
  includeTracking?: boolean;

  /** 
   * Include order item details in response
   * @default false
   */
  includeItems?: boolean;

  /** 
   * Include payment status details in response
   * @default false
   */
  includePaymentStatus?: boolean;

  /** 
   * Include shipping cost breakdown in response
   * @default false
   */
  includeShippingDetails?: boolean;

  /** 
   * Include order history/timeline in response
   * @default false
   */
  includeHistory?: boolean;
}
// --8<-- [end:OrderStatusInput]

// --8<-- [start:OrderItem]
/**
 * Order item information
 */
export interface OrderItem {
  /** 
   * Product identifier
   */
  productId: string;

  /** 
   * Product name
   */
  productName: string;

  /** 
   * Variant information
   */
  variantId?: string;
  variantAttributes?: Record<string, string>;
  variantDescription?: string;

  /** 
   * Quantity ordered
   */
  quantity: number;

  /** 
   * Unit price
   */
  unitPrice: string;

  /** 
   * Line total
   */
  lineTotal: string;

  /** 
   * Currency
   */
  currency: string;

  /** 
   * Product image
   */
  image?: string;

  /** 
   * Item status (for partial fulfillment)
   */
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

  /** 
   * Individual tracking (if item ships separately)
   */
  tracking?: TrackingInfo;
}
// --8<-- [end:OrderItem]

// --8<-- [start:OrderHistoryEvent]
/**
 * Order history event
 */
export interface OrderHistoryEvent {
  /** 
   * Event timestamp (ISO 8601)
   */
  timestamp: string;

  /** 
   * Event type
   */
  type: 'created' | 'payment_completed' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded' | 'updated';

  /** 
   * Human-readable event description
   */
  description: string;

  /** 
   * Additional event details
   */
  details?: Record<string, unknown>;
}
// --8<-- [end:OrderHistoryEvent]

// --8<-- [start:OrderDetail]
/**
 * Detailed order information
 */
export interface OrderDetail {
  /** 
   * Order identifier from merchant
   */
  orderId: string;

  /** 
   * Customer-facing order number
   */
  orderNumber: string;

  /** 
   * Current order status
   */
  status: OrderStatus;

  /** 
   * Order creation date (ISO 8601)
   */
  createdAt: string;

  /** 
   * Last status update (ISO 8601)
   */
  updatedAt?: string;

  /** 
   * Order total information
   */
  totals: CartTotals;

  /** 
   * Customer information
   */
  customer?: {
    email?: string;
    phone?: string;
  };

  /** 
   * Shipping information
   */
  shipping?: {
    address: ShippingAddress;
    method: string;
    estimatedDelivery?: string;
    actualDelivery?: string;
  };

  /** 
   * Billing address
   */
  billing?: BillingAddress;

  /** 
   * Payment status (if includePaymentStatus was true)
   */
  payment?: PaymentStatus;

  /** 
   * Order items (if includeItems was true)
   */
  items?: OrderItem[];

  /** 
   * Tracking information (if includeTracking was true)
   */
  tracking?: TrackingInfo[];

  /** 
   * Order history (if includeHistory was true)
   */
  history?: OrderHistoryEvent[];

  /** 
   * Order notes or special instructions
   */
  notes?: string[];

  /** 
   * Error message if order lookup failed
   */
  error?: string;
}
// --8<-- [end:OrderDetail]

// --8<-- [start:OrderStatusOutput]
/**
 * Response for cap:order_status skill
 */
export interface OrderStatusOutput {
  /** 
   * Order details for each requested order ID
   * Order matches the input orderIds array
   */
  orders: (OrderDetail | null)[];

  /** 
   * Order IDs that were not found
   */
  notFound?: string[];

  /** 
   * Contextual information
   */
  context?: {
    /** 
     * Description of any limitations or notes
     */
    description?: string;

    /** 
     * Timestamp when status was checked
     */
    timestamp?: string;

    /** 
     * Data freshness indicator
     */
    dataAge?: number;
  };
}
// --8<-- [end:OrderStatusOutput]

// =============================================================================
// User Preferences Types
// =============================================================================

// --8<-- [start:UserPreferences]
/**
 * User preferences container
 */
export interface UserPreferences {
  /** 
   * User consent for data collection and personalization
   * REQUIRED field that determines how other preferences are used
   */
  userDataConsent: UserDataConsent;

  /** 
   * Language and locale preferences
   */
  locale?: LocalePreferences;

  /** 
   * Shopping and product preferences
   */
  shopping?: ShoppingPreferences;

  /** 
   * Accessibility preferences
   */
  accessibility?: AccessibilityPreferences;

  /** 
   * Communication preferences
   */
  communication?: CommunicationPreferences;

  /** 
   * Custom preferences (merchant-specific)
   * Key-value pairs for merchant-specific preference storage
   */
  custom?: Record<string, unknown>;
}
// --8<-- [end:UserPreferences]

// --8<-- [start:UserPreferencesSetInput]
export interface UserPreferencesSetInput {
  /** 
   * User preferences to set or update
   * If updating existing preferences (with contextId), only provided fields are updated
   */
  preferences: UserPreferences;

  /** 
   * Whether to replace all existing preferences or merge with existing
   * @default false (merge)
   */
  replaceAll?: boolean;

  /** 
   * Clear all preferences and revoke consent
   * When true, all other parameters are ignored
   * @default false
   */
  clearAll?: boolean;
}
// --8<-- [end:UserPreferencesSetInput]

// --8<-- [start:PreferencesUpdateResult]
/**
 * Result of preferences update operation
 */
export interface PreferencesUpdateResult {
  /** 
   * Whether the operation was successful
   */
  success: boolean;

  /** 
   * Error message if operation failed
   */
  error?: string;

  /** 
   * Error code for programmatic handling
   */
  errorCode?: string;

  /** 
   * Which preference fields were successfully updated
   */
  updatedFields?: string[];

  /** 
   * Which preference fields failed to update (with reasons)
   */
  failedFields?: Array<{
    field: string;
    reason: string;
  }>;
}
// --8<-- [end:PreferencesUpdateResult]

// --8<-- [start:PreferencesContext]
/**
 * Context information about the preferences
 */
export interface PreferencesContext {
  /** 
   * Whether this is a new context or update to existing
   */
  isNewContext: boolean;

  /** 
   * Timestamp when preferences were set (ISO 8601)
   */
  timestamp: string;

  /** 
   * How long preferences will be retained
   * Based on the consent level and merchant policies
   */
  retentionPolicy?: {
    /** 
     * Retention period description
     */
    description: string;

    /** 
     * Expiration date (ISO 8601) if applicable
     */
    expiresAt?: string;
  };

  /** 
   * Data processing policies applied
   */
  appliedPolicies?: string[];

  /** 
   * Warnings about preference limitations or conflicts
   */
  warnings?: string[];
}
// --8<-- [end:PreferencesContext]

// --8<-- [start:UserPreferencesSetOutput]
/**
 * Response for cap:user_preferences_set skill
 */
export interface UserPreferencesSetOutput {
  /** 
   * Result of the preferences update operation
   */
  operation: PreferencesUpdateResult;

  /** 
   * Current state of user preferences after the operation
   * Only includes preferences that were successfully set/updated
   */
  currentPreferences?: Partial<UserPreferences>;

  /** 
   * Context information about the preferences and consent
   */
  context: PreferencesContext;

  /** 
   * Available preference options and constraints
   * Helps client agents understand what preferences are supported
   */
  availableOptions?: {
    /** 
     * Supported languages
     */
    languages?: string[];

    /** 
     * Supported countries
     */
    countries?: string[];

    /** 
     * Supported currencies
     */
    currencies?: string[];

    /** 
     * Available product categories
     */
    categories?: string[];

    /** 
     * Supported custom preference fields
     */
    customFields?: Array<{
      key: string;
      type: string;
      description: string;
      required?: boolean;
    }>;
  };
}
// --8<-- [end:UserPreferencesSetOutput]

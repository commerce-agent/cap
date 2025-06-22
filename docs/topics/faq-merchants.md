# FAQ for Merchant Agents

This document addresses frequently asked questions for developers and engineers representing Merchants aiming to expose their e-commerce services via AICP.

## Integration and Data Mapping

### What are the best practices for mapping product identifiers, especially if our internal system uses different IDs than those expected via Schema.org or URNs (Section 3.1, 4.1.5)?
AICP recommends merchants support common identifiers discoverable via Schema.org (like `productID`, `sku`, `gtin`) and encourages the use of a canonical AICP Product URN (e.g., `urn:Product:productID:<value>`). Your Merchant Agent implementation should be prepared to accept these identifiers and normalize them to your internal product identification system (Section 4.1.5). Maintaining a mapping layer or using your most stable public identifier as the basis for the URN `<value>` is advisable.

## Discovery

### Which of the discovery mechanisms (DNS TXT, HTML link tag, .well-known URI - Section 4.1) should we prioritize?
For specific AICP endpoint discovery, the DNS TXT record (`_aicp.{merchant-domain}`) is RECOMMENDED (Section 4.1.1). The general A2A well-known URI (`/.well-known/agent.json`) is a good fallback or general A2A discovery method. Supporting multiple methods increases discoverability.

## Security and Authentication

### How should Merchant Agents handle the vetting of Client Agents that interact with them?
AICP `draft-01` defines the interaction protocol but does not specify a formal Client Agent vetting and verification process. Establishing trust may involve bilateral agreements or future community frameworks.

Regardless, Merchant Agents **MUST** harden their public-facing AICP endpoints by implementing standard API security best practices. This includes enforcing declared authentication for non-public skills (per AICP Spec Section 8.1), along with robust rate limiting, comprehensive input validation, diligent logging, active traffic monitoring to detect and mitigate abuse, and regular security audits. Such measures are essential for service integrity and security in an open ecosystem.

## Personalization and User Data Management

### How should we manage the A2A `contextId` and associated user data for personalization (Section 4.2.4) securely and in compliance with existing privacy laws?
Merchant Agents are responsible for securely managing the A2A `contextId` and any linked user preferences or data. This involves generating robust `contextId`s and ensuring that all collection, storage, usage, and deletion of personalized data associated with this `contextId` strictly adheres to the user's granted consent (obtained via the `aicp:user_preferences_set` skill and the `userDataConsent` field), the data privacy principles outlined in Section 7 of the AICP Specification, and all applicable privacy laws and regulations.

### What are our specific obligations if a Client Agent forwards a `userDataConsent` value, like `"all"`, as defined in Section 7.2.1?
If you accept the `"all"` policy (or any other standard policy defined), you **MUST** adhere to the terms of that policy regarding data collection, usage, sharing, and retention for the given `contextId`. This includes respecting the limitations on sharing identifiable personal information with unaffiliated third parties, as outlined in the policy.

### How should the AICP `contextId` for personalization interact with our existing fully authenticated user sessions (e.g., after a user logs in with OAuth 2.1)?
Section 4.2.4 states that if a `contextId` is provided alongside a valid OAuth 2.1 Access Token, the Merchant Agent MAY link the personalization context to the authenticated user *provided user consent for such linking was obtained* (as per Section 7). This consent is included in the `all` standard policy.

## Performance and Scalability

### Given that interactions can be high-volume and subject to crawlers, what are the general performance expectations, and how does AICP address scalability, especially concerning AI-driven components like LLMs?

While AICP `draft-01` doesn't set strict millisecond-level performance metrics, the protocol incorporates several design features to support high-performance and scalable e-commerce interactions:

**Efficient Interaction Modes & AI Cost Management:** AICP primarily promotes **Direct Skill Invocation** (Section 4.2.1 of the AICP Specification). This offers REST-like, structured interactions that do not inherently rely on expensive LLM-based Natural Language Understanding (NLU) for routing on the merchant side, allowing for "cheaper" and faster request processing.
* "Smart" NLU-based capabilities (**Text-based Skill Invocation**) are optional.
* To manage the costs and scalability of AI components, Merchant Agents **MAY**:
    * Opt-out of supporting text-based invocation for some/all skills (signaled by not including `text/plain` in `inputModes`).
    * Implement highly optimized NLU/LLM models for any supported text-based routing.
    * Employ robust caching for common NLU interpretations or responses derived from LLM processing.
* The responsibility for scalable and cost-effective implementation of any AI components lies with the Merchant Agent provider.

**Optimized Product Discovery:** Mechanisms like _Schema.org_ structured data and AICP Product ID Link Tags (Section 4.1.5) allow efficient product URN retrieval, reducing complex parsing or extra API calls. Those artifacts are expected to be already present in Client Agent web browsing and regular crawler operations.

**Lightweight Context Management:** AICP leverages the A2A `contextId` value for personalization and session continuity (Section 4.2.4) without always requiring full OAuth 2.1, reducing overhead.

**Sharding-Friendly Context Tokens:** The A2A `contextId` is opaque to Client Agents, allowing Merchant Agents to design these tokens for distributed and scalable session management.

Beyond these protocol features, Merchant Agents **SHOULD** apply standard API performance best practices (e.g., optimized queries, efficient logic, appropriate payload sizes) to ensure a good user experience.

### What caching strategies are recommended for Merchant Agents to handle high load?
Caching is highly recommended. Consider caching:

* Responses from `aicp:product_get` for frequently accessed products.
* Results of common, non-personalized `aicp:product_search` queries (especially if direct invocation is used).
* `aicp:inventory_query` results might benefit from short-lived caches.
When caching personalized content (e.g., if `contextId` influences results), the `contextId` must be part of the cache key. Caching occurs at the Merchant Agent's application layer.

### How should Merchant Agents manage crawler traffic and implement rate limiting for AICP endpoints?
Merchant Agents **SHOULD** implement robust rate limiting on their AICP API endpoints to protect against abuse, misbehaving clients, and overly aggressive crawlers. The AICP Specification (Section 8.1.2) recommends responding with an HTTP `429 Too Many Requests` status code when rate limits are exceeded, and further suggests using the `Retry-After` header. Factors for rate limiting can include User-Agent strings identifying Client Agents, IP address, or skill invocation frequency. 

For guidance on crawler interaction beyond rate limiting, web practices like `robots.txt` for AICP are not yet standardized but may be considered in the future.

### For large product catalogs, what are the scalability considerations for product discovery methods (Schema.org, URNs - AICP Spec Section 4.1.5)?
AICP leverages existing web infrastructure for product discovery, avoiding the need for separate catalog uploads. For scalable discovery with large catalogs, merchants should:

*   **Enhance Web Discoverability:** Implement strong SEO and provide comprehensive Schema.org/Product data on product pages. This includes stable identifiers (e.g., `productID`, `sku`) for constructing AICP Product URNs (see AICP Spec Section 4.1.5), making product details readily available to Client Agents and crawlers.
*   **Offer Robust Direct Search:** Client Agents may delegate product finding to Merchants rather than relying on pre-indexed data. Ensure your `aicp:product_search` skill is comprehensive and performant.
*   **Ensure Efficient URN Resolution:** Since AICP Product URNs are built from your existing stable identifiers (like `productID` or `sku`), focus on efficiently resolving these URNs to your internal product data.

Effectively, merchants are responsible for enabling both web-crawlable product discovery (adapted for AICP) and a reliable direct search alternative via AICP skills.

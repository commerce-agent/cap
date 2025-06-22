# FAQ - Merchant Implementation

This document addresses frequently asked questions for developers and engineers representing Merchants aiming to expose their e-commerce services via AICP.

## Integration and Data Mapping

### How should we map the standardized AICP skills and their data structures (once fully defined in Section 5) to our existing backend e-commerce APIs and internal systems?
A: This will be a key part of your AICP Merchant Agent implementation. You will need to create a service layer that translates incoming AICP skill requests (with their standardized parameters) into calls to your internal APIs, and then transforms your internal responses back into the standardized AICP result artifact structures. The detailed data structures in Section 5 (once finalized) will be your guide.

### What are the best practices for mapping product identifiers, especially if our internal system uses different IDs than those expected via Schema.org or URNs (Section 3.1, 4.1.5)?
A: AICP recommends merchants support common identifiers discoverable via Schema.org (like `productID`, `sku`, `gtin`) and encourages the use of a canonical AICP Product URN (e.g., `urn:Product:productID:<value>`). Your Merchant Agent implementation should be prepared to accept these identifiers and normalize them to your internal product identification system (Section 4.1.5). Maintaining a mapping layer or using your most stable public identifier as the basis for the URN `<value>` is advisable.

## Implementation Effort and Discovery

### What is the estimated effort to implement an AICP Merchant Agent, including the Agent Card and skill handlers?
A: The effort will vary based on the complexity of your existing systems and the number of AICP skills you choose to implement. Leveraging the A2A protocol for the communication layer helps. Key tasks include:
    1.  Publishing an A2A Agent Card detailing your AICP capabilities (Section 4.1.4).
    2.  Implementing JSON-RPC method handlers for each supported AICP skill.
    3.  Developing the logic to translate AICP requests/responses to/from your backend systems.
    For `draft-01`, focusing on the core purchase flow skills (search, cart, checkout) would be a typical starting point.

### Which of the discovery mechanisms (DNS TXT, HTML link tag, .well-known URI - Section 4.1) should we prioritize?
A: For specific AICP endpoint discovery, the DNS TXT record (`_aicp.{merchant-domain}`) is RECOMMENDED (Section 4.1.1). The general A2A well-known URI (`/.well-known/agent.json`) is a good fallback or general A2A discovery method. Supporting multiple methods increases discoverability.

## Security and Authentication

### What are the specific requirements and best practices for authentication and security for Merchant Agents?
A: Section 4.1.4 requires the Agent Card to declare authentication requirements. Section 8 (Security Considerations) is currently a placeholder but will detail specific security measures. Generally, robust authentication (like OAuth 2.1) will be expected. Merchant Agents MUST authenticate every incoming request. You are also responsible for protecting against abuse, implementing rate limiting, and securing your endpoints.

### How should Merchant Agents handle the vetting of Client Agents that interact with them?
A: The current AICP specification focuses on the protocol for interaction. The vetting of Client Agents (e.g., trustworthiness, compliance with usage policies) is typically an operational aspect for the Merchant Agent provider, potentially involving registration processes or trust frameworks that are outside the direct scope of AICP `draft-01` but are important for a secure ecosystem.

## Personalization and User Data Management

### How should we manage the A2A `contextId` and associated user data for personalization (Section 4.2.4) securely and in compliance with privacy laws like CCPA or GDPR?
A: Merchant Agents are responsible for securely managing the `contextId` and any linked user preferences or data. This includes:
    *   Generating robust `contextId`s.
    *   Persisting and retrieving data associated with a `contextId` in accordance with the user's consent (obtained via `aicp:user_preferences_set` and the `userDataConsent` field).
    *   Adhering to the data privacy principles in Section 7 and all applicable laws.
    *   Implementing mechanisms for data deletion or de-personalization upon consent revocation or `contextId` expiry.

### What are our specific obligations if a Client Agent forwards a `userDataConsent` value, like `"all"`, as defined in Section 7.2.1?
A: If you accept the `"all"` policy (or any other standard policy defined), you MUST adhere to the terms of that policy regarding data collection, usage, sharing, and retention for the given `contextId`. This includes respecting the limitations on sharing identifiable personal information with unaffiliated third parties, as outlined in the policy.

### How should the AICP `contextId` for personalization interact with our existing fully authenticated user sessions (e.g., after a user logs in with OAuth 2.1)?
A: Section 4.2.4 states that if a `contextId` is provided alongside a valid OAuth 2.1 Access Token, the Merchant Agent MAY link the personalization context to the authenticated user (identified by OIDC `sub` claim), *provided user consent for such linking was obtained* (as per Section 7). This requires careful handling to ensure clarity and consent for data linkage.

## Extensibility and Custom Capabilities

### We offer unique services beyond the core AICP skills. How can we expose these custom capabilities (Section 9) in a way that Client Agents can effectively discover and use them?
A: You MAY declare non-standard (custom) skills in your A2A Agent Card. Client Agents are expected to ignore skills they don't understand. For effective use, you would likely need to:
    1.  Clearly document these custom skills (e.g., in your `AgentCard.documentationUrl`).
    2.  Potentially engage directly with Client Agent providers whose users would benefit from these unique capabilities.
    AICP `draft-01` focuses on standardizing core operations; discovery and utilization of purely custom skills rely on bilateral understanding or broader community conventions that might develop.

### If we extend a standard AICP skill with additional OPTIONAL parameters, what is the likelihood of Client Agents adopting these optional features?
A: Adoption of optional parameters often depends on the perceived value and the ease of implementation for Client Agent developers. Clear documentation and demonstrating the benefits of these extensions would be key. Client Agents **SHOULD** gracefully handle their absence (Section 9).

## Performance and Scalability

### Are there performance guidelines or best practices for AICP interactions, particularly for high-volume skills like product search or inventory queries?
A: AICP `draft-01` does not prescribe specific performance metrics. However, as with any API, Merchant Agents should design their skill implementations to be efficient and scalable to provide a good user experience. Standard API performance best practices apply.

## Analytics and Monitoring

### What are the recommended approaches for Merchant Agents to monitor AICP traffic, track skill usage, and identify operational issues?
A: This is an operational aspect for the Merchant Agent provider. Standard API monitoring tools and practices can be applied to your AICP endpoint. This includes logging requests, tracking error rates, monitoring latency, and potentially versioning your AICP skill implementations. 
---
hide:
  - navigation
---

# CAP Protocol Overview

As AI agents become integral to how users discover and purchase products, e-commerce faces a fundamental challenge: thousands of merchants, each with unique APIs and integration requirements, creating barriers to AI-driven commerce adoption. The Commerce Agent Protocol (CAP) solves this by establishing the first industry-standard interface for AI agent e-commerce interactions.

## Unified Commerce Protocol for AI Agents

CAP transforms fragmented merchant integrations into a standardized protocol where any AI agent can interact with any compliant merchant. Built as a specialized application of the [Agent2Agent (A2A) Protocol](https://a2a-protocol.org/latest/specification/), CAP provides the infrastructure layer that makes AI-driven commerce both practical and scalable.

Personal AI assistants like ChatGPT, Claude, or Copilot can now perform complex e-commerce operations across diverse merchants through a single, standardized interface. This eliminates the need for custom integrations while maintaining the rich functionality users expect from modern commerce experiences.

### Architecture Components

- **Client Agent**: Personal AI assistants acting on behalf of users
- **Merchant Agent**: Merchant systems exposing CAP e-commerce capabilities  
- **Capabilities Manifest**: A2A AgentCard declaring supported CAP Skills
- **CAP Skills**: Standardized e-commerce operations (search, cart management, etc.)

## Discovery Architecture

CAP introduces a multi-layered discovery system that makes merchant capabilities discoverable without complex registries or gatekeepers. This approach leverages existing web infrastructure while adding AI-specific enhancements.

### Capability Discovery

Merchants can declare CAP support through three complementary methods, ensuring AI agents can locate commerce capabilities regardless of entry point:

1. **DNS-based Discovery**: Direct capability advertisement via `_cap.{merchant-domain}` DNS TXT records
2. **HTML-embedded Discovery**: Product page integration using `<link rel="cap-agent-card">` tags for context-aware discovery
3. **Standard Web Discovery**: A2A well-known URI convention at `/.well-known/agent.json`

### Direct Product Discovery

CAP eliminates the traditional product lookup round-trip by enabling direct product identification from web pages. AI agents encountering a product page can immediately extract standardized identifiers without additional API calls.

The protocol prioritizes Schema.org structured data (`productID`, `identifier`, `sku`) while supporting explicit CAP identifiers via HTML link tags. This dual approach ensures compatibility with existing SEO infrastructure while enabling CAP-specific optimizations.

**Persistent Product Identity**: URN-based product identifiers provide location-independent references that remain valid across site redesigns, URL changes, and catalog migrations.

### AI-Optimized Merchant Data

**Category Descriptions**: Merchants can provide AI-friendly category descriptions at `/.well-known/cap/categories.txt` in Markdown or plain-text format, enabling more effective product discovery and recommendation systems.

**Responsible Indexing**: CAP-compliant crawlers must identify themselves clearly, respect robots.txt directives, index only public content, and maintain comprehensive provenance metadata for transparency and accountability.

Merchants declare CAP support through an extension in their AgentCard:

```json
{
  "capabilities": {
    "extensions": [{
      "uri": "https://cap-spec.org",
      "description": "Extension for Commerce Agent Protocol (CAP) support",
      "params": {
        "search-query-modes": ["keyword", "phrase"]
      }
    }]
  }
}
```

## E-commerce Capability Framework

CAP defines five core skills that collectively enable comprehensive e-commerce interactions, from initial product discovery through order fulfillment. This standardized skill set ensures consistent capabilities across all merchants while supporting complex use cases.

### Product Discovery

**`cap:product_search`** provides AI agents with product discovery capabilities that go beyond simple keyword matching. The skill supports both traditional keyword searches and natural language phrase queries, enabling merchants to leverage their existing search infrastructure while supporting conversational AI interactions.

Query flexibility includes SQL-like filter expressions (`price < 100 AND brand = 'Acme'`) that AI agents can construct dynamically based on user preferences. Pagination support enables efficient result management across large catalogs, while structured responses provide rich product summaries with real-time availability and promotional offers.

**`cap:product_get`** delivers comprehensive product information on demand, returning complete Schema.org Product structures with real-time inventory and pricing data. This skill typically operates without authentication requirements, enabling seamless product browsing experiences that parallel traditional web commerce.

### Cart Management

**`cap:cart_manage`** unifies all shopping cart operations under a single, action-based interface. AI agents can view cart contents, add items with variant specifications, update quantities, and remove items through consistent request patterns. The skill automatically calculates taxes and shipping options while performing inventory validation to prevent overselling.

This approach eliminates the need for separate cart APIs while ensuring consistent behavior across different merchant implementations.

### Order Lifecycle Tracking

**`cap:order_status`** provides real-time visibility into order progress and fulfillment status. AI agents can retrieve shipping updates, delivery tracking information, and order state changes through a unified interface that works across diverse fulfillment systems.

### Privacy-First Personalization

**`cap:user_preferences_set`** enables sophisticated personalization without compromising user privacy. AI agents can establish user preferences and obtain explicit consent for data usage through standardized privacy policies. The skill links to A2A's `Task.contextId` mechanism, enabling session continuity and personalized experiences across multiple interactions while maintaining strict privacy controls.

## Technical Architecture

### Dual Interaction Paradigms

CAP supports both structured and conversational interaction patterns, enabling AI agents to choose the optimal approach based on context and capability. This flexibility accommodates diverse AI architectures while maintaining consistent merchant implementations.

**Structured Invocation** provides precise, programmatic control ideal for deterministic commerce operations:

```json
{
  "parts": [{
    "kind": "data",
    "metadata": { "skillId": "cap:product_search" },
    "data": {
      "query": "wireless headphones",
      "filter": "price < 200 AND brand IN ('Sony', 'Bose')",
      "limit": 10
    }
  }]
}
```

**Conversational Invocation** enables natural language interactions that merchants can interpret using their preferred NLP approaches:

```json
{
  "parts": [{
    "kind": "text", 
    "text": "find me red running shoes under $100"
  }]
}
```

### Security Architecture

CAP builds comprehensive security into every layer of the protocol:

**Transport and Authentication**: Mandatory HTTPS with OAuth 2.1/OpenID Connect integration enables identity federation while supporting public access patterns for product discovery.

**Access Control**: Skills can be individually tagged for public access (`auth:public`) or require authentication, allowing merchants to balance discoverability with security requirements.

**Abuse Prevention**: Standard HTTP 429 rate limiting with `Retry-After` headers, comprehensive input validation, and injection attack prevention protect merchant systems while maintaining API responsiveness.

### Privacy Through Standardization

CAP addresses the fragmented privacy landscape in e-commerce by introducing standardized privacy policies that work consistently across all merchants. This approach eliminates consent fatigue while giving users meaningful control over their data.

**Context-Aware Session Management**: The A2A `Task.contextId` mechanism enables personalization without requiring immediate authentication. Users can build personalized experiences across merchants while maintaining privacy control through explicit consent mechanisms.

**Merchant-Isolated Privacy Contexts**: Each merchant operates within its own privacy context, preventing cross-merchant data correlation while enabling rich personalization within individual merchant relationships.

**Standardized Consent Framework**: CAP defines three privacy levels that merchants must support:

- **`all`**: Comprehensive personalization including behavioral tracking, preference inference, and authenticated account linking
- **`none`**: Explicit rejection of personalization data collection
- **`absent`**: Default state with no personalization data usage

This standardization eliminates the need for users to navigate complex, merchant-specific privacy policies while ensuring meaningful privacy control. The `all` policy specifically covers product recommendations, search personalization, usage analytics, and the linking of anonymous browsing context to authenticated accounts.

### Structured Error Handling

CAP standardizes error responses with machine-readable error codes, human-readable descriptions, and structured context details. This approach enables AI agents to handle errors intelligently while providing developers with clear debugging information.

```json
{
  "capErrorCode": "CAP_PRODUCT_NOT_FOUND",
  "description": "The requested product was not found",
  "details": { 
    "productId": "INVALID123",
    "suggestions": ["SIMILAR456"]
  }
}
```

## Extensibility Architecture

CAP's extensibility model ensures the protocol can evolve with changing commerce requirements while maintaining backward compatibility and baseline interoperability. This approach balances innovation with stability, enabling both merchant differentiation and ecosystem growth.

### Multi-Layered Extension Framework

**Custom Merchant Capabilities**: Merchants can expose unique capabilities beyond standard CAP skills while maintaining discovery through the standard AgentCard mechanism. This enables competitive differentiation without fragmenting the core ecosystem.

**Adaptive Skill Enhancement**: Standard skills support optional extensions for additional parameters and response fields, allowing merchants to provide enhanced functionality while ensuring basic interoperability with all AI agents.

**Industry Vertical Profiles**: Specialized CAP profiles for sectors like travel, food delivery, or financial services can build upon the core framework with industry-specific skills and data structures, creating focused ecosystems within the broader CAP standard.

**Community-Driven Evolution**: The core specification evolves through community feedback and real-world usage patterns, ensuring new capabilities address genuine market needs while maintaining protocol coherence.

### Standardized Promotion Semantics

CAP introduces a standardized approach to promotional offer semantics, enabling AI agents to understand and compare promotions across merchants programmatically:

```json
{
  "offers": [{
    "price": "99.99",
    "priceCurrency": "USD", 
    "additionalType": "urn:cap:StandardOffer:BOGO50",
    "description": "Buy one, get one 50% off with code BOGO50"
  }]
}
```

**Community-Maintained Registry**: The Standard Offer registry at `https://cap-spec.org/registry/standard-offers/` operates as a community resource, enabling rapid iteration on promotional patterns while maintaining semantic stability. New offer types can be proposed and adopted without requiring specification updates, ensuring the system adapts to evolving marketing practices.

This approach transforms promotional offers from human-readable text into structured, comparable data that AI agents can process consistently across all merchants.

## Implementation Benefits

### For AI Agent Providers

CAP eliminates the integration bottleneck that has limited AI commerce adoption. Instead of negotiating individual merchant partnerships and maintaining dozens of custom integrations, AI agent providers can implement a single protocol that connects to all CAP-compliant merchants. This reduces development costs while expanding commerce capabilities.

### For Merchants

CAP provides immediate access to the growing ecosystem of AI agents without requiring individual partnerships or custom API development. Merchants implement one standardized interface and become discoverable by any CAP-enabled AI agent, from established assistants to emerging specialized commerce bots.

The protocol's extensibility ensures merchants can differentiate through custom capabilities while maintaining baseline compatibility, enabling innovation without ecosystem fragmentation.

### For Users

CAP enables unified shopping experiences where users can discover, compare, and purchase products across any merchant through their preferred AI assistant. The standardized privacy framework eliminates the need to navigate complex consent flows for each merchant while providing meaningful data control.

### For the Commerce Ecosystem

By establishing open standards for AI commerce interactions, CAP prevents the emergence of proprietary gatekeepers and ensures competitive innovation. The protocol's community-driven governance model and extensible architecture enable rapid adaptation to changing market needs while maintaining interoperability.

---

CAP establishes the foundational infrastructure for scalable AI-driven commerce, enabling comprehensive shopping assistance while preserving user privacy and merchant autonomy. As AI agents become primary interfaces for consumer commerce, CAP ensures an open, competitive ecosystem that benefits all participants.

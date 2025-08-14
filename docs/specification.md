---
hide:
  - navigation
---

# Commerce Agent Protocol (CAP) Specifications

**Version**: `draft-01` <br/>
**Date**: `2025-08-11`<br/>
**Status**: Editor's Draft<br/>
**Editors:** Cloves Almeida - Boston Consulting Group

**Summary**

This document specifies the Commerce Agent Protocol (CAP). CAP defines a set of standardized e-commerce capabilities for AI agents, **profiled as a specialized application of the [Agent2Agent (A2A) Protocol][A2A-SPEC]**. By leveraging A2A's core framework for agent discovery (via AgentCards), task management, and secure communication, CAP enables personal AI agents (Client Agents in A2A terms) to interact with compliant merchants (Remote Agents in A2A terms) for the *core purchase flow* (discovery → comparison → cart → checkout → order status). This approach fosters interoperability and allows merchants to expose commerce functions as well-defined A2A tasks within the broader A2A ecosystem.

## Introduction
The Commerce Agent Protocol (CAP) provides a standardized interface for personal AI agents to discover merchants and perform e-commerce operations, fostering an open and interoperable ecosystem for AI-enabled commerce. To achieve this, CAP leverages the [Agent2Agent (A2A) Protocol][A2A-SPEC] for fundamental agent communication; while initial drafts focus on request-reply operations for core tasks, future versions aim to support more fluid agent interactions.

This CAP specification focuses on defining several key e-commerce-specific aspects. It establishes broad merchant and product discovery capabilities that leverage existing Web infrastructure, while providing a clear set of **standardized e-commerce operations** such as product search, product details, and cart management. The specification also addresses privacy-aware personalization and consent for usage of data in commerce contexts.

Additionally, CAP defines the **data structures** required for requests and responses related to these operations, along with conventions for merchants to **declare their CAP capabilities**. It provides guidelines for AI agents to **identify and invoke specific CAP operations** effectively.

These definitions initially target core operations for general e-commerce, anticipating that specialized profiles may extend the protocol for specific industry verticals. This overall approach allows CAP to provide a focused solution for e-commerce while benefiting from the interoperability and foundational features of A2A's general [agent communication framework][A2A-SPEC].

### Intended Audience
This specification is primarily targeted at:

- Developers building AI Agents that require e-commerce interaction capabilities.
- Developers and engineers representing Merchants who aim to expose their e-commerce services to AI Agents in a standardized manner.
- Architects and designers of e-commerce platforms and AI-driven commerce systems seeking interoperable solutions.

### Goals
The Commerce Agent Protocol (CAP) is designed to achieve the following primary goals for AI-driven e-commerce:

- **Achieve Broad E-commerce Interoperability:** To enable personal AI agents to seamlessly interact with any CAP-compliant merchant for e-commerce tasks through a common, standardized interface.
- **Define Standardized Commerce Operations:** To provide clear, unambiguous definitions for common e-commerce operations (e.g., product search, cart management), including their required inputs and expected outputs, using a consistent data exchange format.
- **Facilitate Merchant and Product Discovery:** To provide a consistent mechanism for AI agents to discover CAP-compliant merchants, their offers and agent e-commerce capabilities through a standard declaration format.
- **Simplify Commerce Integration for Agents:** To streamline the development of e-commerce functionalities in AI agents by abstracting merchant-specific complexities behind a uniform set of CAP-defined operations.
- **Ensure Secure Transactions:** To promote secure e-commerce interactions by establishing clear guidelines for secure communication and authentication.
- **Foster an Open Commerce Ecosystem:** To cultivate a level playing field and enhance consumer choice by simplifying how AI agents discover and connect with a diverse array of merchants through an open protocol.
- **Support Flexible Extensibility:** To allow merchants to complement standard CAP capabilities by offering additional, clearly declared functionalities alongside the core operations.

### Scope
#### In-scope
The current version of CAP encompasses the following:

-   Guidelines on how to discover merchants, products, and how it relates with existing World Wide Web search ecosystem.
-   Definition of how merchants declare their CAP e-commerce capabilities using AgentCards.
-   Requirements for secure authentication and authorization for CAP interactions.
-   Definition of how to share user preferences and transmit user consent for personalization. 
-   Specification of standard CAP e-commerce operations (e.g., product search, product retrieval with inventory data, cart management, and order status).
-   The method by which AI agents specify the desired CAP operation when initiating a request.
-   Definition of the data structures for requests and responses for each CAP operation.
-   Standardized patterns for reporting success and errors for CAP operations.

#### Out-of-scope
The current version of CAP explicitly excludes:

-   Definition of ad-hoc underlying agent-to-agent communication mechanisms as CAP relies on [A2A-SPEC] for foundational components.
-   The internal logic, decision-making processes, or ranking algorithms of Client Agents or Merchant Agents when returning results to users.
-   Monetization aspects, revenue sharing models, or commercial agreements between Client Agent providers and Merchant Agents.
-   Specifics of merchant back-end data storage, schemas, or internal business logic beyond the defined CAP task interfaces.
-   Payment processing and checkout flows, which are considered future enhancements beyond the scope of `draft-01`.
-   Prescriptive guidance on user interface (UI) or user experience (UX) design for Client Agents or merchant systems.


## Conformance
The key words "**MUST**", "**MUST NOT**", "**REQUIRED**", "**SHALL**", "**SHALL NOT**", "**SHOULD**", "**SHOULD NOT**", "**RECOMMENDED**", "**MAY**", and "**OPTIONAL**" in this document are to be interpreted as described in [RFC 2119].

An implementation (Agent or Merchant) is conformant with this specification if it adheres to all **MUST** and **REQUIRED** level requirements.

## Core Concepts
This section defines key terminology used within the Commerce Agent Protocol (CAP). CAP builds upon and extends the core concepts outlined in the [Agent2Agent (A2A) Protocol Specification \[A2A-SPEC\]][A2A-SPEC], particularly those in Section 2 ("Core Concepts Summary") of the A2A specification. For clarity within CAP:

-   The term **Client Agent** as used in this document corresponds to the **A2A Client** role defined in the [A2A-SPEC].
-   The term **Merchant Agent** as used in this document corresponds to the **A2A Server (Remote Agent)** role defined in the [A2A-SPEC].

### Key CAP Terminology
-   **Client Agent (or Personal AI Agent)**: A personal AI assistant (e.g., ChatGPT, Copilot, Claude), acting on behalf of an end-user, that initiates CAP operations by interacting with a Merchant Agent.
-   **Agent Provider**: An organization or entity that develops, hosts, or otherwise makes a Client Agent (or Personal AI Agent) available to end-users.
-   **Crawler (or Indexer Bot)**: An automated software agent that systematically browses websites and CAP discovery mechanisms (such as DNS TXT records, HTML link tags, and A2A AgentCards) to find and index CAP Merchant Agents and their declared capabilities (CAP Skills and product identifiers). The purpose of such indexing is typically to build databases that can be used by Client Agents or other services to discover merchants or product information.
-   **Merchant Agent**: A Merchant's system that exposes CAP e-commerce capabilities. It processes CAP Skill invocations and publishes a Capabilities Manifest.
-   **CAP Skill**: A specific, standardized e-commerce capability defined by this CAP specification (e.g., `cap:product_search`, `cap:cart_manage`). CAP Skills are identified by unique skill IDs and are declared by Merchant Agents in their Capabilities Manifest. These correspond to A2A "skills" or "task intents" within the A2A framework.
-   **Capabilities Manifest**: A structured, machine-readable document published by a Merchant Agent, which **is an A2A AgentCard** as defined in the [A2A-SPEC]. It describes the Merchant Agent's identity, the CAP Skills it supports, the service endpoint URL for these skills, and required authentication mechanisms.
-   **URN (Uniform Resource Name)**: A persistent, location-independent identifier, as defined in [RFC 8141]. CAP uses URNs to identify products.

### CAP Extensions Declaration

CAP leverages the A2A protocol's extension mechanism to enable Merchant Agents to declare CAP-specific capabilities beyond the standard A2A framework. This approach ensures compatibility with the A2A specification while providing a structured way to communicate CAP-specific features to Client Agents.

**CAP Extensions Structure:**

CAP defines a unified extension that Merchant Agents **SHOULD** include in their AgentCard to declare support for CAP-specific capabilities. This extension uses the following structure:

*   **Extension URI:** `https://cap-spec.org`
*   **Description:** "Extension for Commerce Agent Protocol (CAP) support"
*   **Parameters:** A structured object containing CAP-specific capability declarations

**Example AgentCard with CAP Extension:**

```json
{
  "name": "Example Merchant Agent",
  "description": "A merchant that supports CAP",
  "url": "https://api.example.com/a2a/v1",
  "version": "1.0",
  "capabilities": {
    "extensions": [
      {
        "uri": "https://cap-spec.org",
        "description": "Extension for Commerce Agent Protocol (CAP) support",
        "params": {
          "search-query-modes": ["keyword", "phrase"]
        }
      }
    ]
  },
  "skills": [
    {
      "id": "cap:product_search",
      "name": "Product Search",
      "description": "Search for products by keyword or phrase",
      "tags": []
    }
  ]
  // ... other AgentCard fields
}
```

**Client Agent Discovery:**

Client Agents **SHOULD** inspect the `capabilities.extensions` array in a Merchant Agent's AgentCard to discover CAP-specific capabilities. If the CAP extension (`https://cap-spec.org`) is present, Client Agents **MAY** use the declared parameters to optimize their interactions with that Merchant Agent.

## Merchant Discovery

CAP Merchant Agents are discovered by Client Agents through their **Capabilities Manifest**, which **is an A2A AgentCard** as defined in the [A2A-SPEC]. This AgentCard **MUST** detail at least the Merchant Agent's identity, its A2A service endpoint URL (`url` field), the CAP Skills it supports (`skills` field), and its authentication requirements.

CAP supports two deployment models:

*   A Merchant Agent **MAY** expose CAP Skills as part of a larger, consolidated A2A service endpoint (an "A2A Gateway") that handles multiple types of A2A tasks for a domain. In this model, CAP Skills are distinguished by their `cap:` prefixed `id`s within a shared AgentCard.
*   Alternatively, a CAP Merchant Agent **MAY** operate as a standalone A2A service with its own dedicated AgentCard and A2A service endpoint, focused solely on CAP Skills.

To ensure robust discovery, Crawlers indexing Merchant Agents and Client Agents seeking a CAP Merchant Agent for a given `{merchant-domain}` **SHOULD** attempt to locate its A2A AgentCard. The first successfully retrieved and validated A2A AgentCard that declares CAP support (as per [CAP Requirements for the AgentCard](#cap-requirements-for-the-agentcard)) **SHOULD** be used, according to the following resolution order:

1.  **CAP DNS TXT Record for Manifest URL:**
    Client Agents **SHOULD** query for a DNS TXT record at the hostname `_cap.{merchant-domain}`. This method allows merchants to directly specify the URL (potentially including a subpath) of the A2A AgentCard most relevant for CAP interactions.
2.  **CAP HTML Link Tag Discovery:**
    If interacting with an HTML page from the `{merchant-domain}` (e.g., a homepage or product page), Client Agents **MAY** parse the HTML for a `<link rel="cap-agent-card" href="...">` tag to find the A2A AgentCard.
3.  **General A2A Well-Known URI:**
    As a general A2A discovery mechanism or fallback, Client Agents **MUST** attempt to locate a Merchant Agent's AgentCard via the standard A2A well-known URI: `https://{merchant-domain}/.well-known/agent.json` (as defined in the [A2A-SPEC]).

Client Agents and Crawlers **MUST** use at least the "3. General A2A Well-Known URI" method discover Merchant AgentCards. To improve discoverability, Merchants **SHOULD** implement all methods, though it's expected only the mandatory "3. General A2A Well-Known URI" may be implemented for a dedicated e-commerce `{merchant-domain}`.

### CAP DNS TXT Record for Manifest URL

*   Merchant Agents choosing to use this discovery method **MUST** publish a DNS TXT record at the hostname `_cap.{merchant-domain}`.
*   This TXT record **MUST** contain a single string value that is the absolute HTTPS URL of the Merchant Agent's A2A AgentCard (e.g., `"https://example.com/store/.well-known/agent.json"`). Key-value formats (like `cap-agent-card-url=...`) **SHOULD NOT** be used for this specific TXT record; the value itself **MUST** be the URL.
*   Merchants **SHOULD NOT** publish multiple TXT records at the `_cap.{merchant-domain}` hostname for CAP discovery. If multiple records are present, Client Agents and Crawlers **MAY** process only the first one retrieved that contains a valid HTTPS URL.
*   Client Agents and Crawlers **SHOULD** query for this TXT record. If found and valid, they would then fetch the A2A AgentCard from the extracted URL.

### CAP HTML Link Tag Discovery

*   If a Client Agent or Crawler interacts with an HTML page on the `{merchant-domain}` and has not yet discovered an AgentCard via prior methods, it **MAY** parse the HTML for a `<link>` tag to discover the location of a CAP-relevant A2A AgentCard.
*   The link tag **SHOULD** be: `<link rel="cap-agent-card" href="<URL_to_AgentCard>">`.
    *   The `href` attribute **MUST** be an absolute HTTPS URL or a root-relative path pointing directly to a valid A2A AgentCard (e.g., `https://example.com/store/.well-known/agent.json` or `/custom-path/agent.json`).
*   Client Agents finding this link **SHOULD** then fetch the A2A AgentCard from the specified `href`.

### General A2A Discovery: Well-Known URI

*   As a general A2A discovery mechanism or fallback, Client Agents **MAY** attempt to locate a Merchant Agent's AgentCard via the standard A2A well-known URI: `https://{merchant-domain}/.well-known/agent.json` (as defined in the [A2A-SPEC]).
*   For CAP, any A2A AgentCard retrieved via this method (or any other) **MUST** still declare CAP Skills as specified in [CAP Requirements for the AgentCard](#cap-requirements-for-the-agentcard) to be considered a CAP-compliant endpoint.
*   Per current [A2A-SPEC], it's not possible to use a single AgentCard to specify multiple JSON-RPC endpoints, thus both CAP and non-CAP skills, if they exist, must be supported in the declared endpoint.

### CAP Requirements for the AgentCard

The Capabilities Manifest for a CAP Merchant Agent, which is an A2A AgentCard, **MUST** adhere to the structure and requirements outlined in the [A2A-SPEC]. In addition, for CAP conformance:

-   It **MUST** declare supported CAP Skills within the `skills` array. Each declared CAP Skill **MUST** have an `id` field prefixed with `cap:` (e.g., `"id": "cap:product_get"`).
-   It **MUST** accurately declare all necessary authentication requirements (particularly `authentication` field) to enable Client Agents to interact with the declared CAP Skills.
-   It **SHOULD** include the CAP extension (`https://cap-spec.org`) in the `capabilities.extensions` array to declare CAP-specific capabilities as described in [CAP Extensions Declaration](#cap-extensions-declaration).
-   It **MAY** declare non-CAP skills; Client Agents processing CAP interactions **SHOULD** ignore skills with `id`s not prefixed by `cap:` if they are not programmed to handle them.

**CAP Support Detection:**

Client Agents **SHOULD** determine CAP support by checking for the presence of the CAP extension (`https://cap-spec.org`) in the AgentCard's `capabilities.extensions` array. If the extension is present, the merchant supports CAP and Client Agents **SHOULD** use the declared parameters to optimize interactions. If the extension is absent, Client Agents **SHOULD NOT** assume any CAP compliant functionality, and treat the agent as a generic A2A server.

### CAP Categories and Catalog Files

Merchants **MAY** provide a LLM-friendly `categories.txt` file with a description of the product categories it offers. Client Agents may find the `categories.txt` file under `https://{merchant-domain}/.well-known/cap/categories.txt` (registration pending).

This file **SHOULD** be designed to fit within the context of a LLM The specific format of `categories.txt` is not specified, but it's recommended to be [Markdown] based, with MIME-type `text/markdown` or plain-text (`text/plain`). 

## Product Discovery and Semantics

This section covers the mechanisms by which Client Agents discover products and the semantic structures used to enhance product information for better interoperability. Product discovery encompasses both selecting relevant merchants and their products, while semantic markup ensures consistent interpretation of product characteristics, offers, and promotional information across the CAP ecosystem.

The combination of discovery mechanisms and semantic standards enables Client Agents to not only locate relevant products but also understand their attributes, pricing, availability, and promotional characteristics in a standardized way that facilitates comparison and decision-making.

### Product Discovery from Web Pages

To facilitate a direct transition to a CAP interaction for a specific product found on a merchant's website without extra network round-trips, and to enable automated systems like web crawlers to accurately identify products, CAP leverages existing SEO practices and **RECOMMENDS** that product details and identifiers be discoverable directly from a Product Description Page (PDP). The discovered identifier can then be used directly as a product identifier for use in CAP Skills.

**Schema.org Structured Data:**

Merchants **SHOULD** embed comprehensive [Schema.org/Product](https://schema.org/Product) structured data on their product pages using JSON-LD within a `<script type="application/ld+json">` block. This structured data **MUST** provide at least one of the standard unique identifier properties: `productID`, `identifier`, or `sku`.

Client Agents and Crawlers **SHOULD** prioritize parsing this `schema.org/Product` data to find a suitable identifier, using the following order of precedence: (1) `productID`, (2) `identifier`, (3) `sku`. The selected identifier value **SHOULD** be used as-is as the product identifier for CAP operations.

**CAP Product ID Link Tag (Optional):**

As a fallback or for explicit CAP identifier declaration, Merchants **MAY** embed a `<link rel="cap-product-id" href="<product_identifier_string>">` tag in the `<head>` of their product pages. The `href` attribute **SHOULD** contain the product identifier as a simple string (e.g., `<link rel="cap-product-id" href="XYZ789">`). If both Schema.org data and a `cap-product-id` link tag are present, Client Agents **MAY** prioritize the link tag identifier as it represents a more explicit CAP declaration.

Regardless of discovery method, Merchant Agents providing the `cap:product_get` CAP Skill **MUST** be prepared to accept these identifiers as-is. The format is opaque to Client Agents, and Merchant Agents handle any necessary internal identifier normalization.

#### Robots and Provenance

Crawlers **MUST** identify themselves via a clear `User-Agent` and **MUST** comply with `robots.txt` [RFC 9309] exclusion directives. Only publicly accessible content **SHOULD** be indexed, and circumventing authentication, paywalls, or technical access controls is **PROHIBITED**.

Index entries **SHOULD** retain provenance metadata including source URL, retrieval timestamps, HTTP status, content hash, and the AgentCard URL of the merchant when available.

### Delegated Product Search

This section provides guidelines for Client Agents on how to discover products by delegating search queries to one or more Merchant Agents using the `cap:product_search` skill. This process involves selecting merchants, forming and sending queries, and processing the returned results.

#### Merchant Selection

Before initiating a search, a Client Agent **SHOULD** identify a set of candidate Merchant Agents. This selection process **SHOULD** be guided by several factors: prioritizing merchants that are CAP-compliant (discoverable directly via [Merchant Discovery](#merchant-discovery) or identified after landing on product pages containing CAP identifiers), considering user preferences including geographic location, language, and preferred currency, assessing the merchant's category coverage and shipping support, and when the user is not authenticated, favoring merchants that declare `auth:public` access for `cap:product_search` to allow for unauthenticated searches.

#### Query Processing

Once merchants are selected, the Client Agent **MUST** translate the user's intent into a `cap:product_search` request for each merchant.

**Capability Discovery and Query Formulation:**

Before formulating the query, Client Agents **SHOULD** inspect the merchant's AgentCard for CAP-specific capabilities declared via the CAP extension as described in [CAP Extensions Declaration](#cap-extensions-declaration). This allows the Client Agent to optimize the query based on the merchant's declared capabilities.

**Query Parameters:**

-   **Query String (`query`):** Contains the primary search terms.

-   **Query Mode (`queryMode`):** Specifies how the query should be interpreted:
    -   `keyword` (Default): For bag-of-words style matching. Merchants **MUST** support this mode and **MUST** use it as the default if `queryMode` is omitted.
    -   `phrase` (Optional): For natural-language queries where word order and proximity are important. Merchant Agents **MAY** support this mode.

-   **Filter Expression (`filter`):** An optional SQL `WHERE`-clause-like expression to refine results:
    -   **Format**: Simple expressions like `price < 100 AND brand = 'Acme'`
    -   **Logical operators**: `AND`, `OR`; parentheses `()` for grouping
    -   **Comparison operators**: `=`, `!=`, `<>`, `<`, `<=`, `>`, `>=`, `BETWEEN`
    -   **Attribute Discovery**: Client Agents can discover filterable attributes:
        -   **Statically**: From the merchant's AgentCard, which **SHOULD** declare supported filter syntax and attributes
        -   **Dynamically**: From the `refineFilters` field in search results, which **MAY** suggest context-specific attributes (e.g., `screenSize` for laptop searches)

Merchant Agents **MAY** interpret the `query` and `filter` flexibly to provide optimal results, including gracefully ignoring malformed or unsupported filter expressions.

**Personalization Context:**

To provide a personalized search experience, Client Agents **SHOULD** manage user context. If a `contextId` has been established from a previous interaction with a merchant (see [User Personalization Context](#user-personalization-context)), the Client Agent **SHOULD** include it in the `A2A.Message.contextId` field to ensure consistent, personalized results. To apply user preferences (e.g., for data usage consent), the Client Agent **SHOULD** invoke `cap:user_preferences_set` before or during the first search request to a given merchant.

#### Result Management

Client Agents often need to query multiple merchants simultaneously (fan-out) and combine the results effectively.

**Execution and Result Processing:**

Use the `limit` and `offset` parameters to manage results. When performing a fan-out search, `limit` **SHOULD** be set to a conservative value (e.g., 10-20) to retrieve an initial set of results from each merchant efficiently. For multi-merchant searches, Clients **SHOULD** allocate a per-merchant request budget (e.g., retrieving 1-2 pages of results) before fetching more results from a single merchant. This balances broad coverage with deep results from any one source.

When combining results from multiple merchants, Client Agents **SHOULD** preserve the provenance of each product (i.e., the merchant and its `agentCardUrl`), avoid de-duplicating products across merchants unless they share a globally unique identifier (e.g., a GTIN), and consider interleaving strategies (e.g., round-robin) to present a balanced list of results to the user. Client-side ranking heuristics are out of the scope of this specification.

**Caching and Internationalization:**

Responses to `cap:product_search` **MAY** be cached by Client Agents, subject to merchant terms. Cache keys **SHOULD** be comprehensive, including the merchant identifier, `query`, `queryMode`, `filter`, `limit`, `offset`, and any relevant internationalization parameters (locale, currency). If results are personalized (associated with a `contextId`), they **MUST NOT** be cached and reused for different users or contexts.

Client Agents **SHOULD** ensure that search requests align with the user's language and currency preferences. These preferences can be conveyed via `cap:user_preferences_set` or inferred by the Merchant Agent from the `contextId`. Queries **MAY** be translated to a merchant's locale, but numeric constraints in the `filter` expression **SHOULD NOT** be altered.

#### Error Handling and Security

**Error and Rate Limit Management:**

If a request to a merchant fails at the A2A protocol level, the Client Agent **SHOULD** skip that merchant for the current search cycle and **MAY** proceed with partial results from other merchants.

If a Merchant Agent responds with an HTTP `429 Too Many Requests` status code or a `CAP_RATE_LIMIT_EXCEEDED` error, the Client **MUST** respect the rate limit. It **SHOULD** apply an exponential backoff strategy for that specific merchant and **MUST** honor the `Retry-After` header if present (see [Rate Limiting and Abuse Protection](#rate-limiting-and-abuse-protection)).

Application-level errors returned in the `Task.status.message` (see [Error Handling](#error-handling)) **SHOULD** be logged for diagnostics, using the provided `capErrorCode`.

**Security and Privacy:**

Personally Identifiable Information (PII) **MUST NOT** be included in the `query` or `filter` strings. User-consented data for personalization **SHOULD** be handled via `cap:user_preferences_set`. Unauthenticated requests to `cap:product_search` **SHOULD** only be made if the skill is explicitly marked as `auth:public` in the merchant's AgentCard. Otherwise, the Client Agent **MUST** authenticate as per the merchant's declared requirements (see [Authentication](#authentication)).

### Standard Offers and Promotional Semantics

To enable consistent interpretation of promotional offers across the CAP ecosystem, merchants **MAY** use Standard Offers - predefined promotional patterns identified by standardized URNs. Standard Offers provide a machine-readable way to communicate common promotional types (such as "Buy One Get One" or percentage discounts) while maintaining human-readable descriptions.

#### Standard Offer URN Format

Standard Offers are identified using URNs in the format:
```
urn:cap:StandardOffer:<code>
```

Where `<code>` is a standardized identifier for a specific promotional pattern. Examples include:
- `urn:cap:StandardOffer:BOGO50` - Buy one, get one 50% off
- `urn:cap:StandardOffer:BTGOF` - Buy two, get one free
- `urn:cap:StandardOffer:PCT20` - 20% off

The complete list of Standard Offer codes is maintained in an external registry located at: `https://cap-spec.org/registry/standard-offers/` (registration pending).

#### Implementation with Schema.org

Standard Offers are implemented by adding the Standard Offer URN to the `additionalType` property of schema.org `Offer` objects. This approach leverages existing schema.org semantics while providing enhanced promotional categorization.

**Basic Implementation:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Widget 3000",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "additionalType": "urn:cap:StandardOffer:BOGO50",
    "description": "Buy one, get one 50% off (coupon BOGO50)."
  }
}
```

**Implementation with CAP Prefix:**
```json
{
  "@context": {
    "@vocab": "https://schema.org/",
    "cap": "urn:cap:"
  },
  "@type": "Product",
  "name": "Gizmo 9000",
  "offers": {
    "@type": "Offer",
    "price": "49.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "additionalType": "cap:StandardOffer:BTGOF",
    "description": "Buy two, get one free."
  }
}
```

#### Client Agent Processing

Client Agents encountering Standard Offer URNs **SHOULD**:
1. **Cache Registry Data**: Periodically fetch and cache the Standard Offers registry for performance
2. **Graceful Fallback**: Use the human-readable `description` field when encountering unknown Standard Offer codes
3. **Semantic Enhancement**: Leverage Standard Offer semantics for improved comparison and recommendation logic

#### Merchant Implementation Guidelines

Merchants implementing Standard Offers **SHOULD**:
1. **Use Exact URNs**: Reference the official Standard Offers registry for correct URN usage
2. **Maintain Descriptions**: Always provide clear, human-readable `description` fields alongside Standard Offer codes
3. **Consistent Application**: Apply the same Standard Offer code consistently across equivalent promotional offers
4. **Analytics Integration**: Consider exposing Standard Offer codes to analytics platforms and tag managers for promotional tracking

#### Registry Maintenance and Governance

The Standard Offers registry is maintained independently of this specification to enable **community-driven growth** where new Standard Offers can be proposed and added without specification updates. This approach supports **rapid iteration** so that promotional patterns can evolve based on market needs, while ensuring **stable references** where existing Standard Offer codes maintain consistent semantics over time.

Proposals for new Standard Offers should be submitted through the governance process documented at the registry location.

## Interaction Model (A2A)

All interactions between a Client Agent and a CAP Merchant Agent **MUST** be performed by invoking A2A Tasks, as defined in the [A2A-SPEC]. CAP leverages A2A's JSON-RPC 2.0 based methods for initiating tasks, sending messages, and retrieving results.

### Initiating a CAP Skill as an A2A Task

To invoke a specific CAP Skill (e.g., `cap:product_search`), the Client Agent **MUST** use a standard A2A RPC method that initiates or sends a message for a task, such as `message/send` or `message/stream` if streaming updates are desired and supported by the Merchant Agent.

The A2A `Message` object within the request parameters (e.g., `MessageSendParams.message`) is structured as follows for CAP:

**Skill Invocation Method:**
CAP extends A2A intent mechanism to supports two primary methods for a Client Agent to indicate the desired skill and provide its inputs:

1.  **Direct Skill Invocation (Explicit Intent via `DataPart`):**
    *   This is the **RECOMMENDED** method when the Client Agent has resolved the user's intent to a specific CAP Skill, particularly for programmatic interactions.
        *   This invocation method requires no natural language processing to resolve Client Agent intent.
    *   The `Message.parts` array **SHOULD** contain a single A2A `DataPart`, optionally also providing a `DataPart` for skill `cap:user_preferences_set`, per [User Personalization Context](#user-personalization-context).
    *   The `metadata` field of this `DataPart` **MUST** contain a `skillId` field, specifying the `id` of the target CAP Skill (e.g., `"cap:product_search"`).
        *   *Example `DataPart.metadata` for direct invocation:* `{ "skillId": "cap:product_search" }`
    *   The `data` field of this `DataPart` **MUST** be a JSON object representing the structured input parameters for that CAP Skill, as defined in [Core Skills Specifications](#core-skills-specifications).

2.  **Text-based Skill Invocation (Inferred Intent via `TextPart`):**
    *   To support more fluid, conversational interactions, a CAP Merchant Agent **MAY** allow Client Agents to submit requests as natural language text, from which the Merchant Agent infers the intended CAP Skill and parameters.
    *   In this model, the `Message.parts` array **SHOULD** contain a single A2A `TextPart` (Section 6.5.1 of [A2A-SPEC]) holding a natural language request (e.g., `"find me red running shoes under $100"`).
    *   For this type of invocation, a `DataPart` with a CAP `skillId` in its `metadata` **MAY** be present to hint the Merchant Agent of the primary inferred intent, but it's not mandatory.
    *   The Merchant Agent performs the skill routing by interpreting the content of the `TextPart`.
    *   **Support and Scalability:**
        *   Merchant Agents **MAY** opt-out of supporting text-based invocation for some or all of their CAP skills due to the potential computational costs of natural language processing at scale.
        *   A Merchant Agent signals its support for text-based invocation for a specific skill by including an appropriate MIME type representing natural language (e.g., `text/plain`) in the `inputModes` array for that skill within its `skills` array (or in global defaults if applicable). If `text/plain` (or an equivalent MIME type) is not listed as a supported input mode for a skill, Client Agents **SHOULD** assume text-based invocation for that skill is not supported.
        *   If a Merchant Agent receives an A2A `Message` containing only a `TextPart` intended for CAP skill invocation but does not support or cannot route this text-based request for the intended skill, it **SHOULD** respond with a standard A2A `JSONRPCError` with `code: -32005` (`ContentTypeNotSupportedError`), as defined in the [A2A-SPEC]. The error's `data` field **MAY** provide additional context.

The interaction methods above are aimed at skill routing - skills are allowed to specify support for natural language text fields in their structured `DataPart` input specifications to augment their interaction.

**Context Continuity (A2A `Message.contextId`):**
*   To enable personalized results or maintain context across a series of interactions with a specific Merchant Agent, Client Agents **SHOULD** capture the `contextId` returned in an A2A `Task` object (see Section 6.1 of [A2A-SPEC]) from that Merchant Agent.
*   For subsequent A2A `Message`s intended to be part of that same context, the Client Agent **SHOULD** send this received `contextId` in the `contextId` field of the `Message` object (see Section 6.4 of [A2A-SPEC]).
*   The establishment of preferences and consent associated with this `contextId` is managed via the `cap:user_preferences_set` skill (see [`cap:user_preferences_set`](#capuser_preferences_set)).

*(Note: The capability for bundling multiple skill invocations by having multiple such DataParts in the Message.parts array, each with their own skillId in DataPart.metadata, is a potential future extension and not the primary model for draft-01. For draft-01, one DataPart with one skillId per Message is the standard for direct invocation.)*

**Example A2A Request to initiate `cap:product_search` (Direct Invocation):**

This conceptual example uses the A2A `message/send` method. It assumes a `contextId` was generated from a previous interaction. Refer to [A2A-SPEC] for the full `MessageSendParams` structure.

```json
{
  "jsonrpc": "2.0",
  "id": "client-req-001",
  "method": "message/send",
  "params": {
    "message": { 
      "role": "user",
      "contextId": "merchant_generated_context_id_abc123",
      "parts": [
        { 
          "kind": "data",
          "metadata": { 
            "skillId": "cap:product_search"
          },
          "data": { 
            "query": "running shoes",
            "limit": 5,
            "filters": {
              "brand": "CAPRunnerPro",
              "color": "blue"
            }
          }
        }
      ],
      "messageId": "client-msg-001"
    }
  }
}
```

### Receiving Results and Artifacts

The Merchant Agent (A2A Server) processes the A2A task. The results of the CAP Skill execution **MUST** be returned as A2A `Artifacts` within the A2A `Task` object as defined in the [A2A-SPEC].

*   For successful CAP Skill invocations that produce data, the A2A `Task` object returned (or streamed via `TaskArtifactUpdateEvent`) **SHOULD** contain at least one `Artifact`.
*   This `Artifact` **MUST** contain a single `DataPart`.
*   The `DataPart.data` field **MUST** be a JSON object representing the result of the CAP Skill, as defined for that skill in [Core Skills Specifications](#core-skills-specifications).
*   The `Task.status.state` will indicate the outcome (e.g., `completed`, `failed`). If `failed`, error details should be provided as described in [Error Handling](#error-handling).

**Example A2A `Task` Object as a Result (Conceptual):**

This shows a `Task` object that might be returned by `message/send` or `tasks/get`, or be the final state of a streamed task.

```json
{
  "jsonrpc": "2.0",
  "id": "client-req-001",
  "result": {
    "id": "merchant-task-123",
    "contextId": "merchant-context-456",
    "status": {
      "state": "completed",
      "timestamp": "2023-10-27T10:00:00Z",
      "message": {
        "role": "agent",
        "parts": [
          {
            "kind": "text",
            "text": "Found 2 products matching your criteria."
          }
        ],
        "messageId": "merchant-msg-001"
      }
    },
    "artifacts": [
      {
        "artifactId": "search-results-001",
        "parts": [
          {
            "kind": "data",
            "data": {
              "products": [
                { "id": "123", "name": "CAP Runner Pro - Blue", "price": 79.99, "currency": "USD" },
                { "id": "124", "name": "CAP Distance Master - Blue", "price": 99.99, "currency": "USD" }
              ],
              "totalResults": 2,
              "offset": 0,
              "limit": 5
            }
          }
        ]
      }
    ],
    "metadata": {
      // Merchant-specific metadata could go here.
      // No userContextId is returned by the merchant in the client-issued token model.
    }
  }
}
```

### Handling Asynchronous Operations and Streaming

CAP interactions can be synchronous or asynchronous, leveraging A2A's capabilities:

*   For quick operations, a Merchant Agent **MAY** process the task and return the final `Task` object (with state `completed` or `failed` and artifacts) directly in the response to a `message/send` request.
*   For longer-running operations, or if the Client Agent requests it, Merchant Agents supporting streaming **SHOULD** use A2A's SSE streaming mechanism via the `message/stream` method. This allows for `TaskStatusUpdateEvent` and `TaskArtifactUpdateEvent`s to be sent as the task progresses.
*   Push notifications, if supported by the Merchant Agent and configured by the Client Agent (via `MessageSendParams.configuration.pushNotificationConfig` or `tasks/pushNotificationConfig/set` as per [A2A-SPEC]), can also be used for asynchronous updates.

CAP itself does not add new streaming or push notification mechanisms beyond what A2A provides. Client Agents and Merchant Agents **MUST** follow the procedures in [A2A-SPEC] for these asynchronous patterns.

### User Personalization Context

CAP leverages the standard A2A `Task.contextId` for enabling Merchant Agents to provide personalized experiences and maintain context continuity across multiple interactions with a Client Agent for a specific user. The `contextId` is generated by the Merchant Agent (A2A Server). This feature is aimed at supporting personalization of pre-sign-in interactions such as "guest" product search and product details, avoiding the need for OAuth2 sign-in for many interactions.

**Establishing and Using Personalization Context:**

1.  **Initial Interaction & Context Establishment:**
    *   When a Client Agent first interacts with a Merchant on behalf of a user, it **SHOULD** invoke the `cap:user_preferences_set` CAP Skill (defined in [`cap:user_preferences_set`](#capuser_preferences_set)) to set explicit user preferences and provide consent for user data collection. This skill **MAY** be invoked along other CAP skills, e.g., it's possible to send both `cap:user_preferences_set` and `cap:product_get` in the same initiating `Message`. In this scenario, `cap:user_preferences_set` **MUST** be the first skill in the `Message.parts`.
    *   The Merchant Agent, upon processing a successful request, **MUST** generate an A2A `Task.contextId` if one is not already established for this interaction chain or if it deems a new context is appropriate. This `contextId` **MAY** be associated with the user and persisted, subject to consent.
    *   This `Task.contextId` is returned to the Client Agent as part of the standard A2A `Task` object in the response.

2.  **Maintaining Context in Subsequent Interactions:**
    *   The Client Agent **SHOULD** securely store the `contextId` received from a Merchant Agent, on a per-user, per-Merchant Agent basis.
    *   For subsequent A2A `Message`s sent to that same Merchant Agent where personalization or context continuity is desired (e.g., for `cap:product_search` or `cap:product_get`), the Client Agent **SHOULD** include this previously received `contextId` in the `contextId` field of the A2A `Message` object (see Section 6.4 of [A2A-SPEC]).
    *   Merchant Agents receiving a `Message` with a recognized `contextId` **SHOULD** use it to retrieve any associated user preferences and apply them to personalize the CAP Skill execution and response.

3.  **Merchant-Controlled `contextId` Lifetime (Refresh):**
    *   A Merchant Agent **MAY** choose to issue a *new* `Task.contextId` in its response to an A2A Task, even if the incoming `Message` contained an existing `contextId`. This can be used, for example, to manage session expiration or context re-keying.
    *   If a Merchant Agent returns a new `Task.contextId`, Client Agents **MUST** update their stored context identifier for that user/merchant to this new `contextId` for future interactions with that specific context.

4.  **Updating and Clearing Preferences:**
    *   Updates to existing preferences associated with a `contextId` **MUST** be done by invoking the `cap:user_preferences_set` skill, providing the existing `contextId` in the A2A `Message.contextId` field and the new `preferences` (including `userDataConsent`) in the skill's parameters.
    *   Revocation of consent and clearing of preferences associated with a `contextId` **MUST** be done by invoking the `cap:user_preferences_set` skill providing the relevant `contextId` in `Message.contextId` with `preferences.userDataConsent` set to:
        *   `\"absent\"`: indicating _absence_ of consent, the default if no consent was ever provided for the context.
        *   `\"none\"`: indicating explicit rejection of consent
        

**Interaction with Full OAuth 2.1 Authentication:**

*   If an A2A request is made with a valid OAuth 2.1 Access Token (see [Security Considerations](#security-considerations)), the identity and authorization from the Access Token take precedence for any privileged actions.
*   If a `contextId` (sent via `Message.contextId`) is also provided, the Merchant Agent **MAY** link the personalization context associated with this `contextId` to the fully authenticated user (identified by the OIDC `sub` claim), provided user consent for such linking was obtained, per [User Data Privacy and Consent Guidelines](#user-data-privacy-and-consent-guidelines).

**Security and Privacy:**

*   The A2A `Task.contextId`, when used by CAP for linking personalization data, **SHOULD** be treated as sensitive by both Client and Merchant Agents. Its use for personalization is governed by the principles in [User Data Privacy and Consent Guidelines](#user-data-privacy-and-consent-guidelines).
*   Merchant Agents **SHOULD** strive to generate `contextId`s that are not easily guessable or correlatable with other user identifiers across different systems, especially for users who have not fully authenticated.
*   Client Agents **MUST NOT** send a `contextId` received from one Merchant Agent to a different, unaffiliated Merchant Agent.

## Core Skills Specifications

This section defines the standardized CAP Skills that Merchant Agents can implement and Client Agents can invoke. All CAP Skills are invoked as A2A tasks, as described in [Interaction Model (A2A)](#interaction-model-a2a). For each skill, this section will specify its unique `skillId` and purpose. Detailed definitions of input parameters, result artifact structures, and specific error conditions for each skill will be elaborated in future revisions of this specification or in accompanying documents.

Client Agents **MUST** specify the target CAP Skill by including `{\"skillId\": \"<full_skill_id>\"}` in the `metadata` field of the A2A `Message` object.

### Common Types

This section defines common TypeScript interfaces used across multiple CAP skills. These types are defined in the consolidated `types/types.ts` file and referenced throughout the skill specifications.

**Core Product Types:**

```ts
--8<-- "types/types.ts:ProductAvailability"
```

```ts
--8<-- "types/types.ts:ProductOffer"
```

```ts
--8<-- "types/types.ts:ProductSummary"
```

```ts
--8<-- "types/types.ts:ProductVariant"
```

```ts
--8<-- "types/types.ts:ProductReviewSummary"
```

```ts
--8<-- "types/types.ts:ShippingOption"
```

**Cart and Order Types:**

```ts
--8<-- "types/types.ts:CartTotals"
```

```ts
--8<-- "types/types.ts:TaxCalculation"
```

```ts
--8<-- "types/types.ts:CartAction"
```

```ts
--8<-- "types/types.ts:OrderStatus"
```

```ts
--8<-- "types/types.ts:PaymentStatus"
```

```ts
--8<-- "types/types.ts:TrackingInfo"
```

**Address Types:**

```ts
--8<-- "types/types.ts:ShippingAddress"
```

```ts
--8<-- "types/types.ts:BillingAddress"
```

**User Preference Types:**

```ts
--8<-- "types/types.ts:UserDataConsent"
```

```ts
--8<-- "types/types.ts:LocalePreferences"
```

```ts
--8<-- "types/types.ts:ShoppingPreferences"
```

```ts
--8<-- "types/types.ts:AccessibilityPreferences"
```

```ts
--8<-- "types/types.ts:CommunicationPreferences"
```

### Product Discovery and Information Skills

#### `cap:product_search`
*   **Skill ID:** `cap:product_search`
*   **Purpose:** Enables a Client Agent to search for products offered by the Merchant Agent based on a query string and optional filters.
*   **Specific Error Conditions:** *(Placeholder: To be detailed)*

<em>Guidance on query modes and filter expressions is available in [Query Formulation](#query-formulation).</em>

**Input Schema:**

```ts
--8<-- "types/types.ts:ProductSearchInput"
```

**Output Schema:**

```ts
--8<-- "types/types.ts:ProductSearchOutput"
```

#### `cap:product_get`
*   **Skill ID:** `cap:product_get`
*   **Purpose:** Allows a Client Agent to retrieve comprehensive product information for one or more specific products, identified by their canonical CAP Product URNs. Returns complete schema.org Product data by default, including offers with availability status.
*   **Authentication:** **SHOULD** be tagged `auth:public` to allow unauthenticated access to product information.
*   **Specific Error Conditions:** `CAP_PRODUCT_NOT_FOUND`, `CAP_INVALID_PRODUCT_URN`

**Input Schema:**

```ts
--8<-- "types/types.ts:ProductGetInput"
```

**Output Schema:**

```ts
--8<-- "types/types.ts:ProductGetOutput"
```



### Cart Management Skills

#### `cap:cart_manage`
*   **Skill ID:** `cap:cart_manage`
*   **Purpose:** Enables a Client Agent to manage a user's shopping cart, including viewing the cart, adding items, updating quantities, and removing items. This skill requires an action parameter to specify the desired cart operation.
*   **Authentication:** **MUST** require authentication to access and modify user's cart.
*   **Specific Error Conditions:** `CAP_ITEM_NOT_AVAILABLE`, `CAP_INVALID_ITEM_ID`, `CAP_CART_NOT_FOUND`, `CAP_INSUFFICIENT_INVENTORY`, `CAP_INVALID_QUANTITY`, `CAP_CART_OPERATION_FAILED`

**Input Schema:**

```ts
--8<-- "types/types.ts:CartManageInput"
```

**Output Schema:**

```ts
--8<-- "types/types.ts:CartManageOutput"
```

### Order Management Skills

#### `cap:order_status`
*   **Skill ID:** `cap:order_status`
*   **Purpose:** Allows a Client Agent to retrieve the current status of a previously placed order.
*   **Authentication:** **MUST** require authentication to access order information. Orders are only accessible to the customer who placed them.
*   **Specific Error Conditions:** `CAP_ORDER_NOT_FOUND`, `CAP_ACCESS_DENIED`, `CAP_INVALID_ORDER_ID`

**Input Schema:**

```ts
--8<-- "types/types.ts:OrderStatusInput"
```

**Output Schema:**

```ts
--8<-- "types/types.ts:OrderStatusOutput"
```

### User Context and Preference Skills

This group of skills allows Client Agents to manage user-consented preferences and personalization context with a Merchant Agent, primarily related to the A2A `Task.contextId` mechanism defined in [User Personalization Context](#user-personalization-context).

#### `cap:user_preferences_set`
*   **Skill ID:** `cap:user_preferences_set`
*   **Purpose:** Allows a Client Agent to establish or update user-consented preferences with a Merchant Agent. These preferences are associated by the Merchant Agent with the A2A `Task.contextId` that is returned upon successful establishment, or linked to an existing `contextId` if one is provided by the Client Agent in the `Message.contextId` field for an update. This skill is also used to revoke consent for storing preferences.
*   **Authentication:** **MAY** be available for unauthenticated users to establish personalization context. **SHOULD** be tagged `auth:public` if supporting guest personalization.
*   **Specific Error Conditions:** `CAP_USER_CONSENT_REQUIRED`, `CAP_INVALID_PREFERENCES_FORMAT`, `CAP_INVALID_CONTEXT_ID_FOR_UPDATE`, `CAP_CONSENT_POLICY_NOT_SUPPORTED`

**Input Schema:**

```ts
--8<-- "types/types.ts:UserPreferencesSetInput"
```

**Output Schema:**

```ts
--8<-- "types/types.ts:UserPreferencesSetOutput"
```

## Error Handling

When a CAP Skill invocation results in an error, the A2A Task processing the skill **MUST** indicate this failure through the standard A2A mechanisms, primarily by setting the `Task.status.state` to `\"failed\"`.

Further details about the CAP-specific error **MUST** be provided within the `Task.status.message` field (which is an A2A `Message` object). This message **SHOULD** contain a single A2A `DataPart` structured as follows:

```json
{
  "capErrorCode": "string", 
  "description": "string",   
  "details": {}            
}
```

*   **`capErrorCode` (string, REQUIRED):** A namespaced, uppercase string identifying the specific CAP error (e.g., `CAP_PRODUCT_NOT_FOUND`, `CAP_ITEM_OUT_OF_STOCK`).
*   **`description` (string, REQUIRED):** A human-readable message explaining the error, suitable for display to a developer or potentially an end-user.
*   **`details` (object, OPTIONAL):** A JSON object providing additional, structured context about the error. The content of this object may vary depending on the `capErrorCode`.

Client Agents **SHOULD** inspect the `Task.status.state` first. If it is `\"failed\"`, they **SHOULD** then parse the `Task.status.message.parts[0].data` to retrieve the CAP-specific error information.

This section will later enumerate common `capErrorCode` values and their meanings. Standard A2A-level errors (e.g., related to task processing itself, malformed requests to the A2A endpoint) are handled as defined in Section 8 of [A2A-SPEC].

**Common CAP Error Codes:**

**Product and Search Errors:**
*   `CAP_PRODUCT_NOT_FOUND` - Requested product(s) do not exist or are not accessible
*   `CAP_INVALID_PRODUCT_URN` - Product identifier format is invalid or malformed
*   `CAP_SEARCH_FAILED` - Product search operation failed due to system error
*   `CAP_SEARCH_QUERY_TOO_BROAD` - Search query returned too many results; refinement needed
*   `CAP_SEARCH_QUERY_INVALID` - Search query contains invalid syntax or unsupported operators

**Inventory and Availability Errors:**
*   `CAP_ITEM_OUT_OF_STOCK` - Requested item is currently out of stock
*   `CAP_INSUFFICIENT_INVENTORY` - Not enough inventory to fulfill the requested quantity

**Cart Management Errors:**
*   `CAP_CART_NOT_FOUND` - Specified cart does not exist or has expired
*   `CAP_CART_OPERATION_FAILED` - Cart operation failed due to system error
*   `CAP_INVALID_ITEM_ID` - Item identifier is invalid or malformed
*   `CAP_INVALID_QUANTITY` - Quantity value is invalid (negative, zero when not allowed, exceeds limits)
*   `CAP_CART_EXPIRED` - Cart has expired and is no longer accessible
*   `CAP_CART_ITEM_NOT_FOUND` - Specified cart item does not exist in the cart

**Order Errors:**
*   `CAP_ORDER_NOT_FOUND` - Requested order does not exist or is not accessible

**User Preferences and Context Errors:**
*   `CAP_USER_CONSENT_REQUIRED` - User consent is required for the requested operation
*   `CAP_INVALID_PREFERENCES_FORMAT` - User preferences data format is invalid
*   `CAP_INVALID_CONTEXT_ID_FOR_UPDATE` - Context ID is invalid or has expired
*   `CAP_CONSENT_POLICY_NOT_SUPPORTED` - Specified consent policy is not supported by the merchant

**Authentication and Authorization Errors:**
*   `CAP_AUTHENTICATION_REQUIRED` - Authentication is required for this operation
*   `CAP_AUTHORIZATION_DENIED` - User is not authorized to perform this operation
*   `CAP_ACCESS_DENIED` - Access to the requested resource is denied
*   `CAP_SESSION_EXPIRED` - User session has expired and re-authentication is required

**General System Errors:**
*   `CAP_INVALID_PARAMETERS` - Request parameters are invalid or malformed
*   `CAP_RATE_LIMIT_EXCEEDED` - Rate limit has been exceeded; client should retry later
*   `CAP_SERVICE_UNAVAILABLE` - Service is temporarily unavailable
*   `CAP_INTERNAL_ERROR` - An internal system error occurred
*   `CAP_FEATURE_NOT_SUPPORTED` - Requested feature is not supported by this merchant
*   `CAP_REQUEST_TOO_LARGE` - Request payload exceeds maximum allowed size

## User Data Privacy and Consent Guidelines

In this section we define standard user data handling policies. Those policies are presented to the user by Client Agents, and obtained consent is forwarded to Merchant Agents. The goal of standard policies is to streamline user consent experience across the different channels, when interacting with multiple Client Agents and with multiple Merchants. 

Client Agents are free to implement consent grants workflows as long as they adhere to the principles in this section. Once obtained, consent **SHOULD** be granted by invoking the `cap:user_preferences_set` with `{\"userDataConsent\": <value>, ...}` in the payload - the value **MUST** be one of the standard policies defined in [User Data for Personalization Policies](#user-data-for-personalization-policies), or `absent` or `none` keywords as defined in [User Personalization Context](#user-personalization-context).

A Merchant Agent **SHOULD NOT** reject a standard policy (NOT RECOMMENDED) when presented with granted consent via `userDataConsent`. If the Merchant Agent chooses to reject a policy  they **MAY** proceed with a non-personalized consent request for a custom policy. When presented with a custom policy request, the Client Agent **MAY** choose to ignore the request and not present them to the user, re-issuing the request anonymously, or **MAY** choose to stop the interaction with the Merchant Agent.

_Note: This section and following policy text are drafts and pending review by legal professionals._

### Principles

We define principles to apply to all user data processed for personalization, including explicit user preferences, inferred behavioral data, and any identifiers used to link context across interactions. Client Agents and Merchant Agents **MUST** also comply with all applicable data privacy laws.


-   **Transparency:** Users **MUST** be clearly informed about what data is collected for personalization, how it is used, and with whom it is shared.
-   **User Control & Consent:** Personalization data **MUST** only be collected, stored, or used with the user's explicit, informed, and voluntary consent. Users **MUST** have accessible ways to review, modify, or withdraw their consent at any time.
-   **Purpose Limitation:** Data collected for personalization **MUST** only be used for the specific, consented purpose. Any other use **MUST** have new, explicit consent.
-   **Data Minimization:** Only the minimum data necessary for the stated personalization purpose **SHOULD** be collected and processed.
-   **Security:** All parties **MUST** apply strong security measures to protect user data from unauthorized access, disclosure, or misuse.
-   **Accountability:** All parties are responsible for complying with these guidelines and applicable privacy laws, and **SHOULD** maintain appropriate records of consent and data handling.

### User Data for Personalization Policies

In this section we define the standard policies Client Agents **SHOULD** present to users and **SHOULD** be accepted by Merchant Agents.

#### Policy: `all`

This policy explains how your information is used when you agree to **this policy** for personalized services offered by a merchant through your AI assistant. Agreeing to **this policy** means you consent to the merchant's system collecting and using your data as described below to enhance your experience.

**1. What Information is Used**
To personalize your experience, the merchant's system uses several types of information:
    *   It uses the data you share directly via your AI assistant, such as your preferences and consent choices.
    *   It keeps a record of your activities with the merchant's services, like your searches, the products you view, and your cart activity.
    *   From your information and interactions, the system also derives insights about your preferences and characteristics to better tailor services to you.

**2. How Your Information is Used**
Your information helps us to:
    *   Offer you relevant product recommendations, search results, and promotions, personalizing your experience.
    *   Remember your settings for a smoother and more convenient experience.
    *   Analyze usage (often aggregated or de-identified) to understand how our services are used and to improve our offerings.
    *   Facilitate your transactions and overall interactions with the platform.
    *   Link interaction data from your un-authenticated browsing context to your account if you sign in later, creating a continuous personalized experience.

**3. How Your Information is Shared**
    *   Your information is used by the specific merchant you're interacting with.
    *   The merchant will not sell or share your identifiable personal information with unaffiliated third parties for their marketing or advertising. Sharing with such parties is strictly limited to what's essential for services you explicitly request (e.g., payment processing, shipping) or when required by law.
    *   This policy doesn't cover your AI assistant's data practices, which has its own policy.

**4. Your Control Over Consent**
    *   You control your consent and can change or withdraw it at any time using your AI assistant's preference settings.
    *   Withdrawing consent stops future personalization based on this policy. Information collected previously will be handled according to the merchant's data retention policies and legal duties, but not used for new personalization under the withdrawn consent.

**5. Data Retention**
    *   Your information and any inferred insights are kept as long as needed for personalization, operational needs, or as legally required, linked to your interaction context and consent.

## Security Considerations

Security is fundamental to the trust and reliability of CAP interactions. This section outlines key security considerations. Implementers **MUST** also adhere to general web security best practices.

### Authentication

CAP's authentication model is built upon the mechanisms defined in the [Agent2Agent (A2A) Protocol Specification][A2A-SPEC] (see Section 4 of [A2A-SPEC]). Key principles include:

*   **Transport Security:** All CAP communication **MUST** occur over HTTPS.
*   **Declared Schemes:** Merchant Agents **MUST** declare their supported authentication schemes in their A2A AgentCard (specifically in the `authentication` field, as per [A2A-SPEC] and CAP [CAP Requirements for the AgentCard](#cap-requirements-for-the-agentcard)). CAP **RECOMMENDS** the use of OpenID Connect (OIDC) as the primary authentication scheme.
*   **Client Authentication:** For skills requiring authentication, Client Agents **MUST** include appropriate credentials (e.g., a valid Bearer token in `Authorization` header, a valid key in `X-API-Key`) with their requests, as per the merchant's declared schemes. Merchant Agents **MUST** authenticate these requests.

#### Publicly Accessible Skills

While many CAP skills involve sensitive operations or user data and thus require robust authentication, certain skills may be designed for public, non-authenticated access (e.g., general product searches, retrieving publicly available store information).

To accommodate this, CAP defines the following convention:

*   a CAP Skill **MAY** be designated as publicly accessible if it includes the tag `auth:public` within the `tags` array of its skill definition in the Merchant Agent's A2A AgentCard.
*   Merchant Agents **SHOULD** accept and process requests invoking a CAP Skill tagged `auth:public` without requiring an `Authorization` header or other forms of client authentication.
*   If a CAP Skill is **NOT** tagged with `auth:public`, or if the tag is absent, it **MUST** require authentication. In such cases, Merchant Agents **MUST** enforce the authentication requirements declared in their A2A AgentCard, as per standard A2A protocol behavior, and **MUST** reject unauthenticated or improperly authenticated requests accordingly.
*   Client Agents, before attempting an unauthenticated request to a CAP Skill, **SHOULD** inspect the skill's definition in the Merchant Agent's AgentCard to check for the presence of the `auth:public` tag.

Even for skills marked `auth:public`, Merchant Agents **SHOULD** implement appropriate measures to protect against abuse, such as rate limiting and traffic analysis.

#### Rate Limiting and Abuse Protection

To ensure service stability and fair usage, and to protect against denial-of-service attacks or misbehaving clients (including overly aggressive crawlers), Merchant Agents **SHOULD** implement robust rate limiting on their CAP API endpoints.

*   Rate limits may be based on various factors, including but not limited to: source IP address, authenticated Client Agent identity (if applicable), specific skill invocation frequency, or overall request volume.
*   When a request is denied due to rate limiting, the Merchant Agent **SHOULD** respond with an HTTP `429 Too Many Requests` status code.
    *   The response **MAY** include a body to provide more detailed, machine-readable context about the rate limit. This information can be particularly useful for Client Agents and their underlying language models to understand the reason and adapt behavior. If a body is provided, it is **RECOMMENDED** to use a JSON object structure consistent with the CAP error reporting format (see Section 6), for example:
        ```json
        {
          "capErrorCode": "CAP_RATE_LIMIT_EXCEEDED", // Or a more specific merchant-defined code like "CAP_HOURLY_QUOTA_EXCEEDED"
          "description": "The request has been rate-limited. Please reduce request frequency or try again after the specified period.", // More descriptive
          "details": { // Structured details aimed at automated parsing or LLM interpretation, all fields are optional.
            "skillId": "cap:product_search",
            "limitType": "requests_per_minute", 
            "limitScope": "per_client_agent_id", // Example: or "per_ip", "global"
            "requestsMade": 120,                 // Example
            "requestsAllowed": 100,              // Example
            "retryAfterSeconds": 60              // Consistent with Retry-After header
          }
        }
        ```
*   It is further **RECOMMENDED** that Merchant Agents include a `Retry-After` HTTP header with the 429 response, indicating how long the client should wait before making a new request, as per [RFC 6585](https://tools.ietf.org/html/rfc6585).

Merchant Agents are also responsible for other general abuse protection mechanisms appropriate for public-facing APIs.

### Authorization

Once a Client Agent is authenticated, Merchant Agents **MUST** implement appropriate authorization controls to ensure that clients can only access resources and perform operations they are permitted to access.

#### Skill-Level Authorization

*   **Public Skills:** Skills tagged with `auth:public` in the Merchant Agent's AgentCard **SHOULD** be accessible without authorization requirements.
*   **Authenticated Skills:** Skills requiring authentication **MUST** implement authorization checks based on the authenticated client's identity and permissions.
*   **User Context Isolation:** Client Agents **MUST** only access user-specific resources (carts, orders, preferences) for the authenticated user associated with their access token.

#### Resource Access Control

*   **Cart Access:** Client Agents **MUST** only access carts belonging to the authenticated user. Cart identifiers **SHOULD** be scoped to the user context.
*   **Order Access:** Order information **MUST** only be accessible to the customer who placed the order or authorized representatives.
*   **User Preferences:** Preference data **MUST** only be accessible and modifiable within the established context (via `contextId`) or authenticated user session.

#### Scope-Based Authorization

Merchant Agents **MAY** implement scope-based authorization where different Client Agents or access tokens have different permission levels:

*   **Read-only access:** Permits product browsing and search but not cart or order operations
*   **Cart management:** Allows cart operations but not order placement
*   **Full e-commerce:** Complete access to all CAP operations
*   **Admin access:** Extended permissions for merchant partners or specialized integrations

#### Authorization Failure Handling

When authorization fails, Merchant Agents **MUST**:
*   Return an appropriate CAP error code (`CAP_AUTHORIZATION_DENIED` or `CAP_ACCESS_DENIED`)
*   **NOT** reveal information about the existence of resources the client is not authorized to access
*   Log authorization failures for security monitoring

### Data Validation and Input Sanitization

Merchant Agents **MUST** implement comprehensive input validation and sanitization to protect against injection attacks and ensure data integrity.

#### Input Validation Requirements

*   **Schema Validation:** All CAP skill inputs **MUST** be validated against their defined TypeScript schemas before processing.
*   **Data Type Validation:** Enforce strict data typing for all input parameters (strings, numbers, booleans, arrays, objects).
*   **Length Limits:** Implement reasonable length limits for string inputs to prevent buffer overflow and DoS attacks.
*   **Range Validation:** Validate numeric inputs are within acceptable ranges (e.g., positive quantities, valid pagination offsets).

#### String Input Sanitization

*   **Product Identifier Validation:** Validate that product identifiers are non-empty strings and conform to the merchant's expected format
*   **Search Query Sanitization:** Sanitize search queries to prevent injection attacks while preserving search functionality
*   **Filter Expression Validation:** When supporting SQL-like filter expressions, use parameterized queries or whitelist-based validation
*   **Address Validation:** Validate shipping and billing addresses for proper formatting and realistic values

#### Injection Attack Prevention

*   **SQL Injection:** Use parameterized queries or ORM frameworks that prevent SQL injection
*   **NoSQL Injection:** Validate and sanitize inputs for NoSQL databases
*   **Command Injection:** Never execute system commands based on user input
*   **Script Injection:** Sanitize any user-provided content that might be rendered in web interfaces

#### Output Sanitization

*   **Response Data:** Ensure all response data is properly escaped when returned to prevent client-side injection
*   **Error Messages:** Sanitize error messages to prevent information disclosure while maintaining usefulness
*   **URL Generation:** Validate and sanitize any URLs included in responses (redirect URLs, product URLs, etc.)

#### File Upload Security (Future Extensions)

For future CAP extensions that might support file uploads:
*   Validate file types and sizes
*   Scan uploaded files for malware
*   Store uploaded files in secure, isolated storage
*   Never execute uploaded files

### Protection Against Common Web Vulnerabilities

While CAP primarily operates as an API protocol, Merchant Agents **SHOULD** implement protections against common web vulnerabilities, especially if they provide web interfaces for payment completion or order management.

#### Cross-Site Scripting (XSS) Prevention

*   **Output Encoding:** Encode all dynamic content in web responses using context-appropriate encoding
*   **Content Security Policy (CSP):** Implement strict CSP headers to prevent unauthorized script execution
*   **Input Sanitization:** Sanitize any user inputs that might be displayed in web interfaces
*   **Safe HTML Generation:** Use templating engines that automatically escape content

#### Cross-Site Request Forgery (CSRF) Protection

*   **CSRF Tokens:** Implement CSRF tokens for any state-changing operations accessed via web interfaces
*   **SameSite Cookies:** Use SameSite cookie attributes to prevent cross-site cookie usage
*   **Origin Validation:** Validate the Origin and Referer headers for sensitive operations
*   **Double-Submit Cookies:** Consider double-submit cookie patterns for additional CSRF protection

#### Clickjacking Prevention

*   **X-Frame-Options:** Set appropriate X-Frame-Options headers to prevent framing
*   **Content Security Policy:** Use CSP frame-ancestors directive to control where pages can be embedded
*   **Frame-Busting Scripts:** Implement client-side frame-busting code when appropriate

#### Information Disclosure Prevention

*   **Error Handling:** Provide generic error messages to external clients while logging detailed errors internally
*   **HTTP Headers:** Remove or obfuscate server version information and other revealing headers
*   **Debug Information:** Ensure debug information is not exposed in production environments
*   **Directory Traversal:** Prevent path traversal attacks in any file serving functionality

#### Session Security

*   **Secure Cookies:** Use Secure and HttpOnly flags for session cookies
*   **Session Timeout:** Implement appropriate session timeout policies
*   **Session Regeneration:** Regenerate session IDs after authentication and privilege changes
*   **Concurrent Sessions:** Consider implementing limits on concurrent sessions per user

#### Transport Security

*   **HTTPS Enforcement:** Enforce HTTPS for all CAP endpoints and redirect HTTP to HTTPS
*   **HSTS Headers:** Implement HTTP Strict Transport Security headers
*   **Certificate Validation:** Ensure proper SSL/TLS certificate validation and management
*   **Cipher Suites:** Use strong cipher suites and disable weak encryption protocols

## Extensibility

CAP is designed to be extensible, allowing Merchant Agents to offer capabilities beyond the core skills defined in this specification and to augment standard skills with additional optional information. This extensibility must be approached in a way that maintains baseline interoperability.

The CAP standard itself is an evolving effort. While this document defines foundational e-commerce interactions, further development and refinement are ongoing.

### Modes of Extensibility

CAP can be extended in several ways:

*   **Merchant-Specific Custom Skills:** As detailed below, individual Merchant Agents can offer custom skills beyond the standard set.
*   **Optional Extensions to Standard Skills:** Merchants can add optional parameters or fields to standard skills.
*   **CAP Profiles for Verticals:** It is anticipated that specialized "profiles" of CAP may be developed in the future to cater to the unique needs of specific industry verticals (e.g., travel and tourism, food delivery, financial services). These profiles would build upon the core CAP specification, adding skills or refining data structures relevant to that vertical.
*   **Evolution of the Core Specification:** The core CAP specification will evolve over time to incorporate new generally applicable e-commerce capabilities.

### Declaring Additional Custom Skills

Merchant Agents **MAY** expose additional, custom CAP Skills or other A2A tasks not defined in this core specification by declaring them in their A2A AgentCard (within the `skills` array).

Client Agents encountering unknown skill IDs in an AgentCard **MAY** ignore them if they are not programmed to handle them.

For effective discovery and utilization of custom skills, Merchant Agents **SHOULD** provide clear and comprehensive documentation for these custom skills. This documentation **SHOULD** be accessible, for instance, via the `documentationUrl` field in their AgentCard or provided in the skill's `description` field. Merchant Agents should also understand that the adoption and successful use of complex or highly specialized custom skills may require direct engagement or communication with Client Agent developers or providers.

This version of CAP primarily focuses on standardizing core e-commerce operations. The mechanisms for broad, automated discovery and negotiation of purely custom skills beyond their declaration in the AgentCard are considered out of scope for this version and may rely on bilateral agreements or future community-developed conventions.

### Extending Standard CAP Skills

Merchant Agents **MAY** extend standard CAP Skills by including additional **OPTIONAL** parameters in their input data structures or by providing additional **OPTIONAL** fields in their result artifact data structures.

Conforming Client Agents **SHOULD** gracefully handle the absence or presence of such optional extensions when interacting with different Merchant Agents. Client Agents **SHOULD NOT** expect non-standard optional fields or parameters to be present and **MUST NOT** fail if they are absent.

The adoption of such optional extensions by Client Agent developers often depends on their perceived value, ease of implementation, and the clarity of documentation provided by the Merchant Agent.

### Maintaining Core Interoperability

To ensure baseline interoperability:

*   Merchant Agents **MUST NOT** alter the fundamental behavior or semantics of the standard CAP Skills defined in this specification.
*   Merchant Agents **MUST NOT** remove or change the meaning of **REQUIRED** fields or parameters from the standard definitions of CAP Skills.
*   All extensions to standard skills **MUST** be additive and optional.

### Contributing to CAP Standardization

Organizations interested in contributing to the CAP standard, particularly by proposing extensions for general use cases or developing new profiles for specific verticals, are encouraged to reach out to the specification editors or participate in the designated community forums (details for which will be provided as the governance model for CAP is formalized).

## Usage Examples

This section provides practical examples demonstrating how to use CAP skills in real-world scenarios.

### Complete E-commerce Flow Example

This example demonstrates a complete shopping flow using multiple CAP skills:

**Step 1: Product Search**

```json
// A2A Message for product search
{
  "role": "user",
  "parts": [
    {
      "kind": "data",
      "metadata": { "skillId": "cap:product_search" },
      "data": {
        "query": "wireless headphones",
        "queryMode": "keyword",
        "filter": "price < 200 AND brand IN ('Sony', 'Bose')",
        "limit": 10
      }
    }
  ]
}
```

**Step 2: Get Product Details**

```json
// Get detailed information for selected products
{
  "role": "user",
  "contextId": "merchant_context_abc123",
  "parts": [
    {
      "kind": "data",
      "metadata": { "skillId": "cap:product_get" },
      "data": {
        "productIds": ["SONY-WH1000XM4", "BOSE-QC45"]
      }
    }
  ]
}
```

**Step 3: Add to Cart**

```json
// Add selected product to cart
{
  "role": "user",
  "contextId": "merchant_context_abc123",
  "parts": [
    {
      "kind": "data",
      "metadata": { "skillId": "cap:cart_manage" },
      "data": {
        "action": "add",
        "addItems": [
          {
            "productId": "SONY-WH1000XM4",
            "variantAttributes": { "color": "Black" },
            "quantity": 1
          }
        ],
        "includeShippingOptions": true
      }
    }
  ]
}
```

**Step 4: View Cart**

```json
// View current cart contents
{
  "role": "user",
  "contextId": "merchant_context_abc123",
  "parts": [
    {
      "kind": "data",
      "metadata": { "skillId": "cap:cart_manage" },
      "data": {
        "action": "view",
        "includeShippingOptions": true,
        "includeTaxCalculations": true
      }
    }
  ]
}
```

### User Preferences Setup Example

Establishing user preferences for personalized shopping:

```json
{
  "role": "user",
  "parts": [
    {
      "kind": "data",
      "metadata": { "skillId": "cap:user_preferences_set" },
      "data": {
        "preferences": {
          "userDataConsent": "all",
          "locale": {
            "language": "en-US",
            "country": "US",
            "currency": "USD",
            "timezone": "America/New_York"
          },
          "shopping": {
            "categories": ["electronics", "books", "home_garden"],
            "priceRange": { "max": 500, "currency": "USD" },
            "brands": ["Apple", "Sony", "Samsung"]
          }
        }
      }
    }
  ]
}
```

### Standard Offers Usage Example

Example showing products with Standard Offers in search results and detailed product information:

**Product Search Response with Standard Offers:**

```json
{
  "id": "task-456",
  "status": {
    "state": "completed"
  },
  "artifacts": [
    {
      "artifactId": "search-results-002",
      "parts": [
        {
          "kind": "data",
          "data": {
            "products": [
              {
                "id": "WIDGET-2024",
                "name": "Premium Widget 2024",
                "description": "Latest model with advanced features",
                "image": "https://example.com/widget-2024.jpg",
                "offers": [
                  {
                    "identifier": "offer-widget-bogo",
                    "price": "99.99",
                    "priceCurrency": "USD",
                    "availability": "inStock",
                    "additionalType": "urn:cap:StandardOffer:BOGO50",
                    "description": "Buy one, get one 50% off with code BOGO50"
                  }
                ]
              },
              {
                "id": "GADGET-PRO",
                "name": "Professional Gadget",
                "description": "Industrial-grade gadget for professionals",
                "offers": [
                  {
                    "identifier": "offer-gadget-bulk",
                    "price": "149.99",
                    "priceCurrency": "USD",
                    "availability": "inStock",
                    "additionalType": "urn:cap:StandardOffer:BTGOF",
                    "description": "Buy two, get one free - Perfect for teams"
                  }
                ]
              }
            ],
            "totalResults": 2,
            "offset": 0,
            "limit": 10
          }
        }
      ]
    }
  ]
}
```

**Product Details Response with Multiple Standard Offers:**

```json
{
  "products": [
    {
      "id": "WIDGET-2024",
      "name": "Premium Widget 2024",
      "description": "Latest model with advanced features and premium materials",
      "images": [
        "https://example.com/widget-2024-main.jpg",
        "https://example.com/widget-2024-side.jpg"
      ],
      "offers": [
        {
          "identifier": "offer-regular",
          "price": "99.99",
          "priceCurrency": "USD",
          "availability": "inStock"
        },
        {
          "identifier": "offer-bogo",
          "price": "99.99",
          "priceCurrency": "USD",
          "availability": "inStock",
          "additionalType": "urn:cap:StandardOffer:BOGO50",
          "description": "Buy one, get one 50% off with code BOGO50"
        },
        {
          "identifier": "offer-bulk",
          "price": "89.99",
          "priceCurrency": "USD",
          "availability": "inStock",
          "additionalType": "urn:cap:StandardOffer:PCT10",
          "description": "10% off when you buy 3 or more"
        }
      ],
      "brand": "TechCorp",
      "category": "Electronics"
    }
  ]
}
```

### Error Handling Example

Example of handling a product not found error:

```json
// CAP Error Response
{
  "id": "task-123",
  "status": {
    "state": "failed",
    "message": {
      "role": "agent",
      "parts": [
        {
          "kind": "data",
          "data": {
            "capErrorCode": "CAP_PRODUCT_NOT_FOUND",
            "description": "The requested product 'INVALID123' was not found",
            "details": {
              "productId": "INVALID123",
              "suggestions": ["SIMILAR456"]
            }
          }
        }
      ]
    }
  }
}
```

### Text-based Interaction Example

Natural language product search:

```json
{
  "role": "user",
  "contextId": "merchant_context_abc123",
  "parts": [
    {
      "kind": "text",
      "text": "I'm looking for a good coffee maker under $100 that can make espresso"
    }
  ]
}
```

### Product Information with Field Selection Example

Getting specific product fields (availability included automatically in offers):

```json
{
  "role": "user",
  "contextId": "merchant_context_abc123",
  "parts": [
    {
      "kind": "data",
      "metadata": { "skillId": "cap:product_get" },
      "data": {
        "productIds": [
          "COFFEE-MAKER-123",
          "COFFEE-BEANS-456"
        ],
        "fields": ["name", "brand", "offers"]
      }
    }
  ]
}
```

## References
- **[A2A-SPEC]** Google, "Agent2Agent (A2A) Protocol Specification", Version 0.2.6 (or latest). URL: [https://a2a-protocol.org/latest/specification/](https://a2a-protocol.org/latest/specification/)
- **[RFC 2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997.
- **[RFC 6585]** Nottingham, M., and R. Fielding, "Additional HTTP Status Codes", RFC 6585, DOI 10.17487/RFC6585, April 2012. URL: [https://tools.ietf.org/html/rfc6585](https://tools.ietf.org/html/rfc6585)
- **[RFC 8141]** Saint-Andre, P. and J. Klensin, "Uniform Resource Names (URNs)", RFC 8141, DOI 10.17487/RFC8141, April 2017. URL: [https://tools.ietf.org/html/rfc8141](https://tools.ietf.org/html/rfc8141)
- **[RFC 9309]** Klyne, G., et al. "Robots Exclusion Protocol", RFC 9309, September 2022. URL: [https://www.rfc-editor.org/info/rfc9309](https://www.rfc-editor.org/info/rfc9309)
- **[IETF BCP 47]** Phillips, A., Ed., and M. Davis, Ed., "Tags for Identifying Languages", BCP 47, RFC 5646, September 2009. URL: [https://tools.ietf.org/html/bcp47](https://tools.ietf.org/html/bcp47)
- **[IANA Time Zone Database]** Internet Assigned Numbers Authority, "Time Zone Database". URL: [https://www.iana.org/time-zones](https://www.iana.org/time-zones)
- **[ISO 4217]** International Organization for Standardization, "Codes for the representation of currencies". URL: [https://www.iso.org/iso-4217-currency-codes.html](https://www.iso.org/iso-4217-currency-codes.html)
- **[Markdown]** Gruber, J., "Markdown Syntax Documentation". URL: [https://daringfireball.net/projects/markdown/syntax](https://daringfireball.net/projects/markdown/syntax)
- **[Sitemap]** "Sitemaps XML Format". URL: [https://www.sitemaps.org/protocol.html](https://www.sitemaps.org/protocol.html)

[A2A-SPEC]: https://a2a-protocol.org/latest/specification/
[RFC 2119]: https://www.rfc-editor.org/info/rfc2119
[RFC 6585]: https://tools.ietf.org/html/rfc6585
[RFC 8141]: https://www.rfc-editor.org/info/rfc8141
[RFC 9309]: https://www.rfc-editor.org/info/rfc9309
[IETF BCP 47]: https://www.rfc-editor.org/info/bcp47
[IANA Time Zone Database]: https://www.iana.org/time-zones
[ISO 4217]: https://www.iso.org/iso-4217-currency-codes.html
[Markdown]: https://daringfireball.net/projects/markdown/syntax
[Sitemap]: https://www.sitemaps.org/protocol.html
---
hide:
  - navigation
---

# AI Commerce Protocol (AICP) Specifications

**Version**: `draft-01` <br/>
**Date**: `{{YYYY-MM-DD}}`<br/>
**Status**: Editor's Draft<br/>
**Editors:** Cloves Almeida - Boston Consulting Group

**Summary**

This document specifies the AI Commerce Protocol (AICP). AICP defines a set of standardized e-commerce capabilities for AI agents, **profiled as a specialized application of the [Agent2Agent (A2A) Protocol][A2A-SPEC]**. By leveraging A2A's core framework for agent discovery (via Agent Cards), task management, and secure communication, AICP enables personal AI agents (Client Agents in A2A terms) to interact with compliant merchants (Remote Agents in A2A terms) for the *core purchase flow* (search → cart → checkout). This approach fosters interoperability and allows merchants to expose commerce functions as well-defined A2A tasks within the broader A2A ecosystem.

## 1. Introduction  
The AI Commerce Protocol (AICP) provides a standardized interface for personal AI agents to discover merchants and perform e-commerce operations, fostering an open and interoperable ecosystem for AI-driven commerce. To achieve this, AICP leverages the [Agent2Agent (A2A) Protocol][A2A-SPEC] for fundamental agent communication; while initial drafts focus on request-reply operations for core tasks, future versions aim to support more fluid agent interactions. This AICP specification therefore focuses on defining the following e-commerce-specific aspects:

-   A clear set of **standardized e-commerce operations** (e.g., product search, cart management).
-   The **data structures** required for requests and responses related to these operations.
-   Conventions for merchants to **declare their AICP capabilities**.
-   Guidelines for AI agents to **identify and invoke specific AICP operations**.

These definitions initially target core operations for general e-commerce, anticipating that specialized profiles may extend the protocol for specific industry verticals. This overall approach allows AICP to provide a focused solution for e-commerce while benefiting from the interoperability and foundational features of A2A's general [agent communication framework][A2A-SPEC].

### 1.1. Intended Audience
This specification is primarily targeted at:

- Developers building AI Agents that require e-commerce interaction capabilities.
- Developers and engineers representing Merchants who aim to expose their e-commerce services to AI Agents in a standardized manner.
- Architects and designers of e-commerce platforms and AI-driven commerce systems seeking interoperable solutions.

### 1.2. Goals
The AI Commerce Protocol (AICP) is designed to achieve the following primary goals for AI-driven e-commerce:

- **Achieve Broad E-commerce Interoperability:** To enable personal AI agents to seamlessly interact with any AICP-compliant merchant for e-commerce tasks through a common, standardized interface.
- **Define Standardized Commerce Operations:** To provide clear, unambiguous definitions for common e-commerce operations (e.g., product search, cart management), including their required inputs and expected outputs, using a consistent data exchange format.
- **Facilitate Merchant Discovery:** To provide a consistent mechanism for AI agents to discover AICP-compliant merchants and their specific e-commerce capabilities through a standard declaration format.
- **Simplify Commerce Integration for Agents:** To streamline the development of e-commerce functionalities in AI agents by abstracting merchant-specific complexities behind a uniform set of AICP-defined operations.
- **Ensure Secure Transactions:** To promote secure e-commerce interactions by establishing clear guidelines for secure communication and authentication.
- **Foster an Open Commercial Ecosystem:** To cultivate a level playing field and enhance consumer choice by simplifying how AI agents discover and connect with a diverse array of merchants through an open protocol.
- **Support Flexible Extensibility:** To allow merchants to complement standard AICP capabilities by offering additional, clearly declared functionalities alongside the core operations.

### 1.3. Scope
#### 1.3.1. In-scope
The current version of AICP encompasses the following:

-   Definition of how merchants declare their AICP e-commerce capabilities.
-   Requirements for secure authentication and authorization for AICP interactions.
-   Specification of standard AICP e-commerce operations (e.g., product search, inventory query, cart management, checkout, order status, and product retrieval).
-   The method by which AI agents specify the desired AICP operation when initiating a request.
-   Definition of the data structures for requests and responses for each AICP operation.
-   Standardized patterns for reporting success and errors for AICP operations.

#### 1.3.2. Out-of-scope
The current version of AICP explicitly excludes:

-   Definition of the underlying agent-to-agent communication mechanisms. (AICP relies on a general [agent communication framework][A2A-SPEC] for these foundational components.)
-   The internal logic, decision-making processes, or ranking algorithms of Client Agents or merchant Remote Agents.
-   Specifics of merchant back-end data storage, schemas, or internal business logic beyond the defined AICP task interfaces.
-   Detailed integration mechanics with specific payment gateways, focusing instead on the data exchange and hand-off points within the `aicp:checkout` task.
-   Prescriptive guidance on user interface (UI) or user experience (UX) design for Client Agents or merchant systems.

_Note: Comprehensive definitions for payment gateway integrations are considered for inclusion in future AICP versions_

## 2. Conformance
The key words "**MUST**", "**MUST NOT**", "**REQUIRED**", "**SHALL**", "**SHALL NOT**", "**SHOULD**", "**SHOULD NOT**", "**RECOMMENDED**", "**MAY**", and "**OPTIONAL**" in this document are to be interpreted as described in [RFC 2119].

An implementation (Agent or Merchant) is conformant with this specification if it adheres to all **MUST** and **REQUIRED** level requirements.

## 3. Core Concepts
This section defines key terminology used within the AI Commerce Protocol (AICP). AICP builds upon and extends the core concepts outlined in the [Agent2Agent (A2A) Protocol Specification \[A2A-SPEC\]][A2A-SPEC], particularly those in Section 2 ("Core Concepts Summary") of the A2A specification. For clarity within AICP:

-   The term **Client Agent** as used in this document corresponds to the **A2A Client** role defined in the [A2A-SPEC].
-   The term **Merchant Agent** as used in this document corresponds to the **A2A Server (Remote Agent)** role defined in the [A2A-SPEC].

### 3.1. Key AICP Terminology
-   **Client Agent (or Personal AI Agent)**: A personal AI assistant (e.g., ChatGPT, Copilot, Claude), acting on behalf of an end-user, that initiates AICP operations by interacting with a Merchant Agent.
-   **Agent Provider**: An organization or entity that develops, hosts, or otherwise makes a Client Agent (or Personal AI Agent) available to end-users.
-   **Crawler (or Indexer Bot)**: An automated software agent that systematically browses websites and AICP discovery mechanisms (such as DNS TXT records, HTML link tags, and A2A Agent Cards) to find and index AICP Merchant Agents and their declared capabilities (AICP Skills and product identifiers). The purpose of such indexing is typically to build databases that can be used by Client Agents or other services to discover merchants or product information.
-   **Merchant Agent**: A Merchant's system that exposes AICP e-commerce capabilities. It processes AICP Skill invocations and publishes a Capabilities Manifest.
-   **AICP Skill**: A specific, standardized e-commerce capability defined by this AICP specification (e.g., `aicp:product_search`, `aicp:cart_manage`). AICP Skills are identified by unique skill IDs and are declared by Merchant Agents in their Capabilities Manifest. These correspond to A2A "skills" or "task intents" within the A2A framework.
-   **Capabilities Manifest**: A structured, machine-readable document published by a Merchant Agent, which **is an A2A Agent Card** as defined in Section 5.5 of the [A2A-SPEC]. It describes the Merchant Agent's identity, the AICP Skills it supports, the service endpoint URL for these skills, and required authentication mechanisms.
-   **URN (Uniform Resource Name)**: A persistent, location-independent identifier, as defined in [RFC 8141]. AICP uses URNs to identify products.

*(Note: AICP leverages the standard A2A `Task.contextId` field, generated by the Merchant Agent, for linking related interactions and potentially for associating user personalization context. AICP does not define its own separate user context identifier.)*

## 4. Architecture

### 4.1. Discovery of AICP Merchant Agents

AICP Merchant Agents are discovered by Client Agents through their **Capabilities Manifest**, which **is an A2A Agent Card** as defined in Section 5 of the [A2A-SPEC]. This Agent Card **MUST** detail at least the Merchant Agent's identity, its A2A service endpoint URL (`url` field), the AICP Skills it supports (`skills` field), and its authentication requirements.

AICP supports two deployment models:

*   A Merchant Agent **MAY** expose AICP Skills as part of a larger, consolidated A2A service endpoint (an "A2A Gateway") that handles multiple types of A2A tasks for a domain. In this model, AICP Skills are distinguished by their `aicp:` prefixed `id`s within a shared Agent Card.
*   Alternatively, an AICP Merchant Agent **MAY** operate as a standalone A2A service with its own dedicated Agent Card and A2A service endpoint, focused solely on AICP Skills.

To ensure robust discovery, Crawlers indexing Merchant Agents and Client Agents seeking an AICP Merchant Agent for a given `{merchant-domain}` **SHOULD** attempt to locate its A2A Agent Card. The first successfully retrieved and validated A2A Agent Card that declares AICP skills (as per [Section 4.1.4](#414-aicp-requirements-for-the-agent-card)) **SHOULD** be used, according to the following resolution order:

1.  **AICP DNS TXT Record for Manifest URL (RECOMMENDED for specific AICP endpoint discovery):**
    Client Agents **SHOULD** first query for a DNS TXT record at the hostname `_aicp.{merchant-domain}`. This method allows merchants to directly specify the URL (potentially including a subpath) of the A2A Agent Card most relevant for AICP interactions.
2.  **AICP HTML Link Tag Discovery (OPTIONAL):**
    If interacting with an HTML page from the `{merchant-domain}` (e.g., a homepage or product page), Client Agents **MAY** parse the HTML for a `<link rel="aicp-agent-card" href="...">` tag to find the A2A Agent Card.
3.  **General A2A Well-Known URI (OPTIONAL):**
    As a general A2A discovery mechanism or fallback, Client Agents **MAY** attempt to locate a Merchant Agent's Agent Card via the standard A2A well-known URI: `https://{merchant-domain}/.well-known/agent.json` (as defined in Section 5.3 of the [A2A-SPEC]).

#### 4.1.1. AICP DNS TXT Record for Manifest URL

*   Merchant Agents choosing to use this discovery method **MUST** publish a DNS TXT record at the hostname `_aicp.{merchant-domain}`.
*   This TXT record **MUST** contain a single string value that is the absolute HTTPS URL of the Merchant Agent's A2A Agent Card (e.g., `"https://example.com/store/.well-known/agent.json"`). Key-value formats (like `aicp-agent-card-url=...`) **SHOULD NOT** be used for this specific TXT record; the value itself **MUST** be the URL.
*   Merchants **SHOULD NOT** publish multiple TXT records at the `_aicp.{merchant-domain}` hostname for AICP discovery. If multiple records are present, Client Agents and Crawlers **MAY** process only the first one retrieved that contains a valid HTTPS URL.
*   Client Agents and Crawlers **MAY** query for this TXT record. If found and valid, they would then fetch the A2A Agent Card from the extracted URL.

#### 4.1.2. AICP HTML Link Tag Discovery

*   If a Client Agent or Crawler interacts with an HTML page on the `{merchant-domain}` and has not yet discovered an Agent Card via prior methods, it **MAY** parse the HTML for a `<link>` tag to discover the location of an AICP-relevant A2A Agent Card.
*   The link tag **SHOULD** be: `<link rel="aicp-agent-card" href="<URL_to_Agent_Card>">`.
    *   The `href` attribute **MUST** be an absolute HTTPS URL or a root-relative path pointing directly to a valid A2A Agent Card (e.g., `https://example.com/store/.well-known/agent.json` or `/custom-path/agent.json`).
*   Client Agents finding this link **SHOULD** then fetch the A2A Agent Card from the specified `href`.

#### 4.1.3. General A2A Discovery: Well-Known URI

*   As a general A2A discovery mechanism or fallback, Client Agents **MAY** attempt to locate a Merchant Agent's Agent Card via the standard A2A well-known URI: `https://{merchant-domain}/.well-known/agent.json` (as defined in Section 5.3 of the [A2A-SPEC]).
*   For AICP, any A2A Agent Card retrieved via this method (or any other) **MUST** still declare AICP Skills as specified in [Section 4.1.4](#414-aicp-requirements-for-the-agent-card) to be considered an AICP-compliant endpoint.
*   Per current [A2A-SPEC], it's not possible to use a single Agent Card to specify multiple JSON-RPC endpoints, thus both AICP and non-AICP skills, if they exist, must be supported in the declared endpoint.

#### 4.1.4. AICP Requirements for the Agent Card

The Capabilities Manifest for an AICP Merchant Agent, which is an A2A Agent Card, **MUST** adhere to the structure and requirements outlined in Section 5.5 of the [A2A-SPEC]. In addition, for AICP conformance:

-   It **MUST** declare supported AICP Skills within the `capabilities.skills` array. Each declared AICP Skill **MUST** have an `id` field prefixed with `aicp:` (e.g., `"id": "aicp:product_get"`).
-   It **MUST** accurately declare all necessary authentication requirements (particularly `securitySchemes` and `security` fields) to enable Client Agents to interact with the declared AICP Skills.
-   It **MAY** declare non-AICP skills; Client Agents processing AICP interactions **SHOULD** ignore skills with `id`s not prefixed by `aicp:` if they are not programmed to handle them.

#### 4.1.5. Product Discovery from Web Pages

To facilitate a direct transition to an AICP interaction for a specific product found on a merchant's website without extra network roundtrips, and to enable automated systems like web crawlers to accurately identify products, AICP leverages existing SEO practices and **RECOMMENDS** that product details and identifiers be discoverable directly from a Product Description Page (PDP). The discovered identifier can then be used to directly construct or reference a canonical AICP Product URN for use in AICP Skills.

1.  **Schema.org Structured Data (RECOMMENDED Primary Method):**

    *   Merchants **SHOULD** embed comprehensive [Schema.org/Product](https://schema.org/Product) structured data on their product pages. This structured data **MUST** be provided using JSON-LD within a `<script type="application/ld+json">` block.
    *   This structured data **SHOULD** include at least one of the standard unique identifier properties for the product.
    *   Client Agents and Crawlers **SHOULD** prioritize parsing this `schema.org/Product` data to find a suitable identifier. If multiple identifier properties are present (e.g., `productID`, `sku`, `gtin`, etc.), Client Agents **SHOULD** use the following order of precedence to select the value for constructing the AICP Product URN (e.g., `urn:Product:<property>:<value>`):
        1.  `productID`
        2.  `identifier` (if distinct from `productID` and more specific)
        3.  `sku`
        4.  `gtin14`
        5.  `gtin13`
        6.  `gtin12`
        7.  `gtin8`
        8.  `gtin` (if a more specific `gtin<length>` is not available)
        9.  `asin`
        10. `mpn`
    *   To minimize ambiguity, it is **STRONGLY RECOMMENDED** that merchants ensure their `schema.org/Product` structured data includes a `productID` property with a stable, unique, and directly usable value.
    *   If a suitable identifier value is found, the Client Agent **MAY** construct an AICP Product URN using the corresponding `schema.org` property name as the URN `<property>` (e.g., `urn:Product:sku:<value>`, `urn:Product:productID:<value>`).

2.  **AICP Product ID Link Tag (OPTIONAL Fallback / Explicit Declaration):**

    *   As a fallback, or for merchants wishing to explicitly declare a specific canonical identifier for AICP use (which might differ from or clarify identifiers in Schema.org), Merchants **MAY** embed a `<link>` tag in the `<head>` of their product pages.
    *   The link tag **MUST** be: `<link rel="aicp-product-id" href="<product_identifier_string>">`.
    *   The `href` attribute **MAY** contain:
        *   A full AICP Product URN: Following the format `urn:Product:<property>:<value>`, where `<property>` **SHOULD** be one of the standard unique identifier property names defined for [`Product` in Schema.org](https://schema.org/Product) (e.g., `sku`, `gtin`, `productID`, `identifier`) and `<value>` is the product's corresponding ID.
        *   A non-URN prefixed string: If the `href` value is not a URN, Client Agents **SHOULD** interpret this string as the `<value>` part of an implicit `urn:Product:productID:<value>` URN.
    *   Example: `<link rel="aicp-product-id" href="urn:Product:sku:XYZ789">` or `<link rel="aicp-product-id" href="PROD456">`.
    *   If both Schema.org data and an `aicp-product-id` link tag are present, Client Agents **MAY** prioritize the identifier from the `aicp-product-id` link tag as it represents a more explicit declaration for AICP purposes.

Regardless of how a product identifier string or URN is obtained from a web page, Merchant Agents providing the `aicp:product_get` AICP Skill (and other skills accepting a product identifier) **MUST** be prepared to accept this identifier. If the identifier is not already in the canonical AICP Product URN format used internally by the Merchant Agent, the Merchant Agent **SHOULD** attempt to normalize it to its canonical URN.

### 4.2. Interaction Model: Invoking AICP Skills via A2A Tasks

All interactions between a Client Agent and an AICP Merchant Agent **MUST** be performed by invoking A2A Tasks, as defined in Section 6.1 and Section 7 of [A2A-SPEC]. AICP leverages A2A's JSON-RPC 2.0 based methods for initiating tasks, sending messages, and retrieving results.

#### 4.2.1. Initiating an AICP Skill as an A2A Task

To invoke a specific AICP Skill (e.g., `aicp:product_search`), the Client Agent **MUST** use a standard A2A RPC method that initiates or sends a message for a task, such as `message/send` (Section 7.1 of [A2A-SPEC]) or `message/stream` (Section 7.2 of [A2A-SPEC]) if streaming updates are desired and supported by the Merchant Agent.

The A2A `Message` object (Section 6.4 of [A2A-SPEC]) within the request parameters (e.g., `MessageSendParams.message`) is structured as follows for AICP:

**Skill Invocation Method:**
AICP extends A2A intent mechanism to supports two primary methods for a Client Agent to indicate the desired skill and provide its inputs:

1.  **Direct Skill Invocation (Explicit Intent via `DataPart`):**
    *   This is the **RECOMMENDED** method when the Client Agent has resolved the user's intent to a specific AICP Skill, particularly for programmatic interactions.
        *   This invocation method requires no natural language processing to resolve Client Agent intent.
    *   The `Message.parts` array **SHOULD** contain a single A2A `DataPart`, optionally also providing a `DataPart` for skill `aicp:user_preferences_set`, per Section 4.2.4.
    *   The `metadata` field of this `DataPart` **MUST** contain a `skillId` field, specifying the `id` of the target AICP Skill (e.g., `"aicp:product_search"`).
        *   *Example `DataPart.metadata` for direct invocation:* `{ "skillId": "aicp:product_search" }`
    *   The `data` field of this `DataPart` **MUST** be a JSON object representing the structured input parameters for that AICP Skill, as defined in Section 5 (AICP Skills).

2.  **Text-based Skill Invocation (Inferred Intent via `TextPart`):**
    *   To support more fluid, conversational interactions, an AICP Merchant Agent **MAY** allow Client Agents to submit requests as natural language text, from which the Merchant Agent infers the intended AICP Skill and parameters.
    *   In this model, the `Message.parts` array **SHOULD** contain a single A2A `TextPart` (Section 6.5.1 of [A2A-SPEC]) holding the user's natural language request (e.g., `"find me red running shoes under $100"`).
    *   For this type of invocation, a `DataPart` with an AICP `skillId` in its `metadata` **MAY** be present to hint the Merchant Agent of the primary inferred intent, but it's not mandatory.
    *   The Merchant Agent performs the skill routing by interpreting the content of the `TextPart`.
    *   **Support and Scalability:**
        *   Merchant Agents **MAY** opt-out of supporting text-based invocation for some or all of their AICP skills due to the potential computational costs of natural language processing at scale.
        *   A Merchant Agent signals its support for text-based invocation for a specific skill by including an appropriate MIME type representing natural language (e.g., `text/plain`) in the `inputModes` array for that skill within its `AgentCard.skills` (or in `AgentCard.defaultInputModes` if applicable globally). If `text/plain` (or an equivalent MIME type) is not listed as a supported input mode for a skill, Client Agents **SHOULD** assume text-based invocation for that skill is not supported (see A2A-SPEC Section 5.5.4).
        *   If a Merchant Agent receives an A2A `Message` containing only a `TextPart` intended for AICP skill invocation but does not support or cannot route this text-based request for the intended skill, it **SHOULD** respond with a standard A2A `JSONRPCError` with `code: -32005` (`ContentTypeNotSupportedError`), as defined in Section 8.2 of [A2A-SPEC]. The error's `data` field **MAY** provide additional context.

The interaction methods above are aimed at skill routing - skills are allowed to specify support for natural language text fields in their structured `DataPart` input specifications to augment their interaction.

**Context Continuity (A2A `Message.contextId`):**
*   To enable personalized results or maintain context across a series of interactions with a specific Merchant Agent, Client Agents **SHOULD** capture the `contextId` returned in an A2A `Task` object (see Section 6.1 of [A2A-SPEC]) from that Merchant Agent.
*   For subsequent A2A `Message`s intended to be part of that same context, the Client Agent **SHOULD** send this received `contextId` in the `contextId` field of the `Message` object (see Section 6.4 of [A2A-SPEC]).
*   The establishment of preferences and consent associated with this `contextId` is managed via the `aicp:user_preferences_set` skill (see Section 5.5.1).

*(Note: The capability for bundling multiple skill invocations by having multiple such DataParts in the Message.parts array, each with their own skillId in DataPart.metadata, is a potential future extension and not the primary model for draft-01. For draft-01, one DataPart with one skillId per Message is the standard for direct invocation.)*

**Example A2A Request to initiate `aicp:product_search` (Direct Invocation):**

This conceptual example uses the A2A `message/send` method. It assumes a `contextId` was generated from a previous interaction. Refer to [A2A-SPEC] Section 7.1 for the full `MessageSendParams` structure.

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
            "skillId": "aicp:product_search"
          },
          "data": { 
            "query": "running shoes",
            "limit": 5,
            "filters": {
              "brand": "AICPRunnerPro",
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

#### 4.2.2. Receiving Results and Artifacts

The Merchant Agent (A2A Server) processes the A2A task. The results of the AICP Skill execution **MUST** be returned as A2A `Artifacts` (Section 6.7 of [A2A-SPEC]) within the A2A `Task` object (Section 6.1 of [A2A-SPEC]).

*   For successful AICP Skill invocations that produce data, the A2A `Task` object returned (or streamed via `TaskArtifactUpdateEvent` - Section 7.2.3 of [A2A-SPEC]) **SHOULD** contain at least one `Artifact`.
*   This `Artifact` **MUST** contain a single `DataPart`.
*   The `DataPart.data` field **MUST** be a JSON object representing the result of the AICP Skill, as defined for that skill in Section 5 (AICP Skills).
*   The `Task.status.state` (Section 6.3 of [A2A-SPEC]) will indicate the outcome (e.g., `completed`, `failed`). If `failed`, error details should be provided as described in Section 6 (Error Handling).

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
                { "id": "urn:Product:sku:123", "name": "AICP Runner Pro - Blue", "price": 79.99, "currency": "USD" },
                { "id": "urn:Product:sku:124", "name": "AICP Distance Master - Blue", "price": 99.99, "currency": "USD" }
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

#### 4.2.3. Handling Asynchronous Operations and Streaming

AICP interactions can be synchronous or asynchronous, leveraging A2A's capabilities:

*   For quick operations, a Merchant Agent **MAY** process the task and return the final `Task` object (with state `completed` or `failed` and artifacts) directly in the response to a `message/send` request.
*   For longer-running operations, or if the Client Agent requests it, Merchant Agents supporting streaming (`AgentCard.capabilities.streaming: true`) **SHOULD** use A2A's SSE streaming mechanism via the `message/stream` method. This allows for `TaskStatusUpdateEvent` and `TaskArtifactUpdateEvent`s to be sent as the task progresses.
*   Push notifications, if supported by the Merchant Agent and configured by the Client Agent (via `MessageSendParams.configuration.pushNotificationConfig` or `tasks/pushNotificationConfig/set` as per [A2A-SPEC]), can also be used for asynchronous updates.

AICP itself does not add new streaming or push notification mechanisms beyond what A2A provides. Client Agents and Merchant Agents **MUST** follow the procedures in [A2A-SPEC] for these asynchronous patterns.

#### 4.2.4. User Personalization Context

AICP leverages the standard A2A `Task.contextId` (see Section 6.1 of [A2A-SPEC]) for enabling Merchant Agents to provide personalized experiences and maintain context continuity across multiple interactions with a Client Agent for a specific user. The `contextId` is generated by the Merchant Agent (A2A Server). This feature is aimed at supporting personalization of pre-sign-in interactions such as "guest" product search and product details, avoiding the need for OAuth2 sign-in for many interactions.

**Establishing and Using Personalization Context:**

1.  **Initial Interaction & Context Establishment:**
    *   When a Client Agent first interacts with a Merchant on behalf of a user, it **SHOULD** invoke the `aicp:user_preferences_set` AICP Skill (defined in Section 5.5.1) to set explicit user preferences and provide consent for user data collection. This skill **MAY** be invoked along other AICP skills, e.g., it's possible to send both `aicp:user_preferences_set` and `aicp:product_get` in the same initiating `Message`. In this scenario, `aicp:user_preferences_set` **MUST** be the first skill in the `Message.parts`.
    *   The Merchant Agent, upon processing a successful request, **MUST** generate an A2A `Task.contextId` if one is not already established for this interaction chain or if it deems a new context is appropriate. This `contextId` **MAY** be associated with the user and persisted, subject to consent.
    *   This `Task.contextId` is returned to the Client Agent as part of the standard A2A `Task` object in the response.

2.  **Maintaining Context in Subsequent Interactions:**
    *   The Client Agent **SHOULD** securely store the `contextId` received from a Merchant Agent, on a per-user, per-Merchant Agent basis.
    *   For subsequent A2A `Message`s sent to that same Merchant Agent where personalization or context continuity is desired (e.g., for `aicp:product_search` or `aicp:product_get`), the Client Agent **SHOULD** include this previously received `contextId` in the `contextId` field of the A2A `Message` object (see Section 6.4 of [A2A-SPEC]).
    *   Merchant Agents receiving a `Message` with a recognized `contextId` **SHOULD** use it to retrieve any associated user preferences and apply them to personalize the AICP Skill execution and response.

3.  **Merchant-Controlled `contextId` Lifetime (Refresh):**
    *   A Merchant Agent **MAY** choose to issue a *new* `Task.contextId` in its response to an A2A Task, even if the incoming `Message` contained an existing `contextId`. This can be used, for example, to manage session expiration or context re-keying.
    *   If a Merchant Agent returns a new `Task.contextId`, Client Agents **MUST** update their stored context identifier for that user/merchant to this new `contextId` for future interactions with that specific context.

4.  **Updating and Clearing Preferences:**
    *   Updates to existing preferences associated with a `contextId` **MUST** be done by invoking the `aicp:user_preferences_set` skill, providing the existing `contextId` in the A2A `Message.contextId` field and the new `preferences` (including `userDataConsent`) in the skill's parameters.
    *   Revocation of consent and clearing of preferences associated with a `contextId` **MUST** be done by invoking the `aicp:user_preferences_set` skill providing the relevant `contextId` in `Message.contextId` with `preferences.userDataConsent` set to:
        *   `\"absent\"`: indicating _absence_ of consent, the default if no consent was ever provided for the context.
        *   `\"none\"`: indicating explicit rejection of consent
        

**Interaction with Full OAuth 2.1 Authentication:**

*   If an A2A request is made with a valid OAuth 2.1 Access Token (see Section 8), the identity and authorization from the Access Token take precedence for any privileged actions.
*   If a `contextId` (sent via `Message.contextId`) is also provided, the Merchant Agent **MAY** link the personalization context associated with this `contextId` to the fully authenticated user (identified by the OIDC `sub` claim), provided user consent for such linking was obtained, per Section 7.

**Security and Privacy:**

*   The A2A `Task.contextId`, when used by AICP for linking personalization data, **SHOULD** be treated as sensitive by both Client and Merchant Agents. Its use for personalization is governed by the principles in Section 7 (User Data Privacy and Consent Guidelines).
*   Merchant Agents **SHOULD** strive to generate `contextId`s that are not easily guessable or correlatable with other user identifiers across different systems, especially for users who have not fully authenticated.
*   Client Agents **MUST NOT** send a `contextId` received from one Merchant Agent to a different, unaffiliated Merchant Agent.

## 5. AICP Skills

This section defines the standardized AICP Skills that Merchant Agents can implement and Client Agents can invoke. All AICP Skills are invoked as A2A tasks, as described in Section 4.2 (Interaction Model). For each skill, this section will specify its unique `skillId` and purpose. Detailed definitions of input parameters, result artifact structures, and specific error conditions for each skill will be elaborated in future revisions of this specification or in accompanying documents.

Client Agents **MUST** specify the target AICP Skill by including `{\"skillId\": \"<full_skill_id>\"}` in the `metadata` field of the A2A `Message` object.

### 5.1. Product Discovery and Information Skills

#### 5.1.1. `aicp:product_search`
*   **Skill ID:** `aicp:product_search`
*   **Purpose:** Enables a Client Agent to search for products offered by the Merchant Agent based on a query string and optional filters.
*   **Input Parameters:** *(Placeholder: To be detailed)*
*   **Result Artifact:** *(Placeholder: To be detailed - typically a list of product summaries)*
*   **Specific Error Conditions:** *(Placeholder: To be detailed)*

#### 5.1.2. `aicp:product_get`
*   **Skill ID:** `aicp:product_get`
*   **Purpose:** Allows a Client Agent to retrieve detailed information for one or more specific products, identified by their canonical AICP Product URNs.
*   **Input Parameters:** *(Placeholder: To be detailed - typically one or more Product URNs)*
*   **Result Artifact:** *(Placeholder: To be detailed - typically detailed product information for each URN)*
*   **Specific Error Conditions:** *(Placeholder: To be detailed, e.g., product_not_found)*

### 5.2. Inventory Skills

#### 5.2.1. `aicp:inventory_query`
*   **Skill ID:** `aicp:inventory_query`
*   **Purpose:** Allows a Client Agent to get focused availability and stock information for specific product URNs (and potentially their variants).
*   **Input Parameters:** *(Placeholder: To be detailed - typically one or more Product URNs and variant identifiers)*
*   **Result Artifact:** *(Placeholder: To be detailed - typically availability status and quantities)*
*   **Specific Error Conditions:** *(Placeholder: To be detailed)*

### 5.3. Cart Management Skills

#### 5.3.1. `aicp:cart_manage`
*   **Skill ID:** `aicp:cart_manage`
*   **Purpose:** Enables a Client Agent to manage a user's shopping cart, including viewing the cart, adding items, updating quantities, and removing items. This skill will require a sub-action parameter to specify the desired cart operation.
*   **Input Parameters:** *(Placeholder: To be detailed - including sub-action (view, add, update, remove, clear), item identifiers, quantities, variant specifics)*
*   **Result Artifact:** *(Placeholder: To be detailed - typically the updated cart state)*
*   **Specific Error Conditions:** *(Placeholder: To be detailed, e.g., item_not_available, invalid_item_id)*

### 5.4. Checkout and Order Management Skills

#### 5.4.1. `aicp:checkout`
*   **Skill ID:** `aicp:checkout`
*   **Purpose:** Initiates the checkout process for the current cart's contents. For `draft-01`, this involves preparing the order and providing information for hand-off to the merchant's payment system.
*   **Input Parameters:** *(Placeholder: To be detailed - potentially a cart identifier or session context)*
*   **Result Artifact:** *(Placeholder: To be detailed - typically an order ID and a redirect URL or instructions for payment hand-off)*
*   **Specific Error Conditions:** *(Placeholder: To be detailed, e.g., cart_empty, checkout_preconditions_not_met)*

#### 5.4.2. `aicp:order_status`
*   **Skill ID:** `aicp:order_status`
*   **Purpose:** Allows a Client Agent to retrieve the current status of a previously placed order.
*   **Input Parameters:** *(Placeholder: To be detailed - typically an order ID)*
*   **Result Artifact:** *(Placeholder: To be detailed - order status, shipping information, estimated delivery)*
*   **Specific Error Conditions:** *(Placeholder: To be detailed, e.g., order_not_found)*

### 5.5. User Context and Preference Skills

This group of skills allows Client Agents to manage user-consented preferences and personalization context with a Merchant Agent, primarily related to the A2A `Task.contextId` mechanism defined in Section 4.2.4.

#### 5.5.1. `aicp:user_preferences_set`
*   **Skill ID:** `aicp:user_preferences_set`
*   **Purpose:** Allows a Client Agent to establish or update user-consented preferences with a Merchant Agent. These preferences are associated by the Merchant Agent with the A2A `Task.contextId` that is returned upon successful establishment, or linked to an existing `contextId` if one is provided by the Client Agent in the `Message.contextId` field for an update. This skill is also used to revoke consent for storing preferences.
*   **Input Parameters:** *(Placeholder: To be detailed - will include a `preferences` object which contains a `userDataConsent` flag. For updates/revocations, the Client Agent sends the relevant `Message.contextId`.)*
*   **Result Artifact:** *(Placeholder: To be detailed - typically an acknowledgment. If establishing a new context, the A2A `Task` object in the response will contain the new `contextId`.)*
*   **Specific Error Conditions:** *(Placeholder: To be detailed, e.g., AICP_USER_CONSENT_REQUIRED, AICP_INVALID_PREFERENCES_FORMAT, AICP_INVALID_CONTEXT_ID_FOR_UPDATE)*

## 6. Error Handling

When an AICP Skill invocation results in an error, the A2A Task processing the skill **MUST** indicate this failure through the standard A2A mechanisms, primarily by setting the `Task.status.state` to `\"failed\"` (see Section 6.3 of [A2A-SPEC]).

Further details about the AICP-specific error **MUST** be provided within the `Task.status.message` field (which is an A2A `Message` object, as per Section 6.4 of [A2A-SPEC]). This message **SHOULD** contain a single A2A `DataPart` (Section 6.5.3 of [A2A-SPEC]) structured as follows:

```json
{
  "aicpErrorCode": "string", 
  "description": "string",   
  "details": {}            
}
```

*   **`aicpErrorCode` (string, REQUIRED):** A namespaced, uppercase string identifying the specific AICP error (e.g., `AICP_PRODUCT_NOT_FOUND`, `AICP_ITEM_OUT_OF_STOCK`).
*   **`description` (string, REQUIRED):** A human-readable message explaining the error, suitable for display to a developer or potentially an end-user.
*   **`details` (object, OPTIONAL):** A JSON object providing additional, structured context about the error. The content of this object may vary depending on the `aicpErrorCode`.

Client Agents **SHOULD** inspect the `Task.status.state` first. If it is `\"failed\"`, they **SHOULD** then parse the `Task.status.message.parts[0].data` to retrieve the AICP-specific error information.

This section will later enumerate common `aicpErrorCode` values and their meanings. Standard A2A-level errors (e.g., related to task processing itself, malformed requests to the A2A endpoint) are handled as defined in Section 8 of [A2A-SPEC].

*(Placeholder: Common AICP Error Codes and Meanings to be defined here, e.g.):*
*   `AICP_PRODUCT_NOT_FOUND`
*   `AICP_INVALID_PRODUCT_URN`
*   `AICP_ITEM_OUT_OF_STOCK`
*   `AICP_CART_OPERATION_FAILED`
*   `AICP_CHECKOUT_FAILED`
*   `AICP_ORDER_NOT_FOUND`
*   `AICP_USER_CONSENT_REQUIRED`
*   `AICP_INVALID_USER_CONTEXT_TOKEN`
*   `AICP_AUTHENTICATION_REQUIRED` 
*   `AICP_AUTHORIZATION_DENIED` 
*   `AICP_INVALID_PARAMETERS` 
*   `AICP_RATE_LIMIT_EXCEEDED`

## 7. User Data Privacy and Consent Guidelines

In this section we define standard user data handling policies. Those policies are presented to the user by Client Agents, and obtained consent is forwarded to Merchant Agents. The goal of standard policies is to streamline user consent experience across the different channels, when interacting with multiple Client Agents and with multiple Merchants. 

Client Agents are free to implement consent grants workflows as long as they adhere to the principles in this section. Once obtained, consent **SHOULD** be granted by invoking the `aicp:user_preferences_set` with `{\"userDataConsent\": <value>, ...}` in the payload - the value **MUST** be one of the standard policies defined in Section 7.2, or `absent` or `none` keywords as defined in Section 4.2.4.

A Merchant Agent **SHOULD NOT** reject a standard policy (NOT RECOMMENDED) when presented with granted consent via `userDataConsent`. If the Merchant Agent chooses to reject a policy  they **MAY** proceed with a non-personalized consent request for a custom policy. When presented with a custom policy request, the Client Agent **MAY** choose to ignore the request and not present them to the user, re-issuing the request anonymously, or **MAY** choose to stop the interaction with the Merchant Agent.

_Note: This section and following policy text are drafts and pending review by legal professionals._

### 7.1. Principles

We define principles to apply to all user data processed for personalization, including explicit user preferences, inferred behavioral data, and any identifiers used to link context across interactions. Client Agents and Merchant Agents **MUST** also comply with all applicable data privacy laws.


-   **Transparency:** Users **MUST** be clearly informed about what data is collected for personalization, how it is used, and with whom it is shared.
-   **User Control & Consent:** Personalization data **MUST** only be collected, stored, or used with the user's explicit, informed, and voluntary consent. Users **MUST** have accessible ways to review, modify, or withdraw their consent at any time.
-   **Purpose Limitation:** Data collected for personalization **MUST** only be used for the specific, consented purpose. Any other use **MUST** have new, explicit consent.
-   **Data Minimization:** Only the minimum data necessary for the stated personalization purpose **SHOULD** be collected and processed.
-   **Security:** All parties **MUST** apply strong security measures to protect user data from unauthorized access, disclosure, or misuse.
-   **Accountability:** All parties are responsible for complying with these guidelines and applicable privacy laws, and **SHOULD** maintain appropriate records of consent and data handling.

### 7.2. User Data for Personalization Policies

In this section we define the standard policies Client Agents **SHOULD** present to users and **SHOULD** be accepted by Merchant Agents.

#### 7.2.1 Policy: `all`

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

## 8. Security Considerations

Security is fundamental to the trust and reliability of AICP interactions. This section outlines key security considerations. Implementers **MUST** also adhere to general web security best practices.

### 8.1. Authentication

AICP's authentication model is built upon the mechanisms defined in the [Agent2Agent (A2A) Protocol Specification][A2A-SPEC] (see Section 4 of [A2A-SPEC]). Key principles include:

*   **Transport Security:** All AICP communication **MUST** occur over HTTPS.
*   **Declared Schemes:** Merchant Agents **MUST** declare their supported authentication schemes in their A2A Agent Card (specifically in the `securitySchemes` and `security` fields, as per A2A-SPEC Section 5.5 and AICP Section 4.1.4). AICP **RECOMMENDS** the use of OpenID Connect (OIDC) as the primary authentication scheme.
*   **Client Authentication:** For skills requiring authentication, Client Agents **MUST** include appropriate credentials (e.g., a valid Bearer token in `Authorization` header, a valid key in `X-API-Key`) with their requests, as per the merchant's declared schemes. Merchant Agents **MUST** authenticate these requests.

#### 8.1.1. Publicly Accessible Skills

While many AICP skills involve sensitive operations or user data and thus require robust authentication, certain skills may be designed for public, non-authenticated access (e.g., general product searches, retrieving publicly available store information).

To accommodate this, AICP defines the following convention:

*   An AICP Skill **MAY** be designated as publicly accessible if it includes the tag `auth:public` within the `tags` array of its `AgentSkill` object definition in the Merchant Agent's A2A Agent Card. (The `AgentSkill` object and its `tags` array are defined in Section 5.5.4 of [A2A-SPEC]).
*   Merchant Agents **SHOULD** accept and process requests invoking an AICP Skill tagged `auth:public` without requiring an `Authorization` header or other forms of client authentication.
*   If an AICP Skill is **NOT** tagged with `auth:public`, or if the tag is absent, it **MUST** require authentication. In such cases, Merchant Agents **MUST** enforce the authentication requirements declared in their A2A Agent Card, as per standard A2A protocol behavior (see Section 4 of [A2A-SPEC]), and **MUST** reject unauthenticated or improperly authenticated requests accordingly.
*   Client Agents, before attempting an unauthenticated request to an AICP Skill, **SHOULD** inspect the skill's definition in the Merchant Agent's Agent Card to check for the presence of the `auth:public` tag.

Even for skills marked `auth:public`, Merchant Agents **SHOULD** implement appropriate measures to protect against abuse, such as rate limiting and traffic analysis.

#### 8.1.2. Rate Limiting and Abuse Protection

To ensure service stability and fair usage, and to protect against denial-of-service attacks or misbehaving clients (including overly aggressive crawlers), Merchant Agents **SHOULD** implement robust rate limiting on their AICP API endpoints.

*   Rate limits may be based on various factors, including but not limited to: source IP address, authenticated Client Agent identity (if applicable), specific skill invocation frequency, or overall request volume.
*   When a request is denied due to rate limiting, the Merchant Agent **SHOULD** respond with an HTTP `429 Too Many Requests` status code.
    *   The response **MAY** include a body to provide more detailed, machine-readable context about the rate limit. This information can be particularly useful for Client Agents and their underlying language models to understand the reason and adapt behavior. If a body is provided, it is **RECOMMENDED** to use a JSON object structure consistent with the AICP error reporting format (see Section 6), for example:
        ```json
        {
          "aicpErrorCode": "AICP_RATE_LIMIT_EXCEEDED", // Or a more specific merchant-defined code like "AICP_HOURLY_QUOTA_EXCEEDED"
          "description": "The request has been rate-limited. Please reduce request frequency or try again after the specified period.", // More descriptive
          "details": { // Structured details aimed at automated parsing or LLM interpretation, all fields are optional.
            "skillId": "aicp:product_search",
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

### 8.2. Authorization
*(Placeholder: Details on authorization policies once a client is authenticated will be added here. This will cover how Merchant Agents determine if an authenticated client has permission to invoke a specific skill or access certain resources.)*

### 8.3. Data Validation and Input Sanitization
*(Placeholder: Guidelines for validating and sanitizing data in requests and responses to prevent common vulnerabilities like injection attacks will be added here.)*

### 8.4. Protection Against Common Web Vulnerabilities
*(Placeholder: Recommendations for protecting against common web vulnerabilities (e.g., XSS, CSRF if applicable in any supporting web interfaces) will be added here.)*

## 9. Extensibility

AICP is designed to be extensible, allowing Merchant Agents to offer capabilities beyond the core skills defined in this specification and to augment standard skills with additional optional information. This extensibility must be approached in a way that maintains baseline interoperability.

The AICP standard itself is an evolving effort. While this document defines foundational e-commerce interactions, further development and refinement are ongoing.

### 9.1. Modes of Extensibility

AICP can be extended in several ways:

*   **Merchant-Specific Custom Skills:** As detailed below, individual Merchant Agents can offer custom skills beyond the standard set.
*   **Optional Extensions to Standard Skills:** Merchants can add optional parameters or fields to standard skills.
*   **AICP Profiles for Verticals:** It is anticipated that specialized "profiles" of AICP may be developed in the future to cater to the unique needs of specific industry verticals (e.g., travel and tourism, food delivery, financial services). These profiles would build upon the core AICP specification, adding skills or refining data structures relevant to that vertical.
*   **Evolution of the Core Specification:** The core AICP specification will evolve over time to incorporate new generally applicable e-commerce capabilities.

### 9.2. Declaring Additional Custom Skills

Merchant Agents **MAY** expose additional, custom AICP Skills or other A2A tasks not defined in this core specification by declaring them in their A2A Agent Card (within the `skills` array, as per A2A-SPEC Section 5.5.4).

*   **Client Agent Behavior:** Client Agents encountering unknown skill IDs in an Agent Card **MAY** ignore them if they are not programmed to handle them.
*   **Merchant Agent Responsibilities for Custom Skills:** For effective discovery and utilization of custom skills, Merchant Agents **SHOULD**:
    1.  Provide clear and comprehensive documentation for these custom skills. This documentation **SHOULD** be accessible, for instance, via the `documentationUrl` field in their `AgentCard` or provided in the skill's `description` field.
    2.  Understand that the adoption and successful use of complex or highly specialized custom skills may require direct engagement or communication with Client Agent developers or providers.
*   **Scope in `draft-01`:** This version of AICP primarily focuses on standardizing core e-commerce operations. The mechanisms for broad, automated discovery and negotiation of purely custom skills beyond their declaration in the Agent Card are considered out of scope for this version and may rely on bilateral agreements or future community-developed conventions.

### 9.3. Extending Standard AICP Skills

Merchant Agents **MAY** extend standard AICP Skills by including additional **OPTIONAL** parameters in their input data structures or by providing additional **OPTIONAL** fields in their result artifact data structures.

*   **Client Agent Handling of Extensions:** Conforming Client Agents **SHOULD** gracefully handle the absence or presence of such optional extensions when interacting with different Merchant Agents. Client Agents **SHOULD NOT** expect non-standard optional fields or parameters to be present and **MUST NOT** fail if they are absent.
*   **Facilitating Adoption of Extensions:** The adoption of such optional extensions by Client Agent developers often depends on their perceived value, ease of implementation, and the clarity of documentation provided by the Merchant Agent.

### 9.4. Maintaining Core Interoperability

To ensure baseline interoperability:

*   Merchant Agents **MUST NOT** alter the fundamental behavior or semantics of the standard AICP Skills defined in this specification.
*   Merchant Agents **MUST NOT** remove or change the meaning of **REQUIRED** fields or parameters from the standard definitions of AICP Skills.
*   All extensions to standard skills **MUST** be additive and optional.

### 9.5. Contributing to AICP Standardization

Organizations interested in contributing to the AICP standard, particularly by proposing extensions for general use cases or developing new profiles for specific verticals, are encouraged to reach out to the specification editors or participate in the designated community forums (details for which will be provided as the governance model for AICP is formalized).

## 10. Future Work
*(Placeholder for extensions, payment flows, advanced features, and skill versioning strategies.)*

## 11. References
- **[A2A-SPEC]** Google, "Agent2Agent (A2A) Protocol Specification", Version 0.2.1 (or latest). URL: [https://google.github.io/A2A/specification/](https://google.github.io/A2A/specification/)
- **[RFC 2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997.
- **[RFC 8141]** Saint-Andre, P. and J. Klensin, "Uniform Resource Names (URNs)", RFC 8141, DOI 10.17487/RFC8141, April 2017. URL: [https://tools.ietf.org/html/rfc8141](https://tools.ietf.org/html/rfc8141)
- **[RFC 6585]** Nottingham, M., and R. Fielding, "Additional HTTP Status Codes", RFC 6585, DOI 10.17487/RFC6585, April 2012. URL: [https://tools.ietf.org/html/rfc6585](https://tools.ietf.org/html/rfc6585)
- **[IETF BCP 47]** Phillips, A., Ed., and M. Davis, Ed., "Tags for Identifying Languages", BCP 47, RFC 5646, September 2009. URL: [https://tools.ietf.org/html/bcp47](https://tools.ietf.org/html/bcp47)
- **[IANA Time Zone Database]** Internet Assigned Numbers Authority, "Time Zone Database". URL: [https://www.iana.org/time-zones](https://www.iana.org/time-zones)
- **[ISO 4217]** International Organization for Standardization, "Codes for the representation of currencies". URL: [https://www.iso.org/iso-4217-currency-codes.html](https://www.iso.org/iso-4217-currency-codes.html)

[A2A-SPEC]: https://google-a2a.github.io/A2A/specification/
[RFC 2119]: https://www.rfc-editor.org/info/rfc2119
[RFC 8141]: https://www.rfc-editor.org/info/rfc8141
[RFC 6585]: https://tools.ietf.org/html/rfc6585
[IETF BCP 47]: https://www.rfc-editor.org/info/bcp47
[IANA Time Zone Database]: https://www.iana.org/time-zones
[ISO 4217]: https://www.iso.org/iso-4217-currency-codes.html
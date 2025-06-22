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
The AI Commerce Protocol (AICP) provides a standardized interface for personal AI agents to discover merchants and perform e-commerce operations, fostering an open and interoperable ecosystem for AI-driven commerce. To achieve this, AICP leverages the capabilities of the underlying [Agent2Agent (A2A) Protocol][A2A-SPEC] for fundamental agent communication. This AICP specification then focuses on defining the e-commerce-specific aspects:

-   A clear set of **standardized e-commerce operations** (e.g., product search, cart management).
-   The **data structures** required for requests and responses related to these operations.
-   Conventions for merchants to **declare their AICP capabilities**.
-   Guidelines for AI agents to **identify and invoke specific AICP operations**.

This approach allows AICP to provide a focused solution for e-commerce while benefiting from the interoperability and foundational features of A2A's general [agent communication framework][A2A-SPEC].

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
#### 1.3.1. In-scope (draft-01)
The `draft-01` version of AICP encompasses the following:

-   Definition of how merchants declare their AICP e-commerce capabilities.
-   Requirements for secure authentication and authorization for AICP interactions.
-   Specification of standard AICP e-commerce operations (e.g., product search, inventory query, cart management, checkout, order status, and product retrieval).
-   The method by which AI agents specify the desired AICP operation when initiating a request.
-   Definition of the data structures for requests and responses for each AICP operation.
-   Standardized patterns for reporting success and errors for AICP operations.

#### 1.3.2. Out-of-scope (draft-01)
The `draft-01` version of AICP explicitly excludes:

-   Definition of the underlying agent-to-agent communication mechanisms. (AICP relies on a general [agent communication framework][A2A-SPEC] for these foundational components.)
-   The internal logic, decision-making processes, or ranking algorithms of Client Agents or merchant Remote Agents.
-   Specifics of merchant back-end data storage, schemas, or internal business logic beyond the defined AICP task interfaces.
-   Detailed integration mechanics with specific payment gateways, focusing instead on the data exchange and hand-off points within the `aicp:checkout` task.
-   Prescriptive guidance on user interface (UI) or user experience (UX) design for Client Agents or merchant systems.

_Note: Comprehensive definitions for payment gateway integrations are considered for inclusion in future AICP versions, pending successful implementation and validation of the core purchase flow outlined in this document._

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

## 4. Architecture

### 4.1. Discovery of AICP Merchant Agents

AICP Merchant Agents are discovered by Client Agents through their **Capabilities Manifest**, which **is an A2A Agent Card** as defined in Section 5 of the [A2A-SPEC]. This Agent Card **MUST** details at least the Merchant Agent's identity, its A2A service endpoint URL (`url` field), the AICP Skills it supports (`skills` field), and its authentication requirements.

AICP supports two deployment models:

*   A Merchant Agent **MAY** expose AICP Skills as part of a larger, consolidated A2A service endpoint (an "A2A Gateway") that handles multiple types of A2A tasks for a domain. In this model, AICP Skills are distinguished by their `aicp:` prefixed `id`s within a shared Agent Card.
*   Alternatively, an AICP Merchant Agent **MAY** operate as a standalone A2A service with its own dedicated Agent Card and A2A service endpoint, focused solely on AICP Skills.

To ensure robust discovery, Crawlers indexing Merchants Agents and Client Agents seeking an AICP Merchant Agent for a given `{merchant-domain}` **SHOULD** attempt to locate its A2A Agent Card using the following resolution order. The first successfully retrieved and validated A2A Agent Card that declares AICP skills (as per [Section 4.1.4](#414-aicp-requirements-for-the-agent-card)) **SHOULD** be used:

1.  **AICP DNS TXT Record for Manifest URL (RECOMMENDED for specific AICP endpoint discovery):**
    Client Agents **SHOULD** first query for a DNS TXT record at the hostname `_aicp.{merchant-domain}`. This method allows merchants to directly specify the URL (potentially including a subpath) of the A2A Agent Card most relevant for AICP interactions.
2.  **AICP HTML Link Tag Discovery (OPTIONAL):**
    If interacting with an HTML page from the `{merchant-domain}` (e.g., a homepage or product page), Client Agents **MAY** parse the HTML for a `<link rel="aicp-agent-card" href="...">` tag to find the A2A Agent Card.
3.  **General A2A Well-Known URI (OPTIONAL):**
    As a fallback, or for general A2A discovery on the domain, Client Agents **MAY** attempt to `GET https://{merchant-domain}/.well-known/agent.json`.

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
*   Per current [A2A-SPEC], it's not possible to use a single Agent Card to specify multiple JSON-RPC endpoints, thus both AICP and non-AICP skill, if they exist, must be supported in the declared endpoint.

#### 4.1.4. AICP Requirements for the Agent Card

The Capabilities Manifest for an AICP Merchant Agent, which is an A2A Agent Card, **MUST** adhere to the structure and requirements outlined in Section 5.5 of the [A2A-SPEC]. In addition, for AICP conformance:

-   It **MUST** declare supported AICP Skills within the `capabilities.skills` array. Each declared AICP Skill **MUST** have an `id` field prefixed with `aicp:` (e.g., `"id": "aicp:product_get"`).
-   It **MUST** accurately declare all necessary authentication requirements (particularly `securitySchemes` and `security` fields) to enable Client Agents to interact with the declared AICP Skills.
-   It **MAY** declare non-AICP skills; Client Agents processing AICP interactions **SHOULD** ignore skills with `id`s not prefixed by `aicp:` if they are not programmed to handle them.

#### 4.1.5. Product Discovery from Web Pages

To facilitate a direct transition to an AICP interaction for a specific product found on a merchant's website without extra network roundtrips, and to enable automated systems like web crawlers to accurately identify products, AICP leverages existing SEO practices and **RECOMMENDS** that product details and identifiers be discoverable directly from the a Product Description Page (PDP). The discovered identifier can then be used to directly construct or reference a canonical AICP Product URN for use in AICP Skills.

1.  **Schema.org Structured Data (RECOMMENDED Primary Method):**

    *   Merchants **SHOULD** embed comprehensive [Schema.org/Product](https://schema.org/Product) structured data on their product pages. This structured data **MUST** be provided using JSON-LD within a `<script type="application/ld+json">` block.
    *   This structured data **SHOULD** include at least one standard unique identifier properties for the product.
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

The request parameters for these A2A methods (e.g., `MessageSendParams`) **MUST** be structured as follows for AICP:

1.  **Target Skill Identification:**

    *   The Client Agent **MUST** specify the `id` of the target AICP Skill (as declared in the Merchant Agent's Capabilities Manifest, e.g., `"aicp:product_search"`) within the `metadata` field of the A2A `Message` object (Section 6.4 of [A2A-SPEC]).
    *   The key for this metadata field **MUST** be `skillId`.
    *   Example `Message.metadata`: `{ "skillId": "aicp:product_search" }`

3.  **AICP Skill Parameters:**

    *   The input parameters required by the specific AICP Skill **MUST** be provided as a single A2A `DataPart` (Section 6.5.3 of [A2A-SPEC]) within the `parts` array of the A2A `Message` object.
    *   The `DataPart.data` field **MUST** be a JSON object representing the input parameters for the AICP Skill. The specific structure of this JSON object for each AICP Skill is defined in Section 5 (AICP Skills).
    *   The A2A `Message.parts` array for an AICP skill invocation **SHOULD** contain only this single `DataPart` for parameters, unless the specific AICP skill explicitly allows for other `Part` types (e.g., a `FilePart` for image search, though this is not defined in `draft-01`).

4.  **AICP User Context (OPTIONAL):**

    *   To enable personalization, Client Agents **MAY** include a `userContext` object within the `metadata` field of the A2A `Message` object. The structure and handling of this object are detailed in Section 4.2.4.

**Example A2A Request to initiate `aicp:product_search`:**

This conceptual example uses the A2A `message/send` method. Refer to [A2A-SPEC] Section 7.1 for the full `MessageSendParams` structure.

```json
{
  "jsonrpc": "2.0",
  "id": "client-req-001",
  "method": "message/send",
  "params": {
    "message": {
      "role": "user",
      "parts": [
        {
          "kind": "data",
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
      "messageId": "client-msg-001",
      "metadata": {
        "skillId": "aicp:product_search",
        "userContext": { // AICP User Context Example
          "userConsentObtained": "all",
          "preferences": {
            "locale": "en-GB",
            "interests": "Looking for durable trail running shoes suitable for wet conditions."
          }
        }
      }
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
      // No aicpUserContextToken is returned by the merchant in the client-issued token model.
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

#### 4.2.4. AICP User Context for Personalization

To enable a degree of personalization and continuity of experience based on user-consented preferences, AICP defines an optional `userContext` object that Client Agents **MAY** include in the `metadata` field of an A2A `Message` sent to a Merchant Agent.

**Structure of `userContext`:**
```json
{
  "token": "string, OPTIONAL",
  "userConsentObtained": "string, OPTIONAL",
  "preferences": {
    "locale": "string, OPTIONAL",
    "zoneinfo": "string, OPTIONAL",
    "currency": "string, OPTIONAL",
    "interests": "string, OPTIONAL"
  }
}
```
-   **`token` (string, OPTIONAL):** An opaque, unique identifier generated by the Client Agent (or its Agent Provider).
    -   This token **MUST** be generated in a **pairwise** manner, meaning a different, unique token **MUST** be used by the Client Agent for each unique combination of end-user and Merchant Agent domain. The same token **MUST NOT** be sent by a Client Agent to different, unaffiliated Merchant Agents for the same user.
    -   It serves as a key for the Merchant Agent to potentially store and retrieve consented user preferences. It does not contain claims and is not inherently verifiable by the Merchant Agent beyond its use as a lookup key.
-   **`userConsentObtained` (string, OPTIONAL):** A declaration from the Client Agent regarding user consent for the Merchant Agent to process and store the data within `userContext.preferences` associated with the provided `userContext.token` (or for the current interaction if no token is provided).
    -   For `draft-01`, if this field is present and `preferences` are intended for storage or use with a `token`, its value **MUST** be `"all"`. This signifies that the Client Agent attests to having obtained user consent for the Merchant Agent to store and use all provided fields within the `preferences` object for personalization. The specifics of this consent process are detailed in Section 7 (User Data Privacy and Consent Guidelines).
-   **`preferences` (object, OPTIONAL):** A JSON object containing user preferences.
    -   `locale` (string, OPTIONAL): User's preferred language/region (e.g., "en-US"). **SHOULD** conform to IETF BCP 47.
    -   `zoneinfo` (string, OPTIONAL): User's timezone (e.g., "America/New_York"). **SHOULD** be an IANA Time Zone Database name.
    *   `currency` (string, OPTIONAL): User's preferred currency (e.g., "USD", "EUR"). **SHOULD** be an ISO 4217 code.
    *   `interests` (string, OPTIONAL): A natural language string describing user interests or shopping context (e.g., "Looking for vegan cosmetics"). Merchant Agents **MAY** use NLP to interpret this.

**Merchant Agent Behavior for `userContext`:**

When a Merchant Agent receives an A2A `Message` containing a `userContext` object in its `metadata`, it **SHOULD** process it as follows:

1.  **Case 1: `userContext.token` is NOT present:**
    *   **Condition:** No `token` is provided in the `userContext`.
    *   **Actions:**
        *   If `userContext.preferences` are provided:
            *   The Merchant Agent **MAY** use these `preferences` *only* for personalizing the current, specific AICP Skill request.
            *   These `preferences` **MUST NOT** be persistently stored by the Merchant Agent in a way that links them for future retrieval by the Client Agent, as no client-provided token is available to serve as a key.
            *   The `userConsentObtained` flag, if present, applies only to the transient use of these preferences for the current request.
        *   If no `userContext.preferences` are provided, the request is processed without any `userContext`-based personalization.
        *   No `aicpUserContextToken` (or any token) is returned by the Merchant Agent in relation to this `userContext` processing.

2.  **Case 2: `userContext.token` IS present:**
    *   **Condition:** A `token` is provided in `userContext`.
    *   **Actions:**
        *   **If `userContext.preferences` are *also* provided in the current request:**
            *   The Merchant Agent **MUST** check `userContext.userConsentObtained`.
            *   If `userConsentObtained` is present and equals `"all"`: The Merchant Agent **SHOULD** store or update (PATCH behavior) the provided `preferences` in its own data store, using the client-provided `userContext.token` as the unique key for these preferences.
            *   If `userConsentObtained` is *not* present or not equal to `"all"`: The Merchant Agent **MUST NOT** persistently store or update preferences against this `token`. It **MAY**, however, use the `preferences` from the current request *only* for session-level personalization of the immediate response. An `AICP_USER_CONSENT_REQUIRED` error (see Section 6) **SHOULD** be returned if the skill's primary purpose was to set/update preferences.
        *   **If `userContext.preferences` are NOT provided (but `token` is):**
            *   The Merchant Agent **SHOULD** use the provided `userContext.token` to look up any previously stored preferences associated with this token.
            *   If preferences are found, they **SHOULD** be used to personalize the current AICP Skill request.
            *   If the `token` is "unknown" (i.e., no preferences are stored for it by the merchant), the request is processed without personalization based on stored preferences. The Merchant Agent **SHOULD NOT** return an error solely because the token is unknown in this read-only scenario.
        *   The Merchant Agent **DOES NOT** return this client-issued token.

**Client Agent Responsibilities:**
*   If choosing to use this personalization mechanism, the Client Agent (or its Agent Provider) **MUST** generate and manage `userContext.token` values. Each token **MUST** be pairwise (unique per user, per Merchant Agent domain).
*   Securely store and manage these pairwise `userContext.token`s.
*   Ensure user consent is obtained as per Section 7 before sending `userContext.userConsentObtained: "all"` along with `preferences` intended for storage by the Merchant Agent.
*   Include the `userContext` object (with the appropriate `token`, `preferences`, and `userConsentObtained` flag) in the A2A `Message.metadata` for AICP Skill invocations where personalization or context continuity is desired.

**Relationship with A2A `contextId`:**
The A2A `contextId` (Section 6.1 of [A2A-SPEC]) is for linking related A2A tasks within a session or workflow. The `aicpUserContextToken` (client-issued) is for user-level personalization context with a specific Merchant Agent, potentially across multiple sessions or A2A `contextId`s. Merchant Agents **MAY** internally associate data keyed by an `aicpUserContextToken` with one or more A2A `contextId`s.

**Interaction with Full OAuth 2.1 Authentication:**
If an A2A request is made with a valid OAuth 2.1 Access Token (see Section 8):
*   The identity and authorization from the Access Token take precedence for any privileged actions.
*   If a `userContext.token` (client-issued) is also provided in `Message.metadata`, the Merchant Agent **MAY** link the context associated with this client-issued token to the fully authenticated user (identified by the OIDC `sub` claim from the OAuth flow), provided user consent for such linking was obtained as per Section 7.

The `aicpUserContextToken` (client-issued) is for personalization context only and **MUST NOT** be used by Merchant Agents as a substitute for proper user authentication for accessing protected resources or performing restricted actions. This token **SHOULD** be treated as sensitive by both Client and Merchant Agents.

## 6. Error Handling

When an AICP Skill invocation results in an error, the A2A Task processing the skill **MUST** indicate this failure through the standard A2A mechanisms, primarily by setting the `Task.status.state` to `"failed"` (see Section 6.3 of [A2A-SPEC]).

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

Client Agents **SHOULD** inspect the `Task.status.state` first. If it is `"failed"`, they **SHOULD** then parse the `Task.status.message.parts[0].data` to retrieve the AICP-specific error information.

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

This section outlines the normative guidelines for handling user data related to personalization within AICP. All parties (Client Agents, Agent Providers, Merchant Agents) **MUST** prioritize user privacy, data protection, and transparency when implementing or utilizing AICP personalization features. The purpose of these features is to enhance user experience based on consented information.

### 7.1. Preamble and Purpose

AICP aims to facilitate rich, user-centric e-commerce interactions, which may include personalized experiences. When personalization mechanisms are employed, they are intended to enhance the user's experience by allowing Merchant Agents to tailor offerings and interactions based on user-consented information or context. This section provides a framework for the responsible handling of any such information by all participants in the AICP ecosystem.

All parties implementing or utilizing AICP (Client Agents, Agent Providers, Merchant Agents) **MUST** strive to uphold the highest standards of user privacy, data protection, and transparency.

### 7.2. Scope of these Guidelines

These guidelines apply to all user data processed for personalization via AICP, including:

-   Explicitly provided user information (e.g., preferences shared via `userContext` as per Section 4.2.4).
-   Implicitly derived behavioral data linked to a user context.
-   The lifecycle management of user context identifiers (e.g., `aicpUserContextToken`).
-   Consent mechanisms for the above.

Implementers **MUST** also comply with all applicable data privacy laws. (See [Topic: AICP Privacy Guidance] for further discussion on data types and regulatory considerations).

### 7.3. Core Privacy Principles for AICP

The handling of user data within AICP **MUST** be guided by the following core principles. (See [Topic: AICP Privacy Guidance] for detailed explanations and best practices for each principle):

-   **Transparency:** Users **MUST** be clearly, conspicuously, and in easily understandable language, informed about the collection, use, sharing, and retention of their data for personalization, and the function of any associated identifiers.
-   **User Control & Consent:** Explicit, informed, and freely given user consent **MUST** be obtained by the Client Agent or Agent Provider before sharing user data with a Merchant Agent for persistent personalization linked to an identifier. The `userConsentObtained: "all"` flag (as per Section 4.2.4) is the AICP mechanism for attesting such consent. Users **MUST** have accessible mechanisms to manage their consent and data.
-   **Purpose Limitation:** User data collected for personalization **MUST** only be used by the Merchant Agent for the explicitly consented purpose and **MUST NOT** be used for unrelated purposes without separate consent.
-   **Data Minimization:** Only the minimum user data necessary for the consented personalization purpose **SHOULD** be processed.
-   **Security:** All parties **MUST** implement appropriate security measures to protect user data and associated identifiers.
-   **Accountability:** All parties are accountable for compliance with these guidelines and applicable privacy laws, and **SHOULD** maintain relevant records (e.g., of consent).

### 7.4. Responsibilities of Client Agents and Agent Providers

1.  **Consent Acquisition and Management:**
    -   The Client Agent or its underlying Agent Provider is primarily responsible for the user interface and process for obtaining explicit, informed user consent *before* transmitting any user data (e.g., within a `userContext` object as described in Section 4.2.4) to a Merchant Agent for persistent personalization, and before attesting to this consent via mechanisms like the `userConsentObtained: "all"` flag.
    -   The consent request dialogue presented to the user **SHOULD** be clear, unambiguous, and at a minimum inform the user about:
        -   The Merchant Agent identity and how they'll use shared preference data (locale, interests) for personalization
        -   The merchant's use of `aicpUserContextToken` for maintaining context and potential future linking to authenticated accounts
        -   Available consent management options through their Client Agent or Agent Provider
    -   Consent records **SHOULD** be maintained by the Agent Provider.

2.  **Transparency and User Interface:**
    -   Client Agents **SHOULD** aim to provide ongoing transparency to the user about when their shared data might be influencing personalized interactions.
    -   Agent Providers **SHOULD** offer users a centralized way to manage their personalization consents and any associated context identifiers on a per-Merchant Agent basis.

3.  **Secure Handling of Context Identifiers:**
    -   Client Agents **MUST** securely store any persistent personalization context identifiers (like the `aicpUserContextToken`) received from Merchant Agents, associating them with the specific user and Merchant Agent. These **SHOULD** be treated as sensitive.

4.  **Facilitating User Rights:**
    -   Client Agents/Agent Providers **MUST** provide mechanisms for users to exercise their data subject rights (e.g., access, rectification, erasure) regarding their personalization data held by Merchant Agents as facilitated by AICP.

### 7.5. Responsibilities of Merchant Agents

1.  **Adherence to Consented Purpose:**
    -   Merchant Agents **MUST** strictly limit the use of any user data received or inferred for personalization to the purposes for which user consent was attested (e.g., via the `userConsentObtained` flag when `userContext` is used).
    -   The `aicpUserContextToken` and its associated preference data **MUST NOT** be used to attempt to re-identify an otherwise anonymous user beyond the pseudonymous context it provides, *unless* the user subsequently fully authenticates via an OAuth 2.1 / OIDC flow, and the initial consent (as attested by `userConsentObtained`) covered the potential linking of this context to an authenticated account (see Section 7.6).
    -   Such identifiers **MUST NOT** substitute for proper user authentication for privileged actions.

2.  **Data Security:** Merchant Agents **MUST** implement robust security for all stored user data related to personalization.

3.  **Data Retention, Anonymization, and Deletion:**
    -   Merchant Agents **SHOULD** have clear retention policies for personalization data and associated identifiers. Data **SHOULD NOT** be kept indefinitely and **SHOULD** be deleted/anonymized upon user request (facilitated by the Client Agent) or after reasonable inactivity.
    -   Merchant Agents **MUST** support a mechanism to honor user requests for deletion/revocation of consent, effectively clearing the personalization context.

4.  **No Unauthorized Correlation or Sharing:** User data collected for AICP personalization **MUST NOT** be correlated with data from unaffiliated services or shared with third parties for purposes beyond the consented AICP interaction without separate, explicit user consent.

5.  **Respecting Consent Signals:** Merchant Agents **MUST** respect the consent signals transmitted via AICP mechanisms (like the `userConsentObtained` flag within a `userContext` object as per Section 4.2.4). If adequate consent is not signaled for persistent storage of preferences, such storage **MUST NOT** occur, and no persistent personalization identifier should be issued in that transaction.

### 7.6. Linking Personalization Context with Authenticated User Sessions

Should a user, who previously established a personalization context with a Merchant Agent using an `aicpUserContextToken`, later authenticate with that same Merchant Agent (e.g., via OAuth 2.1 / OIDC as per Section 8), the Merchant Agent **MAY** link the data from this pre-existing context to the user's now authenticated account. This action is permissible **ONLY IF** the initial consent obtained by the Client Agent for establishing the `aicpUserContextToken` unambiguously informed the user about this potential for data linkage.

### 7.7. Policy Review and Updates

These User Data Privacy and Consent Guidelines may be updated in future versions of the AICP specification to reflect evolving best practices, new regulatory requirements, or expanded protocol capabilities. Implementers **SHOULD** ensure they remain compliant with the latest version of these guidelines as adopted.

## 8. Security Considerations

## 9. Extensibility
Merchants **MAY** expose additional AICP Skills or other A2A tasks not defined in this core specification by declaring them in their A2A Agent Card. Client Agents encountering unknown skill IDs in an Agent Card **SHOULD** ignore them if they are not programmed to handle them. If a standard AICP Skill is extended by a Merchant Agent with new **OPTIONAL** parameters in its input structure or additional **OPTIONAL** fields in its result artifact, conforming Client Agents **SHOULD** gracefully handle their absence or presence. Client Agents **SHOULD NOT** expect non-standard OPTIONAL fields to be present and **MUST NOT** fail if they are absent. Merchant Agents **MUST NOT** alter the fundamental behavior or remove **REQUIRED** fields from standard AICP Skills.

## 10. Future Work
*(Placeholder for extensions, payment flows, advanced features, and skill versioning strategies.)*

## 11. References
- **[A2A-SPEC]** Google, "Agent2Agent (A2A) Protocol Specification", Version 0.2.1 (or latest). URL: [https://google.github.io/A2A/specification/](https://google.github.io/A2A/specification/)
- **[RFC 2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997.
- **[RFC 8141]** Saint-Andre, P. and J. Klensin, "Uniform Resource Names (URNs)", RFC 8141, DOI 10.17487/RFC8141, April 2017.

[A2A-SPEC]: https://google.github.io/A2A/specification/
[RFC 2119]: https://datatracker.ietf.org/doc/html/rfc2119
[RFC 8141]: https://www.rfc-editor.org/rfc/rfc8141.html

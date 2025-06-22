**AI Commerce Protocol (AICP)**
**Version: draft-01**
**Date: {{YYYY-MM-DD}}**
**Status: Editor's Draft**
**Editors:**
  - Cloves Almeida, Boston Consulting Group

**Abstract**
This document specifies the AI Commerce Protocol (AICP). AICP defines a set of standardized e-commerce capabilities for AI agents, **profiled as a specialized application of the Agent2Agent (A2A) Protocol [A2A-SPEC]**. By leveraging A2A's core framework for agent discovery (via Agent Cards), task management, and secure communication, AICP enables personal AI agents (Client Agents in A2A terms) to interact with compliant merchants (Remote Agents in A2A terms) for the *core purchase flow* (search → cart → checkout). This approach fosters interoperability and allows merchants to expose commerce functions as well-defined A2A tasks within the broader A2A ecosystem.

**(Placeholder: Table of Contents)**

## 1. Introduction  
The AI Commerce Protocol (AICP) provides a standardized interface for personal AI agents to discover merchants and perform e-commerce operations, fostering an open and interoperable ecosystem for AI-driven commerce. To achieve this, AICP leverages the capabilities of the underlying Agent2Agent (A2A) Protocol [A2A-SPEC] for fundamental agent communication. This AICP specification then focuses on defining the e-commerce-specific aspects:
-   A clear set of **standardized e-commerce operations** (e.g., product search, cart management).
-   The **data structures** required for requests and responses related to these operations.
-   Conventions for merchants to **declare their AICP capabilities**.
-   Guidelines for AI agents to **identify and invoke specific AICP operations**.

This approach allows AICP to provide a focused solution for e-commerce while benefiting from the interoperability and foundational features of a A2A's general agent communication framework.

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
-   Definition of the underlying agent-to-agent communication mechanisms. (AICP relies on a general agent communication framework [A2A-SPEC] for these foundational components.)
-   The internal logic, decision-making processes, or ranking algorithms of Client Agents or merchant Remote Agents.
-   Specifics of merchant back-end data storage, schemas, or internal business logic beyond the defined AICP task interfaces.
-   Detailed integration mechanics with specific payment gateways, focusing instead on the data exchange and hand-off points within the `aicp:checkout` task.
-   Prescriptive guidance on user interface (UI) or user experience (UX) design for Client Agents or merchant systems.

_Note: Comprehensive definitions for payment gateway integrations are considered for inclusion in future AICP versions, pending successful implementation and validation of the core purchase flow outlined in this document._

## 2. Conformance
The key words "**MUST**", "**MUST NOT**", "**REQUIRED**", "**SHALL**", "**SHALL NOT**", "**SHOULD**", "**SHOULD NOT**", "**RECOMMENDED**", "**MAY**", and "**OPTIONAL**" in this document are to be interpreted as described in RFC 2119 [RFC2119].

An implementation (Agent or Merchant) is conformant with this specification if it adheres to all **MUST** and **REQUIRED** level requirements.

## 3. Core Concepts
This section defines key terminology used within the AI Commerce Protocol (AICP). AICP builds upon and extends the core concepts outlined in the Agent2Agent (A2A) Protocol Specification [A2A-SPEC], particularly those in Section 2 ("Core Concepts Summary") of the A2A specification. For clarity within AICP:

-   The term **Client Agent** as used in this document corresponds to the **A2A Client** role defined in [A2A-SPEC].
-   The term **Merchant Agent** as used in this document corresponds to the **A2A Server (Remote Agent)** role defined in [A2A-SPEC].

### 3.1. Key AICP Terminology
-   **Client Agent (or Personal AI Agent)**: A personal AI assistant (e.g., ChatGPT, Copilot, Claude), acting on behalf of an end-user, that initiates AICP operations by interacting with a Merchant Agent.
-   **Agent Provider**: An organization or entity that develops, hosts, or otherwise makes a Client Agent (or Personal AI Agent) available to end-users.
-   **Merchant Agent**: A Merchant's system that exposes AICP e-commerce capabilities. It processes AICP Skill invocations and publishes a Capabilities Manifest.
-   **AICP Skill**: A specific, standardized e-commerce capability defined by this AICP specification (e.g., `aicp:product_search`, `aicp:cart_manage`). AICP Skills are identified by unique skill IDs and are declared by Merchant Agents in their Capabilities Manifest. These correspond to A2A "skills" or "task intents" within the A2A framework.
-   **Capabilities Manifest**: A structured, machine-readable document published by a Merchant Agent, which **is an A2A Agent Card** as defined in Section 5 of [A2A-SPEC]. It describes the Merchant Agent's identity, the AICP Skills it supports, the service endpoint URL for these skills, and required authentication mechanisms.
-   **URN (Uniform Resource Name)**: A persistent, location-independent identifier, as defined in [RFC8141]. AICP uses URNs to identify products.

## 4. Architecture

### 4.1. Discovery of AICP Merchant Agents

AICP Merchant Agents are discovered by Client Agents through their **Capabilities Manifest**, which **is an A2A Agent Card** as defined in Section 5 of [A2A-SPEC]. This Agent Card details the Merchant Agent's identity, its A2A service endpoint URL (the `url` field in the Agent Card as per Section 5.5 of [A2A-SPEC]), the AICP Skills it supports (declared as A2A `skills` with `aicp:` prefixed `id`s), and its authentication requirements.

AICP supports flexible deployment models:
*   A Merchant Agent **MAY** expose AICP Skills as part of a larger, consolidated A2A service endpoint (an "A2A Gateway") that handles multiple types of A2A tasks for a domain. In this model, AICP Skills are distinguished by their `aicp:` prefixed `id`s within a shared Agent Card.
*   Alternatively, an AICP Merchant Agent **MAY** operate as a standalone A2A service with its own dedicated Agent Card and A2A service endpoint, focused solely on AICP Skills.

To accommodate these models and ensure robust discovery, Client Agents seeking an AICP Merchant Agent for a given `{merchant-domain}` **SHOULD** attempt to locate its A2A Agent Card using the following resolution order. The first successfully retrieved and validated A2A Agent Card that declares AICP skills (as per Section 4.1.4) **SHOULD** be used:

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

*   If a Client Agent interacts with an HTML page on the `{merchant-domain}` and has not yet discovered an Agent Card via prior methods, it **MAY** parse the HTML for a `<link>` tag to discover the location of an AICP-relevant A2A Agent Card.
*   The link tag **SHOULD** be: `<link rel="aicp-agent-card" href="<URL_to_Agent_Card>">`.
    *   The `href` attribute **MUST** be an absolute HTTPS URL or a root-relative path pointing directly to a valid A2A Agent Card (e.g., `https://example.com/store/.well-known/agent.json` or `/custom-path/agent.json`).
*   Client Agents finding this link **SHOULD** then fetch the A2A Agent Card from the specified `href`.

#### 4.1.3. General A2A Discovery: Well-Known URI

*   As a general A2A discovery mechanism or fallback, Client Agents **MAY** attempt to locate a Merchant Agent's Agent Card via the standard A2A well-known URI: `https://{merchant-domain}/.well-known/agent.json` (as defined in Section 5.3 of [A2A-SPEC]).
*   For AICP, any A2A Agent Card retrieved via this method (or any other) **MUST** still declare AICP Skills as specified in Section 4.1.4 to be considered an AICP-compliant endpoint.

#### 4.1.4. AICP Requirements for the Agent Card

The Capabilities Manifest for an AICP Merchant Agent, which is an A2A Agent Card, **MUST** adhere to the structure and requirements outlined in Section 5.5 of [A2A-SPEC]. In addition, for AICP conformance:

-   It **MUST** declare supported AICP Skills within the `capabilities.skills` array (as defined in Section 5.5.4 of [A2A-SPEC]). Each declared AICP Skill **MUST** have an `id` field prefixed with `aicp:` (e.g., `"id": "aicp:product_get"`).
-   It **SHOULD** accurately declare all necessary authentication requirements as per Section 4 and 5.5 of [A2A-SPEC] (particularly `securitySchemes` and `security` fields) to enable Client Agents to interact with the declared AICP Skills.
-   It **MAY** declare non-AICP skills; Client Agents processing AICP interactions **SHOULD** ignore skills with `id`s not prefixed by `aicp:` if they are not programmed to handle them.

#### 4.1.5. Product Identifier Discovery from Web Pages (RECOMMENDED)

To facilitate a direct transition to an AICP interaction for a specific product found on a merchant's website, and to enable automated systems like web crawlers to accurately identify products, AICP **RECOMMENDS** that product identifiers be discoverable directly from the web page content. This discovered identifier can then be used to construct or reference a canonical AICP Product URN for use in AICP Skills.

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

2.  **AICP Skill Parameters:**
    *   The input parameters required by the specific AICP Skill **MUST** be provided as a single A2A `DataPart` (Section 6.5.3 of [A2A-SPEC]) within the `parts` array of the A2A `Message` object.
    *   The `DataPart.data` field **MUST** be a JSON object representing the input parameters for the AICP Skill. The specific structure of this JSON object for each AICP Skill is defined in Section 5 (AICP Skills).
    *   The A2A `Message.parts` array for an AICP skill invocation **SHOULD** contain only this single `DataPart` for parameters, unless the specific AICP skill explicitly allows for other `Part` types (e.g., a `FilePart` for image search, though this is not defined in `draft-01`).

3.  **AICP User Context (OPTIONAL):**
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
*   If a new `aicpUserContextToken` is generated by the Merchant Agent as a result of processing `userContext` (see Section 4.2.4), it **MUST** be returned within a `userContext` object in the `metadata` field of the A2A `Task` object.
    Example: `Task.metadata.userContext = { "token": "newly_generated_opaque_token" }`. If an existing token was provided in the request and preferences were updated, the Merchant Agent **SHOULD NOT** return the token again in the response, as the token itself is stable and does not change upon preference updates.

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
      "userContext": {
        "token": "newly_generated_opaque_token"
      }
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

To enable a degree of personalization and session continuity similar to web browser cookie mechanics (but with explicit user consent), AICP defines an optional `userContext` object that Client Agents **MAY** include in the `metadata` field of an A2A `Message` sent to a Merchant Agent.

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
-   **`token` (string, OPTIONAL):** An opaque `aicpUserContextToken` previously issued by this Merchant Agent for this user/Client Agent.
-   **`userConsentObtained` (string, OPTIONAL):** A declaration from the Client Agent regarding user consent for the processing of `preferences` data by the Merchant Agent.
    -   For `draft-01`, if this field is present and `preferences` are intended for storage or use with a `token`, its value **MUST** be `"all"`. This signifies that the Client Agent attests to having obtained user consent for the Merchant Agent to store and use all provided fields within the `preferences` object for personalization and to issue/use the `aicpUserContextToken`. The specifics of this consent process are further detailed in Section 7 (User Data Privacy and Consent Guidelines).
-   **`preferences` (object, OPTIONAL):** A JSON object containing user preferences.
    -   `locale` (string, OPTIONAL): User's preferred language/region (e.g., "en-US", "fr-CA"). **SHOULD** conform to IETF BCP 47.
    -   `zoneinfo` (string, OPTIONAL): User's timezone (e.g., "America/New_York"). **SHOULD** be an IANA Time Zone Database name.
    *   `currency` (string, OPTIONAL): User's preferred currency (e.g., "USD", "EUR"). **SHOULD** be an ISO 4217 code.
    *   `interests` (string, OPTIONAL): A natural language string describing user interests, preferences, or shopping context (e.g., "Looking for vegan, cruelty-free cosmetics," "Interested in high-performance gaming laptops for under $1500"). Merchant Agents **MAY** use NLP to interpret this.

**Merchant Agent Behavior:**

When a Merchant Agent receives an A2A `Message` containing a `userContext` object in its `metadata`, its processing logic for this `userContext` **SHOULD** follow these distinct cases:

1.  **Case 1: New Context with Valid Consent**
    *   **Condition:** `userContext.token` is NOT present (or is present but invalid/unrecognized and thus ignored) AND `userContext.preferences` ARE present AND `userContext.userConsentObtained` is present and equals `"all"`.
    *   **Actions:**
        *   The Merchant Agent **SHOULD** store the new `preferences` provided in `userContext.preferences`.
        *   It **MUST** generate a new, cryptographically strong, opaque `aicpUserContextToken`.
        *   This new `aicpUserContextToken` **MUST** be returned to the Client Agent within a `userContext` object in the `Task.metadata` field of the A2A `Task` response (i.e., `Task.metadata.userContext = { "token": "new_token_value" }`).
        *   The Merchant Agent **SHOULD** use the provided `preferences` for personalization of the current request.

2.  **Case 2: New Context Attempt with Invalid/Absent Consent**
    *   **Condition:** `userContext.token` is NOT present (or is present but invalid/unrecognized and thus ignored) AND `userContext.preferences` ARE present BUT `userContext.userConsentObtained` is *not* present or not equal to `"all"`.
    *   **Actions:**
        *   The Merchant Agent **MUST NOT** generate an `aicpUserContextToken`.
        *   The Merchant Agent **MUST NOT** persistently store the provided `preferences`.
        *   It **MAY** use the provided `preferences` *only* for contextualizing the current, single request (session-level personalization).
        *   The Merchant Agent **SHOULD** include an error indication in the A2A `Task` response. This can be done by setting `Task.status.state` to `"failed"` and providing an AICP-specific error in `Task.status.message.parts[0].data` with `aicpErrorCode: "AICP_USER_CONSENT_REQUIRED"` (see Section 6). If the primary purpose of the AICP Skill was *not* to set preferences (e.g., an `aicp:product_search`), the main skill operation **MAY** still be processed anonymously using the transient preferences, but no token should be established or preferences stored.

3.  **Case 3: Existing Valid Context Token Provided**
    *   **Condition:** `userContext.token` is present AND is a valid, recognized `aicpUserContextToken`.
    *   **Actions:**
        *   The Merchant Agent **SHOULD** use this `token` to retrieve any previously stored user preferences associated with it. This data can be used for personalizing the response to the current AICP Skill request.
        *   **If `userContext.preferences` are *also* provided in the current request:**
            *   And if `userContext.userConsentObtained` is present and equals `"all"`: The Merchant Agent **SHOULD** update (PATCH behavior) its stored preferences associated with the existing `token` using these newly provided preference values.
            *   And if `userContext.userConsentObtained` is *not* present or not equal to `"all"`: The Merchant Agent **SHOULD NOT** update its persistently stored preferences for this `token`. It **MAY**, however, use the `preferences` from the current request *only* for session-level personalization of the immediate response.
        *   The `aicpUserContextToken` itself does not change and **SHOULD NOT** be returned again in `Task.metadata`. Successful completion of the A2A Task (if no other errors occur) can imply that any valid preference updates were processed.

4.  **Case 4: Invalid/Unrecognized Context Token Provided (and no new preferences being set to establish a new context)**
    *   **Condition:** `userContext.token` is present BUT is invalid or unrecognized by the Merchant Agent, AND (`userContext.preferences` are NOT present OR `userContext.userConsentObtained` is not present or not equal to `"all"`).
    *   **Actions:**
        *   The Merchant Agent **SHOULD** ignore the invalid `token`.
        *   It **SHOULD** include an error indication related to the token in the A2A `Task` response. This can be done by setting `Task.status.state` to `"failed"` and providing an AICP-specific error in `Task.status.message.parts[0].data` with `aicpErrorCode: "AICP_INVALID_USER_CONTEXT_TOKEN"` (see Section 6).
        *   The primary AICP Skill request (e.g., product search) **MAY** still be processed anonymously as if no `userContext` (or at least no valid token) was provided, or the Merchant Agent **MAY** choose to fail the entire operation if a valid context was implied as necessary by the client providing a token.

**Client Agent Responsibilities:**
*   Securely store and manage `aicpUserContextToken`s on a per-user, per-Merchant Agent basis.
*   Include the `aicpUserContextToken` in `Message.metadata.userContext.token` for subsequent interactions with that Merchant Agent where personalization context is desired.
*   Ensure user consent is obtained as per Section 7 before sending `userContext.userConsentObtained: "all"` and preference data.

**Relationship with A2A `contextId`:**
The A2A `contextId` (Section 6.1 of [A2A-SPEC]) is for linking related A2A tasks within a session or workflow. The `aicpUserContextToken` is for longer-term user personalization context with a specific Merchant Agent, potentially across multiple sessions or A2A `contextId`s. Merchant Agents **MAY** internally associate an `aicpUserContextToken` with one or more A2A `contextId`s.

**Interaction with Full OAuth 2.1 Authentication:**
If an A2A request is made with a valid OAuth 2.1 Access Token (see Section 8):
*   The identity and authorization from the Access Token take precedence for any privileged actions.
*   If an `aicpUserContextToken` (via `Message.metadata.userContext.token`) is also provided, the Merchant Agent **MAY** link the context associated with this token to the fully authenticated user (identified by the OIDC `sub` claim from the OAuth flow). This allows a "guest" personalization context to be transitioned to an authenticated user.

The `aicpUserContextToken` **MUST NOT** be used by Merchant Agents as a substitute for proper user authentication for accessing protected resources or performing restricted actions. It is solely for personalization context. This token **SHOULD** be treated as sensitive by both Client and Merchant Agents.

## 5. AICP Skills

This section defines the standardized AICP Skills that Merchant Agents can implement and Client Agents can invoke. All AICP Skills are invoked as A2A tasks, as described in Section 4.2 (Interaction Model). For each skill, this section will specify its unique `skillId` and purpose. Detailed definitions of input parameters, result artifact structures, and specific error conditions for each skill will be elaborated in future revisions of this specification or in accompanying documents.

Client Agents **MUST** specify the target AICP Skill by including `{"skillId": "<full_skill_id>"}` in the `metadata` field of the A2A `Message` object.

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
*   `AICP_AUTHENTICATION_REQUIRED` 
*   `AICP_AUTHORIZATION_DENIED` 
*   `AICP_INVALID_PARAMETERS` 
*   `AICP_RATE_LIMIT_EXCEEDED` 

## 7. User Data Privacy and Consent Guidelines

This section outlines the principles, responsibilities, and guidelines for handling user data, specifically in relation to the `userContext` object and the `aicpUserContextToken` used for personalization within the AI Commerce Protocol (AICP). Adherence to these guidelines is crucial for fostering user trust and ensuring compliance with applicable data privacy regulations.

### 7.1. Preamble and Purpose

AICP is designed to facilitate user-centric e-commerce interactions. The mechanisms for personalization, including the `userContext` object and the `aicpUserContextToken`, are intended to enhance the user's experience by allowing Merchant Agents to tailor offerings and interactions based on user-consented preferences and context. This section provides a framework for the responsible handling of this information.

All parties implementing or utilizing AICP (Client Agents, Agent Providers, Merchant Agents) **MUST** strive to uphold the highest standards of user privacy and data protection.

### 7.2. Scope

These guidelines apply to:
*   The collection, transmission, storage, and use of the `userContext` object (defined in Section 4.2.4) and all its fields, including `token`, `userConsentObtained`, and the nested `preferences` object (with fields such as `locale`, `zoneinfo`, `currency`, `interests`).
*   The issuance, management, and use of the `aicpUserContextToken`.
*   The consent mechanisms related to sharing and using this data for personalization.

These guidelines complement, and do not replace, any obligations under applicable local, national, or international data privacy laws and regulations (e.g., GDPR, CCPA, etc.).

### 7.3. Key Privacy Principles

The following principles **MUST** guide the handling of user data within AICP:

*   **Transparency:** Users **MUST** be clearly informed about what data is being collected for personalization, with which Merchant Agent it will be shared, for what purposes, and how the `aicpUserContextToken` will be used.
*   **User Control & Consent:** Explicit, informed, and freely given user consent **MUST** be obtained by the Client Agent/Agent Provider *before* any preference data is shared with a Merchant Agent for storage and persistent personalization linked to an `aicpUserContextToken`. Users **MUST** have accessible mechanisms to review, modify, and revoke their consent and to request the deletion of their personalization context associated with a specific Merchant Agent.
*   **Purpose Limitation:** Data collected within `userContext.preferences` and associated with an `aicpUserContextToken` **MUST** only be used by the Merchant Agent for the consented purpose of personalizing the user's AICP interactions with that specific Merchant Agent. It **MUST NOT** be used for unrelated purposes or shared with third parties without separate, explicit user consent.
*   **Data Minimization:** Only the minimum amount of preference data necessary for the intended personalization **SHOULD** be requested by Client Agents and processed or stored by Merchant Agents.
*   **Security:** Both Client Agents/Agent Providers and Merchant Agents **MUST** implement appropriate technical and organizational measures to protect the security, confidentiality, and integrity of the `userContext` data and the `aicpUserContextToken`.
*   **Accountability:** Client Agents/Agent Providers and Merchant Agents are accountable for complying with these guidelines and applicable privacy laws.

### 7.4. Client Agent and Agent Provider Responsibilities

1.  **Consent Acquisition:**
    *   The Client Agent (or its underlying Agent Provider) **MUST** obtain explicit, informed, and unambiguous consent from the user *before* transmitting a `userContext` object containing `preferences` and the `userConsentObtained: "all"` flag to a Merchant Agent for the purpose of establishing or updating a persistent personalization context.
    *   The consent request **SHOULD** clearly identify:
        *   The specific Merchant Agent with whom the preference data will be shared.
        *   The types of preference data to be shared (e.g., locale, interests).
        *   The purpose of sharing (e.g., "to personalize product searches and recommendations on [Merchant Agent Name]").
        *   That an `aicpUserContextToken` will be issued by the Merchant Agent to remember this context for future interactions.
        *   Information on how the user can manage or revoke this consent and associated data.
    *   For `draft-01`, the `userConsentObtained: "all"` value signifies that consent has been obtained for *all* fields provided within the `userContext.preferences` object to be stored and used by the named Merchant Agent for personalization in conjunction with the `aicpUserContextToken`.

2.  **Transparency:** Client Agents **SHOULD** provide users with clear information about how their preference data is being used for personalization within AICP interactions.

3.  **Secure Management of `aicpUserContextToken`:**
    *   Client Agents **MUST** securely store and manage `aicpUserContextToken`s received from Merchant Agents. Storage **SHOULD** be on a per-user, per-Merchant Agent basis.
    *   Client Agents **SHOULD** treat these tokens as sensitive, as they provide access to a user's personalization context with a merchant.

4.  **User Controls:**
    *   Agent Providers **SHOULD** provide users with mechanisms to:
        *   Review which Merchant Agents have an active `aicpUserContextToken` associated with their account.
        *   Revoke consent for a specific Merchant Agent.
        *   Request the deletion/clearing of their personalization context (and the associated `aicpUserContextToken`) from a specific Merchant Agent. Client Agents **SHOULD** facilitate this, potentially by invoking a dedicated AICP Skill (e.g., `aicp:user_context_clear` - TBD for `draft-01`) if defined and supported by the Merchant Agent.

### 7.5. Merchant Agent Responsibilities

1.  **Purpose Limitation and Data Use:**
    *   Merchant Agents **MUST** only use the data received in `userContext.preferences` and any data associated with an `aicpUserContextToken` for the purpose of personalizing AICP interactions for that user, as consented.
    *   The `aicpUserContextToken` **MUST NOT** be used as a substitute for user authentication for accessing protected resources, performing privileged actions (e.g., completing a purchase, viewing order history), or accessing any Personally Identifiable Information (PII) not explicitly covered by the consent associated with the `userContext`. Such actions **MUST** require separate, standard OAuth 2.1 authentication.

2.  **Security of Stored Data:**
    *   Merchant Agents **MUST** implement appropriate technical and organizational security measures to protect any stored `userContext.preferences` data and the associated `aicpUserContextToken` against unauthorized access, disclosure, alteration, or destruction.

3.  **Data Retention and Deletion:**
    *   Merchant Agents **SHOULD** establish a reasonable data retention policy for `userContext.preferences` and associated `aicpUserContextToken`s, deleting or anonymizing them after a period of inactivity or upon user request (facilitated by the Client Agent).
    *   If an `aicp:user_context_clear` skill is supported, Merchant Agents **MUST** honor valid requests to delete the token and its linked preference data.

4.  **No Cross-Merchant Tracking:** Merchant Agents **MUST NOT** attempt to correlate `aicpUserContextToken`s or data obtained through AICP `userContext` with data from other unaffiliated merchant domains or services to track users across different merchants without separate, explicit, and informed user consent for such broader tracking.

5.  **Handling of `userConsentObtained`:**
    *   Merchant Agents **MUST** respect the `userConsentObtained` flag. If `preferences` are received without a `token` and `userConsentObtained` is not present or not `"all"`, the Merchant Agent **MUST NOT** persistently store these preferences against any identifier or issue an `aicpUserContextToken`.

### 7.6. Linking Personalization Context with Authenticated Sessions

If a user subsequently authenticates with a Merchant Agent via a standard OAuth 2.1 / OIDC flow (see Section 8.1), the Merchant Agent **MAY** link the previously established personalization context (associated with an `aicpUserContextToken`, if the Client Agent provides it during or after the authentication flow) with the user's verified identity (e.g., their OIDC `sub` claim).

*   Any such linking **MUST** be done in a way that respects the original scope of consent given for the `userContext`.
*   If linking results in previously pseudonymous data becoming identifiable, the Merchant Agent **MUST** ensure that its general privacy policy and any further consent obtained during the OAuth flow adequately cover the continued storage and use of this now-identifiable data.

These guidelines aim to establish a baseline for responsible data handling. Implementers are encouraged to consult relevant legal and privacy expertise to ensure full compliance with all applicable regulations.

## 8. Security Considerations
// ... (This was previously Section 7, now renumbered, content to be reviewed/updated later) ...
// ... existing content of old Section 7 ...

## 9. Extensibility
// ... (This was previously Section 8, now renumbered) ...
// ... existing content of old Section 8 ...

## 10. Design Rationale and FAQ
// ... (This was previously Section 9, now renumbered) ...
// ... existing content of old Section 9 ...

## 11. Future Work
// ... (This was previously Section 10, now renumbered) ...
// ... existing content of old Section 10 ...

## 12. References
- **[RFC2119]** Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997.
- **[RFC3986]** Berners-Lee, T., Fielding, R., and L. Masinter, "Uniform Resource Identifier (URI): Generic Syntax", STD 66, RFC 3986, DOI 10.17487/RFC3986, January 2005.
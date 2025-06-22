# FAQ for Client Agents

This document addresses frequently asked questions for developers implementing AICP Client Agents (e.g., personal AI assistants).

## A2A Protocol and Ecosystem

### How does AICP relate to the Agent2Agent (A2A) Protocol?
AICP is profiled as a specialized application layer of the [Agent2Agent (A2A) Protocol][A2A-SPEC]. It leverages A2A's core framework for fundamental agent communication, including agent discovery (via A2A Agent Cards using the standard `/.well-known/agent.json` path), task management, JSON-RPC 2.0 based messaging, and secure transport (HTTPS). AICP then builds upon this foundation by defining e-commerce-specific applications of these A2A features, such as:

*   A standardized set of e-commerce skills, identified by `aicp:` prefixes, for core commerce operations (AICP Spec Section 5).
*   Conventions for product identification using URNs, often derived from web-discoverable data like Schema.org (AICP Spec Section 4.1.5).
*   Detailed guidelines for using the A2A `Task.contextId` along with the `aicp:user_preferences_set` skill for managing user consent and personalization data specific to e-commerce interactions (AICP Spec Sections 4.2.4, 5.5.1, 7).
*   A defined set of `aicpErrorCode` values for e-commerce specific error conditions, complementing A2A's standard error reporting (AICP Spec Section 6).

In essence, A2A provides the general mechanisms for agent communication, and AICP applies and details these for the specific domain of AI-driven commerce.

### What extensions or potentially non-compatible behaviors does AICP introduce on top of A2A?
AICP `draft-01` strives for A2A compatibility, it also introduces specific conventions and extensions to address the unique requirements of AI-driven e-commerce. Some of these are opinionated design choices or address needs not yet fully standardized within the broader A2A ecosystem. The intention is often to propose these patterns for wider adoption or to see them potentially standardized in future A2A versions or related specifications.

Key areas where AICP introduces such specific approaches include:

*   **Skill ID Namespacing:** AICP mandates a `aicp:` prefix for its standard skill IDs (e.g., `aicp:product_search`). While A2A defines how skills are listed, it doesn't prescribe a universal namespacing convention. This AICP convention helps distinguish its e-commerce skills within a potentially broader A2A ecosystem that might include skills from various domains.

*   **Consent Granting and Standardized Data Policies:** AICP defines a specific skill (`aicp:user_preferences_set`) and a mechanism (`userDataConsent` field) for Client Agents to convey user consent regarding data handling to Merchant Agents. It also introduces the concept of "standard user data handling policies" (like the "Policy: `all`" in AICP Spec Section 7.2.1) aiming to streamline user consent experiences. A2A itself does not define a standardized consent signaling or policy framework at this level of detail.

*   **Alternative Discovery Mechanisms:** Beyond the A2A standard `/.well-known/agent.json` for Agent Card discovery, AICP recommends additional, optional discovery hints like DNS TXT records (`_aicp.{merchant-domain}`) and specific HTML link relations (`rel="aicp-agent-card"`). These are proposed to make AICP-specific Merchant Agents more readily discoverable for e-commerce use cases.

*   **Support for Non-Authenticated Interactions in Production:** A2A generally emphasizes authenticated interactions, especially in production. However, for practical e-commerce scenarios like public product search or initial discovery by unauthenticated users, AICP introduces a convention for "publicly accessible skills." This is achieved by using a specific tag (`auth:public`) within the A2A `AgentSkill.tags` array (AICP Spec Section 8.1.1). This allows Merchant Agents to explicitly signal that certain skills can be invoked without authentication, which is a significant consideration for public-facing services but might differ from typical A2A security postures for private agent-to-agent interactions.

*   **Using Skill Tags for Technical Capabilities:** The `auth:public` tag is an example of AICP using the A2A `AgentSkill.tags` field to declare a technical capability or a behavioral characteristic of a skill, rather than just for descriptive categorization. While `tags` are free-form in A2A, AICP proposes a specific, machine-interpretable use for this tag.

These AICP-specific design choices are intended to provide a robust and practical framework for AI in e-commerce. AICP contributors anticipate that some of these patterns may inform future A2A protocol enhancements or lead to the development of complementary, cross-domain specifications.

### Why is a specialized protocol like AICP necessary? Shouldn't an A2A Agent Card with skill descriptions be enough for an LLM to understand a merchant's capabilities and figure out how to interact?
While modern Large Language Models (LLMs) are powerful in understanding and generating interactions based on documentation, relying solely on a generic A2A Agent Card and human-readable skill descriptions for all e-commerce interactions presents several challenges that AICP aims to address:

1.  **Standardization for Predictability and Reliability:**
    *   **AICP:** Provides a standardized e-commerce framework, defining a common vocabulary of skills (e.g., `aicp:product_search`), consistent data structures for all interactions (including conventions for product URNs and specific e-commerce error codes), and predictable operational patterns. This standardization is crucial for reliable and scalable interoperability. For AI-driven Client Agents, this consistency significantly reduces the cognitive load and context needed to manage diverse merchant APIs, leading to more dependable performance.
    *   **Agent Card Alone:** Without this AICP framework, merchants might define not only skills but also core e-commerce concepts (like how products are identified or how errors are reported) with wide variations. LLMs would then need to adapt to each unique semantic and structural API, increasing complexity and the likelihood of misinterpretation.

2.  **Reduced Ambiguity and Hallucination Risk:**
    *   **AICP:** Provides well-defined, machine-readable schemas (e.g., compatible with JSON Schema) for request and response data structures in common e-commerce tasks. This significantly reduces ambiguity for LLMs when mapping user requests to merchant capabilities and allows for robust validation of data by implementations, thereby minimizing errors and the likelihood of "hallucinated" or malformed API calls.
    *   **Agent Card Alone:** Without a shared specification like AICP, LLMs must depend on the quality and consistency of each merchant's documentation and skill declarations. This often leads to inconsistent implementations and errors, much like today's web APIs where poor or incomplete machine-readable definitions are common and increase the risk of misinterpretation.

3.  **Simplified Implementation for Client Agents:**
    *   **AICP:** Directly tackles N-to-M integration costs by offering a single, standardized interface for e-commerce. This allows Client Agent developers to build one connector for all AICP-compliant merchants, drastically cutting the human effort needed for developing and maintaining numerous bespoke integrations. Even with advanced LLMs, reliably interfacing with many varied and potentially under-documented APIs individually demands significant, ongoing engineering investment.
    *   **Agent Card Alone:** Requires Client Agent developers to learn and adapt to each merchant's unique API. This can lead to a more resource-intensive cycle of custom integration and maintenance for each supported merchant, potentially diverting resources from other development priorities.

4.  **Discoverability of Core Competencies:**
    *   **AICP:** The `aicp:` skill namespace and defined core e-commerce skills allow Client Agents to more readily identify if a merchant supports the foundational capabilities for a standard purchase flow. This can aid in more efficient agent routing and task delegation.
    *   **Agent Card Alone:** May require parsing diverse skill lists from each merchant to determine if essential e-commerce functions are supported, potentially adding complexity to the agent's decision-making process.

5.  **Ecosystem Interoperability and Tooling:**
    *   **AICP:** As a shared standard, it encourages the development of a common ecosystem, including reusable libraries, SDKs, testing tools, and shared best practices. This can help lower the barrier to entry, streamline development, and support broader adoption and innovation in AI-driven commerce.
    *   **Agent Card Alone:** May result in more fragmented development efforts and fewer opportunities for shared tooling, potentially increasing integration costs across the ecosystem.

In summary, while an LLM can interpret varied documentation, AICP provides a necessary layer of standardization and e-commerce-specific semantics on top of A2A. This makes interactions more reliable, predictable, and scalable for both Client Agents and Merchant Agents, reducing the likelihood of errors and simplifying the development of robust AI-driven commerce experiences. It shifts some of the burden from pure LLM interpretation to protocol-defined structure for common, critical tasks.

## User Experience and Context Management

### If a user revokes consent what is the expected behavior for the Client Agent regarding the existing `contextId`? Should it be discarded?
If a user revokes consent for personalization associated with a specific merchant:

1.  The Client Agent **SHOULD** explicitly notify the Merchant Agent of this revocation. This is done by sending a direct skill invocation of `aicp:user_preferences_set` (as detailed in AICP Specification Sections 4.2.4 and 5.5.1), providing the relevant `contextId` and setting the `preferences.userDataConsent` field to `"none"` (or `"absent"` if appropriate).
2.  Upon successfully notifying the merchant, the Client Agent **SHOULD** then either discard the `contextId` or internally mark it as invalid for any future personalized interactions with that specific merchant.
3.  The Client Agent **MUST NOT** send this `contextId` again to that merchant in subsequent requests where personalization might otherwise have been implied or active.

This ensures the Merchant Agent is informed and can act accordingly on their end, and the Client Agent correctly ceases to use the context for which consent has been withdrawn.

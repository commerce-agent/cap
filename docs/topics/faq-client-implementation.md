# FAQ - Client Implementation

This document addresses frequently asked questions for developers implementing AICP Client Agents (e.g., personal AI assistants).

## Skills and Capabilities

**Q: How flexible are the defined AICP skills (e.g., `aicp:product_search`) in handling nuanced natural language queries and complex filter criteria?**
A: The detailed input parameters for each skill are currently under development (see Section 5 of the AICP Specification). The goal is to provide sufficient richness to support common e-commerce scenarios. The flexibility will largely depend on the defined schema for these parameters.

**Q: How should a Client Agent handle user requests that span multiple AICP skills or require a sequence of operations?**
A: For `draft-01`, the Client Agent is expected to orchestrate such complex requests by making multiple A2A calls to the Merchant Agent. The capability for bundling multiple skill invocations within a single message is noted as a potential future extension (see Section 4.2.1 of the AICP Specification).

**Q: How will versioning of AICP skills be handled by Client Agents if a merchant supports a different version than expected?**
A: Skill versioning is an important aspect for future consideration, tying into the extensibility goals (Section 9). For `draft-01`, skills are identified by their `id`. Future revisions may introduce explicit versioning in the skill declaration or invocation.

## Discovery and Capability Matching

**Q: Beyond a merchant declaring support for a skill (e.g., `aicp:product_search` in their Agent Card), how can a Client Agent determine if the merchant's *implementation* meets the qualitative needs of the user (e.g., supports specific complex query types)?**
A: The AICP `draft-01` Agent Card specifies supported skills by ID (Section 4.1.4). While it doesn't currently include fine-grained qualitative capability declarations for each skill implementation, merchants may provide additional details in the `description` field of an `AgentSkill` or in linked documentation (`AgentCard.documentationUrl`). Future versions or extensions might address more structured capability declarations.

## User Experience and Context Management

**Q: How should Client Agents manage user expectations and consent regarding the A2A `contextId` and data shared with various merchants for personalization?**
A: Client Agents play a crucial role in transparency. The `aicp:user_preferences_set` skill (Section 5.5.1) is the mechanism for conveying user consent (`userDataConsent`) to the Merchant Agent. Client Agent providers should ensure their users understand what data is being used for personalization with each merchant, guided by the principles in Section 7 (User Data Privacy and Consent Guidelines).

**Q: If a user revokes consent (e.g., via `aicp:user_preferences_set` with `userDataConsent: "none"`), what is the expected behavior for the Client Agent regarding the existing `contextId`? Should it be discarded?**
A: When consent is revoked for a given `contextId`, the Client Agent should cease sending that `contextId` for future personalization requests to that merchant. The Merchant Agent, upon receiving such a revocation, will no longer use data associated with that `contextId` for personalization (as per Section 7.2.1, point 4). The Client Agent may choose to discard the `contextId` or mark it as invalid for personalization with that specific merchant.

## Error Handling and Recovery

**Q: Where can Client Agent developers find a comprehensive list of `aicpErrorCode` values and guidance on user-facing messages or recovery strategies?**
A: Section 6 of the AICP Specification defines the structure for AICP-specific errors. A list of common `aicpErrorCode` values is currently a placeholder and will be enumerated in future revisions. Client Agents should inspect `Task.status.state` and then parse `Task.status.message.parts[0].data` for the AICP error details.

## Future Interactions

**Q: The Introduction (Section 1) mentions a future aim to support 'more fluid agent interactions.' What might this entail for Client Agent implementations?**
A: This is a forward-looking statement. Future versions of AICP might explore more conversational skill invocations, support for streaming partial inputs for interactive refinement, or other mechanisms beyond the initial request-reply model for core tasks. The specifics will be defined in those future versions.

## Data Structures

**Q: When will the detailed JSON schemas for AICP skill input parameters and result artifacts be available?**
A: The detailed data structures for each AICP skill (inputs and outputs) are noted as placeholders in Section 5 of the `draft-01` specification and will be elaborated in future revisions or accompanying documents. These are critical for implementation and are a priority for development. 
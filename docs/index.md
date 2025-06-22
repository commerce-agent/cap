---
hide:
  - navigation
  - toc
---

<style>
.banner {
    border-radius: 25px;
    
}
</style>

# AI Commerce Protocol

<img src="./assets/aicp-banner.jpg" width="100%" class="banner">

## Standardizing AI Agent Interactions for E-commerce

The **AI Commerce Protocol (AICP)** is an open standard designed to enable personal AI agents to seamlessly discover and interact with compliant merchants for a complete e-commerce purchase flow. By defining a common language and a set of standardized operations, AICP aims to create an open, interoperable ecosystem for AI-driven commerce.

![AICP Main Graphic](./assets/aicp-main-graphic.jpg){width="60%"}
{style="text-align: center; margin-bottom:1em; margin-top:2em;"}

---

### Why AICP? The Future of AI-Powered Shopping

AICP empowers AI agents to become capable shopping assistants by addressing key challenges in AI-driven commerce:

<div class="grid cards" markdown>

- :material-store-search-outline:{ .lg .middle } **Simplified Merchant Discovery**

    Provides a consistent mechanism for AI agents to find AICP-compliant merchants and understand their e-commerce capabilities through standardized Agent Cards.

- :material-swap-horizontal-bold:{ .lg .middle } **Interoperable E-commerce Operations**

    Defines a clear set of standardized e-commerce operations (e.g., product search, cart management, checkout) with consistent data structures, enabling agents to interact with any compliant merchant reliably.

- :material-puzzle-edit-outline:{ .lg .middle } **Streamlined Agent Integration**

    Lowers the complexity for AI agent developers to integrate e-commerce functionalities by abstracting merchant-specific intricacies behind a uniform set of AICP-defined tasks.

- :material-account-group-outline:{ .lg .middle } **Open Commercial Ecosystem**

    Fosters a level playing field, enhancing consumer choice by making it easier for AI agents to connect with a diverse range of merchants through an open protocol.

</div>

---

### Built on Agent2Agent (A2A) protocol

AICP is a specialization of the [Agent2Agent (A2A) Protocol](https://google-a2a.github.io/A2A/).

![AICP builds on A2A Graphic](./assets/aicp-on-a2a.png){width="30%"}
{style="text-align: center; margin-bottom:1em; margin-top:1em; padding:50px"}

It leverages A2A's core framework for:

*   Agent discovery (via Agent Cards)
*   Task management
*   Secure communication (JSON-RPC over HTTPS)

AICP then focuses on defining the e-commerce-specific aspects: standardized operations, data structures for commerce, merchant and product discoverability, specific capability declarations, and interaction guidelines.

[Learn more about the Agent2Agent (A2A) Protocol](https://google-a2a.github.io/A2A/)

---

### Get Started with AICP

<div class="grid cards" markdown>

- :material-file-document-outline:{ .lg .middle } **Read the Specification**

    Dive into the detailed technical definition of the AI Commerce Protocol.

    [:octicons-arrow-right-24: AICP Specification](./specification.md)

- :material-frequently-asked-questions:{ .lg .middle } **View Implementer FAQs**

    Find answers to common questions for building Client Agents or Merchant Agents.

    [:octicons-arrow-right-24: FAQ for Client Agents](./topics/faq-clients.md)

    [:octicons-arrow-right-24: FAQ for Merchant Agents](./topics/faq-merchants.md) <!-- Placeholder link -->


- :material-format-list-bulleted-type:{ .lg .middle } **Explore Key Topics**

    Learn more about specific aspects of AICP.

    [:octicons-arrow-right-24: Why A2A](./topics/why-a2a.md)
    <!-- Example: [:octicons-arrow-right-24: Personalization & Consent](./topics/personalization.md) -->

- :material-forum-outline:{ .lg .middle } **Community & Contributions** (Future)

    Learn how to contribute to the AICP standard and connect with the community.
    <!-- Link to contribution guidelines or discussion forum when available -->

</div>

---
**Version**: `draft-01`
(See the full [Specification Document](./specification.md) for detailed versioning and status) 
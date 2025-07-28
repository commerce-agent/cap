# Commerce Agent Protocol (CAP) Specification

[![Status](https://img.shields.io/badge/status-draft--01-orange)](docs/specification.md)

The **Commerce Agent Protocol (CAP)** is an open standard that enables personal AI agents to seamlessly discover and interact with compliant merchants for complete e-commerce purchase flows. CAP builds on the [Agent2Agent (A2A) Protocol](https://a2a-protocol.org/latest/) to provide standardized operations, data structures, and interaction guidelines specifically for AI-driven commerce.

## What CAP Enables

- **Standardized E-commerce Operations**: Product search, cart management, checkout flows
- **Merchant Discovery**: Consistent mechanism for AI agents to find CAP-compliant merchants
- **Interoperability**: Common language allowing any compliant agent to work with any compliant merchant
- **Open Ecosystem**: Level playing field enhancing consumer choice and merchant accessibility

## Documentation

This repository contains the complete CAP specification and supporting documentation:

- **[Specification](docs/specification.md)** - Complete technical definition of CAP
- **[FAQ for Client Agents](docs/topics/faq-clients.md)** - Implementation guidance for AI agent developers
- **[FAQ for Merchant Agents](docs/topics/faq-merchants.md)** - Implementation guidance for merchant developers
- **[Why A2A](docs/topics/why-a2a.md)** - Background on the A2A foundation

## Getting Started

### View the Documentation

The documentation is built with MkDocs. To run it locally:

```bash
# Install dependencies
uv sync

# Serve the documentation
uv run mkdocs serve
```

The documentation will be available at `http://localhost:8000`

### For Implementers

- **AI Agent Developers**: Start with the [Client Agent FAQ](docs/topics/faq-clients.md) and [specification](docs/specification.md)
- **Merchant Developers**: Begin with the [Merchant Agent FAQ](docs/topics/faq-merchants.md) and [specification](docs/specification.md)

## 📋 Current Status

**Version**: `draft-01` (Editor's Draft)

CAP is currently in draft status and under active development. The specification defines the core purchase flow (search → cart → checkout) with plans for future enhancements.

## 🤝 Contributing

This specification is being developed to foster an open, interoperable ecosystem for AI-driven commerce. Community feedback and contributions are welcome as the standard evolves.

---

**Editor**: Cloves Almeida, Boston Consulting Group

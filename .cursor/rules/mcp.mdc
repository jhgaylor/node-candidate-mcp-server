---
description: 
globs: 
alwaysApply: false
---
 # Model Context Protocol (MCP)

MCP is a standard protocol to exchange contextual data between clients, servers, and LLMs. This rule provides an at-a-glance reference for key concepts, spec versions, tooling, and best practices.

## Core Concepts

- **Lifecycle**: Define session start/end, request and response phases.
- **Messages**: JSON-encoded context, prompts, and completions.
- **Transports**: HTTP, WebSocket, gRPC—pluggable transports for message delivery.
- **Cancellation**: Send cancellation messages to abort in-progress requests.
- **Ping (Heartbeat)**: Keep connections alive; detect timeouts.
- **Progress**: Stream partial results and progress updates.
- **Roots**: External content references (e.g. code, docs) managed by ID.
- **Sampling**: Control streaming vs. non-streaming completions; fine-tune sampling parameters.
- **Tools**: Plugin external actions and APIs into LLM workflows.

## Specification Versions

- **Basic 2024-11-05**: Overview, lifecycle, messages, transports, utilities (cancellation, ping, progress).
- **Server/Client 2024-11-05**: Prompts, resources, roots, sampling, tools, logging, pagination.
- **Extended 2025-03-26**: Authorization, architecture refinements, changelog.
- **Drafts**: Early designs; consult changelog for breaking changes.

## SDKs & Examples

- **TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk
- **Python SDK**: https://github.com/modelcontextprotocol/python-sdk
- **Java/Kotlin/C# SDKs**: Refer to https://modelcontextprotocol.io
- **Example Clients & Servers**: https://modelcontextprotocol.io/examples.md

## Best Practices

- Always annotate messages with spec version and timestamp.
- Use **roots** to manage large contexts; avoid embedding bulky data inline.
- Gracefully handle **cancellation** and **errors**; propagate clear error codes.
- Emit **progress** events for long-running streams to improve UX.
- Maintain a **ping** schedule to detect and recover dropped connections.
- Leverage **tools** to encapsulate external API calls and side effects.
- Follow spec utilities: **logging**, **pagination**, and **completion** conventions.
- Review the official spec and changelog regularly to stay up to date.

---
_For full details, consult the online documentation at https://modelcontextprotocol.io_
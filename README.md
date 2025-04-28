# Candidate MCP Server

A Model Context Protocol (MCP) server that gives LLMs access to information about a candidate.

## Overview

This MCP server provides resources about a candidate, including:
- Resume information
- LinkedIn profile
- GitHub profile
- Personal website

> **Important**: This server is intended to be used as a library to be integrated into other applications, not as a standalone service. The provided startup methods are for demonstration and testing purposes only.

## Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Library Usage

This package is designed to be imported and used within your own applications:

```javascript
import { createServer } from 'node-candidate-mcp-server';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// or
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

// Configure your server
const serverConfig = { name: "MyCandidateServer", version: "1.0.0" };
const candidateConfig = { 
  name: "John Doe",
  resumeUrl: "https://example.com/resume.pdf",
  // other candidate properties
};

// Create server instance
const server = createServer(serverConfig, candidateConfig);

// Connect with your preferred transport
await server.connect(new StdioServerTransport());
// or integrate with your existing HTTP server
```

### Demo Startup Methods

For demonstration purposes only, the following methods are provided:

```bash
# Start with HTTP server (demo only)
npm start
```

The server will be available at http://localhost:3000/mcp

```bash
# Start with STDIO (for CLI tools, demo only)
npm start -- --stdio
```

When running with STDIO, you can interact with the server by sending MCP messages as single-line JSON objects:

```bash
# Example of sending an initialize message via STDIO
echo '{"jsonrpc": "2.0","id": 1,"method": "initialize","params": {"protocolVersion": "2024-11-05","capabilities": {"roots": {"listChanged": true},"sampling": {}},"clientInfo": {"name": "ExampleClient","version": "1.0.0"}}}' | node dist/index.js --stdio

# Access a resource
echo '{"jsonrpc": "2.0","id": 2,"method": "resources/read","params": {"uri": "candidate-info://resume-text"}}' | node dist/index.js --stdio
```

Each message must be on a single line with no line breaks within the JSON object.

## Configuration

The candidate information can be configured through environment variables:

- `CANDIDATE_NAME`: Candidate's full name
- `RESUME_URL`: URL to candidate's resume
- `LINKEDIN_URL`: URL to candidate's LinkedIn profile
- `GITHUB_URL`: URL to candidate's GitHub profile
- `WEBSITE_URL`: URL to candidate's personal website

## Development

```bash
# Run in development mode with auto-restart
npm run dev
```

## Resources

This MCP server provides the following resources:

- `candidate-info://resume-text`: Resume content as text
- `candidate-info://resume-url`: URL to the resume
- `candidate-info://linkedin-url`: LinkedIn profile URL
- `candidate-info://github-url`: GitHub profile URL
- `candidate-info://website-url`: Personal website URL
- `candidate-info://website-text`: Content from the personal website

## Tools

- `contact_candidate`: Send a message to the candidate

## Prompts

- `Job Search for [Candidate Name]`: Generate a job search prompt tailored to the candidate's profile

## Features

- Library-first design for integration into other applications
- Modular resource system for extending with custom candidate information
- TypeScript for type safety and better developer experience
- Implements the full Model Context Protocol specification
- Supports multiple transport types (STDIO, HTTP, Streamable HTTP)
- Minimal dependencies

## Server Structure

```
src/
  ├── index.ts                # Main package entry point
  ├── server.ts               # MCP server factory with configuration
  ├── config.ts               # Configuration type definitions
  └── resources/              # Modular resource definitions
      └── index.ts            # Resource factory and implementation
```

## MCP Protocol

This library implements the [Model Context Protocol](https://modelcontextprotocol.io/) (MCP), a standardized way for LLMs to interact with external data and functionality. When integrated into your application, it exposes a stateless API that responds to JSON-RPC requests.

### API Usage

Once integrated into your application, clients can interact with the MCP server by sending JSON-RPC requests. Here are examples of requests that your application would handle after integrating this library:

#### Initialize

```bash
curl -X POST http://your-application-url/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {
        "roots": {
          "listChanged": true
        },
        "sampling": {}
      },
      "clientInfo": {
        "name": "ExampleClient",
        "version": "1.0.0"
      }
    }
  }'
```

#### Access Candidate Resources

```bash
curl -X POST http://your-application-url/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Accept: text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "method": "resources/read",
    "params": {
      "uri": "candidate-info://resume-text"
    },
    "id": 2
  }'
```

## Extending the Library

This library is designed to be extended with custom resources, tools, and prompts. Here's how to add your own resources:

```javascript
import { McpServer, Resource } from 'node-candidate-mcp-server';

// Create your custom resource class
class CustomCandidateResource extends Resource {
  constructor(candidateConfig) {
    super(
      `${candidateConfig.name} Custom Data`, 
      "candidate-info://custom-data", 
      async () => {
        return {
          contents: [
            { 
              uri: "candidate-info://custom-data", 
              mimeType: "text/plain", 
              text: "Your custom candidate data here"
            }
          ]
        };
      }
    );
  }
}

// Create server with standard configuration
const server = createServer(serverConfig, candidateConfig);

// Add your custom resource
const customResource = new CustomCandidateResource(candidateConfig);
customResource.bind(server);

// Connect with preferred transport
// ...
```

## Requirements

- Node.js 20+ 
- npm or yarn

## License

[ISC](LICENSE) 
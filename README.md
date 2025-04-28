# Candidate MCP Server Library

A Model Context Protocol (MCP) server that gives LLMs access to information about a candidate.

## Overview

> **Important**: This server is intended to be used as a library to be integrated into other applications, not as a standalone service. The provided startup methods are for demonstration and testing purposes only.

### Resources

This MCP server provides the following resources:

- `candidate-info://resume-text`: Resume content as text
- `candidate-info://resume-url`: URL to the resume
- `candidate-info://linkedin-url`: LinkedIn profile URL
- `candidate-info://github-url`: GitHub profile URL
- `candidate-info://website-url`: Personal website URL
- `candidate-info://website-text`: Content from the personal website

## Usage

`npm install @jhgaylor/candidate-mcp-server`

### Library Usage

This package is designed to be imported and used within your own applications.

#### Stdio

Starting the process is a breeze with stdio. The interesting part is providing the candidate configuration.

Where you source the candidate configuration is entirely up to you. Maybe you hard code it. Maybe you take a JSONResume url when you start the process. It's up to you!

```javascript
import { createServer } from '@jhgaylor/candidate-mcp-server';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

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

#### StreamableHttp

Using the example code provided by the typescript sdk we can bind this mcp server to an express server.

```javascript
import express from 'express';
import { Request, Response } from 'express';
import { createServer } from '@jhgaylor/candidate-mcp-server';
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamablehttp.js";

// Configure your server
const serverConfig = { name: "MyCandidateServer", version: "1.0.0" };
const candidateConfig = { 
  name: "John Doe",
  resumeUrl: "https://example.com/resume.pdf",
  // other candidate properties
};

// Factory function to create a new server instance for each request
const getServer = () => createServer(serverConfig, candidateConfig);

const app = express();
app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
  // In stateless mode, create a new instance of transport and server for each request
  // to ensure complete isolation. A single instance would cause request ID collisions
  // when multiple clients connect concurrently.
  
  try {
    const server = getServer(); 
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on('close', () => {
      console.log('Request closed');
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: null,
      });
    }
  }
});

app.get('/mcp', async (req: Request, res: Response) => {
  console.log('Received GET MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

app.delete('/mcp', async (req: Request, res: Response) => {
  console.log('Received DELETE MCP request');
  res.writeHead(405).end(JSON.stringify({
    jsonrpc: "2.0",
    error: {
      code: -32000,
      message: "Method not allowed."
    },
    id: null
  }));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MCP Stateless Streamable HTTP Server listening on port ${PORT}`);
});
```

#### Express

Instead of writing the binding between express and the mcp transport yourself, you can use `express-mcp-handler` to do it for you.

`npm install express-mcp-handler`

```javascript
import express from 'express';
import { statelessHandler } from 'express-mcp-handler';
import { createServer } from './server';

// Configure the stateless handler
const handler = statelessHandler(createServer);

// Create Express app
const app = express();
app.use(express.json());

// Mount the handler (stateless only needs POST)
app.post('/mcp', handler);

// Start the server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Stateless MCP server running on port ${PORT}`);
});
```

### Demo Startup Methods

For demonstration purposes only, the following methods are provided:

```bash
# Start with STDIO (demo only)
npm start
```

When running with STDIO, you can interact with the server by sending MCP messages as single-line JSON objects:

```bash
# Example of sending an initialize message via STDIO
echo '{"jsonrpc": "2.0","id": 1,"method": "initialize","params": {"protocolVersion": "2024-11-05","capabilities": {"roots": {"listChanged": true},"sampling": {}},"clientInfo": {"name": "ExampleClient","version": "1.0.0"}}}' | node dist/index.js --stdio

# List resources
echo '{"jsonrpc": "2.0","id": 2,"method": "resources/list","params": {}}' | node dist/index.js --stdio

# Access a resource
echo '{"jsonrpc": "2.0","id": 3,"method": "resources/read","params": {"uri": "candidate-info://resume-text"}}' | node dist/index.js --stdio
```

Each message must be on a single line with no line breaks within the JSON object.

## Development 

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode with auto-restart
npm run dev
```

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
import { McpServer, Resource } from '@jhgaylor/candidate-mcp-server';

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

[MIT](LICENSE) 

## Publishing to npm

Log in to npm if you haven't already:
```bash
npm login
```

Publish the package to npm (will run your prepublishOnly build):
```bash
npm publish
```

To bump, tag, and push a new version:
```bash
npm version patch    # or minor, major
git push origin main --tags
```

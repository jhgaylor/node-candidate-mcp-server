import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

class Tool {
  name: string;
  description: string;
  schema: Record<string, z.ZodType>;
  executor: (args: Record<string, any>, extra: any) => Promise<{ content: Array<{ type: "text"; text: string }> }>;

  constructor(
    name: string, 
    description: string,
    schema: Record<string, z.ZodType>,
    executor: (args: Record<string, any>, extra: any) => Promise<{ content: Array<{ type: "text"; text: string }> }>
  ) {
    this.name = name;
    this.description = description;
    this.schema = schema;
    this.executor = executor;
  }

  bind(server: McpServer) {
    return server.tool(
      this.name,
      this.description,
      this.schema,
      this.executor,
    );
  }
}

export { Tool };
import { createServer } from "./server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import express from "express";
import { statelessHandler } from "express-mcp-handler";
import { CandidateConfig, ServerConfig } from "./config";

async function startServer() {
  try {
    const candidateConfig = new CandidateConfig();
    const serverConfig = new ServerConfig();
    const server = createServer(serverConfig, candidateConfig);
    await server.connect(new StdioServerTransport());    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
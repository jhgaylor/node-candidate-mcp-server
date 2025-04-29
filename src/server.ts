import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ServerConfig, CandidateConfig } from "./config";
import { candidateResources } from "./resources";

// Return a new instance of an MCP server
function createServer(
  serverConfig: ServerConfig, 
  candidateConfig: CandidateConfig
): McpServer {

  const server = new McpServer({
    name: serverConfig.name,
    version: serverConfig.version,
  });

  // Bind all available candidate resources based on candidate configuration
  const resourceInstances = candidateResources(candidateConfig);
  
  if (candidateConfig.resumeText) {
    resourceInstances.ResumeText.bind(server);
  }
  
  if (candidateConfig.resumeUrl) {
    resourceInstances.ResumeUrl.bind(server);
  }
  
  if (candidateConfig.linkedinUrl) {
    resourceInstances.LinkedinUrl.bind(server);
  }
  
  if (candidateConfig.githubUrl) {
    resourceInstances.GithubUrl.bind(server);
  }
  
  if (candidateConfig.websiteUrl) {
    resourceInstances.WebsiteUrl.bind(server);
  }
  
  if (candidateConfig.websiteText) {
    resourceInstances.WebsiteText.bind(server);
  }

  return server;
}

export { createServer };

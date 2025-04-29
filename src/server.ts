import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ServerConfig, CandidateConfig } from "./config";
import { candidateResources } from "./resources";
import { candidateTools } from "./tools";

// Return a new instance of an MCP server
function createServer(
  serverConfig: ServerConfig, 
  candidateConfig: CandidateConfig
): McpServer {

  const server = new McpServer({
    name: serverConfig.name,
    version: serverConfig.version,
  });

  // Bind all available candidate tools + resources based on candidate configuration
  const resourceInstances = candidateResources(candidateConfig);
  const toolInstances = candidateTools(candidateConfig, serverConfig);
  
  if (candidateConfig.resumeText) {
    resourceInstances.ResumeText.bind(server);
    toolInstances.GetResumeText.bind(server);
  }
  
  if (candidateConfig.resumeUrl) {
    resourceInstances.ResumeUrl.bind(server);
    toolInstances.GetResumeUrl.bind(server);
  }
  
  if (candidateConfig.linkedinUrl) {
    resourceInstances.LinkedinUrl.bind(server);
    toolInstances.GetLinkedinUrl.bind(server);
  }
  
  if (candidateConfig.githubUrl) {
    resourceInstances.GithubUrl.bind(server);
    toolInstances.GetGithubUrl.bind(server);
  }
  
  if (candidateConfig.websiteUrl) {
    resourceInstances.WebsiteUrl.bind(server);
    toolInstances.GetWebsiteUrl.bind(server);
  }
  
  if (candidateConfig.websiteText) {
    resourceInstances.WebsiteText.bind(server);
    toolInstances.GetWebsiteText.bind(server);
  }
  
  // Conditionally bind ContactCandidate tool if email and Mailgun config are available
  if (serverConfig.contactEmail && serverConfig.mailgunApiKey && serverConfig.mailgunDomain) {
    toolInstances.ContactCandidate?.bind(server);
  }

  return server;
}

export { createServer };

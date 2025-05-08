import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ServerCapabilities } from "@modelcontextprotocol/sdk/types.js";
import { ServerConfig, CandidateConfig } from "./config";
import { candidateResources } from "./resources";
import { candidateTools } from "./tools";
import { candidatePrompts } from "./prompts";
import { interviewTools } from "./tools/interviewTools";

// Return a new instance of an MCP server
function createServer(
  serverConfig: ServerConfig, 
  candidateConfig: CandidateConfig
): McpServer {

  const server = new McpServer({
    name: serverConfig.name,
    capabilities: getServerCapabilities(),
    version: serverConfig.version,
  });

  return bindToServer(server, serverConfig, candidateConfig);
}

function bindToServer(server: McpServer, serverConfig: ServerConfig, candidateConfig: CandidateConfig) {
  // Bind all available candidate tools + resources based on candidate configuration
  const resourceInstances = candidateResources(candidateConfig);
  const toolInstances = candidateTools(candidateConfig, serverConfig);
  const promptInstances = candidatePrompts(candidateConfig);
  const interviewToolInstances = interviewTools(candidateConfig);
  
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

  // Bind all prompt templates
  promptInstances.GetCandidateBackground.bind(server);
  promptInstances.AssessTechProficiency.bind(server);
  promptInstances.GeneratePhoneScreen.bind(server);
  promptInstances.SummarizeCareerHighlights.bind(server);
  promptInstances.EvaluateJobFit.bind(server);
  promptInstances.AssessProductCollaboration.bind(server);
  promptInstances.AssessStartupFit.bind(server);
  
  // Bind interview tools
  interviewToolInstances.GenerateInterviewQuestions.bind(server);
  interviewToolInstances.AssessRoleFit.bind(server);

  return server;
}

function getServerCapabilities() {
  return {
    resources: {},
    tools: {},
    prompts: {},
  };
}

export { createServer, bindToServer, getServerCapabilities };

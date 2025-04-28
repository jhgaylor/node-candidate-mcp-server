class ServerConfig {
  name: string = "Candidate MCP Server";
  version: string = "1.0.0";
}

class CandidateConfig {
  name: string = "Candidate";
  resumeText?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  websiteText?: string;
}

export { CandidateConfig, ServerConfig }; 
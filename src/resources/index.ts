import { McpServer, ReadResourceCallback } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CandidateConfig } from "../config";

function candidateResources(candidateConfig: CandidateConfig) {
  return {
    ResumeText: new ResumeText(candidateConfig),
    ResumeUrl: new ResumeUrl(candidateConfig),
    LinkedinUrl: new LinkedinUrl(candidateConfig),
    GithubUrl: new GithubUrl(candidateConfig),
    WebsiteUrl: new WebsiteUrl(candidateConfig),
    WebsiteText: new WebsiteText(candidateConfig),
  };
}

class Resource {
  name: string;
  uri: string;
  callback: ReadResourceCallback;

  constructor(name: string, uri: string, callback: ReadResourceCallback) {
    this.name = name;
    this.uri = uri;
    this.callback = callback;
  }

  bind(server: McpServer) {
    return server.resource(
      this.name,
      this.uri,
      this.callback,
    );
  }
}

class ResumeText extends Resource {
  constructor(candidateConfig: CandidateConfig) {
    super(`${candidateConfig.name} Resume Text`, "candidate-info://resume-text", async () => {
      return {
        contents: [
          { uri: "candidate-info://resume-text", mimeType: "text/plain", text: candidateConfig.resumeText! }
        ]
      };
    });
  }
}

class ResumeUrl extends Resource {
  constructor(candidateConfig: CandidateConfig) {
    super(`${candidateConfig.name} Resume URL`, "candidate-info://resume-url", async () => {
      return {
        contents: [
          { uri: "candidate-info://resume-url", mimeType: "text/plain", text: candidateConfig.resumeUrl! }
        ]
      };
    });
  }
}

class LinkedinUrl extends Resource {
  constructor(candidateConfig: CandidateConfig) {
    super(`${candidateConfig.name} LinkedIn Profile URL`, "candidate-info://linkedin-url", async () => {
      return {
        contents: [
          { uri: "candidate-info://linkedin-url", mimeType: "text/plain", text: candidateConfig.linkedinUrl! }
        ]
      };
    });
  }
}

class GithubUrl extends Resource {
  constructor(candidateConfig: CandidateConfig) {
    super(`${candidateConfig.name} GitHub Profile URL`, "candidate-info://github-url", async () => {
      return {
        contents: [
          { uri: "candidate-info://github-url", mimeType: "text/plain", text: candidateConfig.githubUrl! }
        ]
      };
    });
  }
}

class WebsiteUrl extends Resource {
  constructor(candidateConfig: CandidateConfig) {
    super(`${candidateConfig.name} Website URL`, "candidate-info://website-url", async () => {
      return {
        contents: [
          { uri: "candidate-info://website-url", mimeType: "text/plain", text: candidateConfig.websiteUrl! }
        ]
      };
    });
  }
}

class WebsiteText extends Resource {
  constructor(candidateConfig: CandidateConfig) {
    super(`${candidateConfig.name} Website Text`, "candidate-info://website-text", async () => {
      return {
        contents: [
          { uri: "candidate-info://website-text", mimeType: "text/plain", text: candidateConfig.websiteText! }
        ]
      };
    });
  }
}

export { candidateResources };

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CandidateConfig } from "../config";

function candidateTools(candidateConfig: CandidateConfig) {
  return {
    GetResumeText: new GetResumeText(candidateConfig),
    GetResumeUrl: new GetResumeUrl(candidateConfig),
    GetLinkedinUrl: new GetLinkedinUrl(candidateConfig),
    GetGithubUrl: new GetGithubUrl(candidateConfig),
    GetWebsiteUrl: new GetWebsiteUrl(candidateConfig),
    GetWebsiteText: new GetWebsiteText(candidateConfig),
  };
}

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

class GetResumeText extends Tool {
  constructor(candidateConfig: CandidateConfig) {
    super(
      `get_resume_text`,
      `Get the resume text of the candidate ${candidateConfig.name}`,
      {},
      async (_args, _extra) => {
        return {
          content: [
            { type: "text", text: candidateConfig.resumeText || "Resume text not available" }
          ]
        };
      }
    );
  }
}

class GetResumeUrl extends Tool {
  constructor(candidateConfig: CandidateConfig) {
    super(
      `get_resume_url`,
      `Get the resume URL of the candidate ${candidateConfig.name}`,
      {},
      async (_args, _extra) => {
        return {
          content: [
            { type: "text", text: candidateConfig.resumeUrl || "Resume URL not available" }
          ]
        };
      }
    );
  }
}

class GetLinkedinUrl extends Tool {
  constructor(candidateConfig: CandidateConfig) {
    super(
      `get_linkedin_url`,
      `Get the LinkedIn URL of the candidate ${candidateConfig.name}`,
      {},
      async (_args, _extra) => {
        return {
          content: [
            { type: "text", text: candidateConfig.linkedinUrl || "LinkedIn URL not available" }
          ]
        };
      }
    );
  }
}

class GetGithubUrl extends Tool {
  constructor(candidateConfig: CandidateConfig) {
    super(
      `get_github_url`,
      `Get the GitHub URL of the candidate ${candidateConfig.name}`,
      {},
      async (_args, _extra) => {
        return {
          content: [
            { type: "text", text: candidateConfig.githubUrl || "GitHub URL not available" }
          ]
        };
      }
    );
  }
}

class GetWebsiteUrl extends Tool {
  constructor(candidateConfig: CandidateConfig) {
    super(
      `get_website_url`,
      `Get the website URL of the candidate ${candidateConfig.name}`,
      {},
      async (_args, _extra) => {
        return {
          content: [
            { type: "text", text: candidateConfig.websiteUrl || "Website URL not available" }
          ]
        };
      }
    );
  }
}

class GetWebsiteText extends Tool {
  constructor(candidateConfig: CandidateConfig) {
    super(
      `get_website_text`,
      `Get the website text of the candidate ${candidateConfig.name}`,
      {},
      async (_args, _extra) => {
        return {
          content: [
            { type: "text", text: candidateConfig.websiteText || "Website text not available" }
          ]
        };
      }
    );
  }
}

export { candidateTools }; 
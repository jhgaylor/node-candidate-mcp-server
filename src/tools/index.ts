import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CandidateConfig, ServerConfig } from "../config";
// Using nodemailer with mailgun transport
import * as nodemailer from 'nodemailer';
import mailGun from 'nodemailer-mailgun-transport';

// Define a type for the tools collection
interface ToolCollection {
  GetResumeText: GetResumeText;
  GetResumeUrl: GetResumeUrl;
  GetLinkedinUrl: GetLinkedinUrl;
  GetGithubUrl: GetGithubUrl;
  GetWebsiteUrl: GetWebsiteUrl;
  GetWebsiteText: GetWebsiteText;
  ContactCandidate?: ContactCandidate;
}

function candidateTools(candidateConfig: CandidateConfig, serverConfig: ServerConfig): ToolCollection {
  const tools: ToolCollection = {
    GetResumeText: new GetResumeText(candidateConfig),
    GetResumeUrl: new GetResumeUrl(candidateConfig),
    GetLinkedinUrl: new GetLinkedinUrl(candidateConfig),
    GetGithubUrl: new GetGithubUrl(candidateConfig),
    GetWebsiteUrl: new GetWebsiteUrl(candidateConfig),
    GetWebsiteText: new GetWebsiteText(candidateConfig),
  };
  
  tools.ContactCandidate = new ContactCandidate(candidateConfig, serverConfig);
  
  return tools;
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

class ContactCandidate extends Tool {
  constructor(candidateConfig: CandidateConfig, serverConfig: ServerConfig) {
    super(
      "contact_candidate",
      `Send an email to the candidate ${candidateConfig.name}`,
      {
        subject: z.string().describe("Email subject line"),
        message: z.string().describe("Email message body"),
        reply_address: z.string().describe("Email address where the candidate can reply")
      },
      async (args, _extra) => {
        try {
          const auth = {
            auth: {
              api_key: serverConfig.mailgunApiKey!,
              domain: serverConfig.mailgunDomain!
            }
          };

          const transporter = nodemailer.createTransport(mailGun(auth));
          
          const mailOptions = {
            from: `AI Assistant <ai-assistant@${serverConfig.mailgunDomain}>`,
            to: serverConfig.contactEmail!,
            subject: args.subject,
            text: args.message,
            replyTo: args.reply_address
          };
          
          await transporter.sendMail(mailOptions);
          
          return {
            content: [
              { type: "text", text: `Email successfully sent to ${candidateConfig.name} at ${serverConfig.contactEmail}` }
            ]
          };
        } catch (error) {
          console.error("Failed to send email:", error);
          return {
            content: [
              { type: "text", text: `Failed to send email: ${error instanceof Error ? error.message : String(error)}` }
            ]
          };
        }
      }
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
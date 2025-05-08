import { CandidateConfig, ServerConfig } from "../config";
import { Tool } from "./types";
import * as nodemailer from 'nodemailer';
import { MailgunTransport } from 'mailgun-nodemailer-transport';


import { z } from "zod";

// Define a type for the tools collection
interface CandidateToolCollection {
  GetResumeText: GetResumeText;
  GetResumeUrl: GetResumeUrl;
  GetLinkedinUrl: GetLinkedinUrl;
  GetGithubUrl: GetGithubUrl;
  GetWebsiteUrl: GetWebsiteUrl;
  GetWebsiteText: GetWebsiteText;
  ContactCandidate?: ContactCandidate;
}

function candidateTools(candidateConfig: CandidateConfig, serverConfig: ServerConfig): CandidateToolCollection {
  const tools: CandidateToolCollection = {
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
          const transporter = nodemailer.createTransport(new MailgunTransport({
            auth: {
              domain: serverConfig.mailgunDomain!,
              apiKey: serverConfig.mailgunApiKey!
            }
          }));
          
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
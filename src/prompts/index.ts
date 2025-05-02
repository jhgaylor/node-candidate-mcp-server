import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CandidateConfig } from "../config";

// Define a type for the prompts collection
interface PromptCollection {
  GetCandidateBackground: GetCandidateBackground;
  AssessTechProficiency: AssessTechProficiency;
  GeneratePhoneScreen: GeneratePhoneScreen;
  SummarizeCareerHighlights: SummarizeCareerHighlights;
  EvaluateJobFit: EvaluateJobFit;
  AssessProductCollaboration: AssessProductCollaboration;
  AssessStartupFit: AssessStartupFit;
}

function candidatePrompts(candidateConfig: CandidateConfig): PromptCollection {
  return {
    GetCandidateBackground: new GetCandidateBackground(candidateConfig),
    AssessTechProficiency: new AssessTechProficiency(candidateConfig),
    GeneratePhoneScreen: new GeneratePhoneScreen(candidateConfig),
    SummarizeCareerHighlights: new SummarizeCareerHighlights(candidateConfig),
    EvaluateJobFit: new EvaluateJobFit(candidateConfig),
    AssessProductCollaboration: new AssessProductCollaboration(candidateConfig),
    AssessStartupFit: new AssessStartupFit(candidateConfig),
  };
}

class Prompt {
  name: string;
  description: string;
  schema: Record<string, z.ZodType>;
  builder: (args: Record<string, any>) => { messages: Array<{ role: "user" | "assistant"; content: { type: "text"; text: string } }> };

  constructor(
    name: string,
    description: string,
    schema: Record<string, z.ZodType>,
    builder: (args: Record<string, any>) => { messages: Array<{ role: "user" | "assistant"; content: { type: "text"; text: string } }> }
  ) {
    this.name = name;
    this.description = description;
    this.schema = schema;
    this.builder = builder;
  }

  bind(server: McpServer) {
    return server.prompt(
      this.name,
      this.description,
      this.schema,
      this.builder
    );
  }
}

class GetCandidateBackground extends Prompt {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "get_candidate_background",
      `Get information about ${candidateConfig.name}'s experience, skills, and background`,
      {
        specific_area: z.string().optional().describe("Optional specific area of experience or background to focus on")
      },
      (args) => ({
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Please provide information about ${candidateConfig.name}'s professional background${args.specific_area ? ` with focus on ${args.specific_area}` : ''}.
              Include details about their experience, skills, and relevant qualifications.`
            }
          }
        ]
      })
    );
  }
}

class AssessTechProficiency extends Prompt {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "assess_tech_proficiency",
      `Assess ${candidateConfig.name}'s proficiency in specific technologies`,
      {
        technologies: z.string().describe("Comma-separated list of technologies to assess")
      },
      (args) => ({
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `What is ${candidateConfig.name}'s proficiency level with ${args.technologies}? 
              Please provide specific examples from their experience and projects where available.`
            }
          }
        ]
      })
    );
  }
}

class GeneratePhoneScreen extends Prompt {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "generate_phone_screen",
      `Generate interview questions for ${candidateConfig.name} based on specific technical areas`,
      {
        focus_area: z.string().describe("e.g. 'API design and testing'")
      },
      (args) => ({
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Create a phone screen for ${candidateConfig.name} around ${args.focus_area}.
              Include 5-7 questions that would effectively assess their knowledge and experience in this area,
              with consideration for their background and the skill level required for the position.`
            }
          }
        ]
      })
    );
  }
}

class SummarizeCareerHighlights extends Prompt {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "summarize_career_highlights",
      `Generate a summary of ${candidateConfig.name}'s career highlights`,
      {},
      () => ({
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Generate a comprehensive summary of ${candidateConfig.name}'s career highlights.
              Include key achievements, notable projects, technology expertise, and professional growth.
              Pull information from their resume, GitHub projects, and website content where available.`
            }
          }
        ]
      })
    );
  }
}

class EvaluateJobFit extends Prompt {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "evaluate_job_fit",
      `Evaluate if ${candidateConfig.name} is a good fit for a specific role`,
      {
        job_description: z.string().describe("Full job description to evaluate fit against")
      },
      (args) => ({
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Is ${candidateConfig.name} a good fit for the following role? Please analyze their skills, experience, and background against the requirements. 
              
              Job Description:
              ${args.job_description}
              
              Provide a detailed analysis of strengths, potential gaps, and overall fit. Include specific examples from their background that relate to key requirements.`
            }
          }
        ]
      })
    );
  }
}

class AssessProductCollaboration extends Prompt {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "assess_product_collaboration",
      `Understand how ${candidateConfig.name} collaborates on product vision and feature prioritization`,
      {
        collaboration_aspect: z.string().optional().describe("e.g. 'feature roadmap development'")
      },
      (args) => ({
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `How would ${candidateConfig.name} contribute to ${args.collaboration_aspect || 'product vision and feature prioritization'}?
              Detail their approach to product collaboration, experience with product teams, and methodology for prioritizing features and improvements.
              Include specific examples from their past work where available.`
            }
          }
        ]
      })
    );
  }
}

class AssessStartupFit extends Prompt {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "assess_startup_fit",
      `Assess ${candidateConfig.name}'s fit for a startup or small team environment`,
      {
        role_type: z.string().optional().describe("e.g. 'full-stack generalist'")
      },
      (args) => ({
        messages: [
          {
            role: "user" as const,
            content: {
              type: "text" as const,
              text: `Would ${candidateConfig.name} be a good fit for ${args.role_type ? `a ${args.role_type} role at` : ''} an early-stage startup?
              Evaluate their adaptability, breadth of skills, ability to work with limited resources, and experience in fast-paced environments.
              Consider both technical capabilities and soft skills relevant to startup environments.`
            }
          }
        ]
      })
    );
  }
}

export { candidatePrompts }; 

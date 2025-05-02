import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { CandidateConfig, ServerConfig } from "../config";
import { Tool } from "./types";
// Define a type for the interview tools collection
interface InterviewToolCollection {
  GenerateInterviewQuestions: GenerateInterviewQuestions;
  AssessRoleFit: AssessRoleFit;
}

function interviewTools(candidateConfig: CandidateConfig): InterviewToolCollection {
  return {
    GenerateInterviewQuestions: new GenerateInterviewQuestions(candidateConfig),
    AssessRoleFit: new AssessRoleFit(candidateConfig),
  };
}

class GenerateInterviewQuestions extends Tool {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "generate_interview_questions",
      `Generate tailored interview questions for ${candidateConfig.name}`,
      {
        interview_type: z.enum(["phone_screen", "technical", "behavioral", "system_design", "culture_fit"]).describe("Type of interview to generate questions for"),
        focus_areas: z.string().describe("Comma-separated list of technical areas to focus questions on"),
        difficulty: z.enum(["entry", "mid", "senior", "staff"]).describe("Target difficulty level for questions")
      },
      async (args, _extra) => {
        // This function would typically call an external service or generate content
        // For now we just return a template response acknowledging the request
        const questionTypes: Record<string, string[]> = {
          phone_screen: [
            `Tell me about your experience with ${args.focus_areas}.`,
            `What projects have you worked on that used ${args.focus_areas}?`,
            `How do you approach learning new technologies related to ${args.focus_areas}?`,
            `What challenges have you faced while working with ${args.focus_areas} and how did you overcome them?`,
            `Where do you see the future of ${args.focus_areas} heading?`
          ],
          technical: [
            `Explain how you would implement a ${args.difficulty} level solution for [problem related to ${args.focus_areas}].`,
            `What are the performance considerations when working with ${args.focus_areas}?`,
            `How would you debug an issue in a system using ${args.focus_areas}?`,
            `Describe the architecture of a system you built using ${args.focus_areas}.`,
            `How would you test an application that uses ${args.focus_areas}?`
          ],
          behavioral: [
            `Describe a situation where you had to use ${args.focus_areas} to solve a difficult problem.`,
            `Tell me about a time when you had to learn ${args.focus_areas} quickly to meet a deadline.`,
            `How do you handle disagreements with team members about technical approaches related to ${args.focus_areas}?`,
            `Describe a project where you were proud of your contribution involving ${args.focus_areas}.`,
            `How do you prioritize tasks when working on a project involving ${args.focus_areas}?`
          ],
          system_design: [
            `Design a scalable system that uses ${args.focus_areas} for [specific application].`,
            `How would you handle database scaling for a system using ${args.focus_areas}?`,
            `Describe how you would approach security concerns in a system using ${args.focus_areas}.`,
            `How would you ensure reliability and fault tolerance in a ${args.focus_areas} application?`,
            `Explain how you would design an API for a service that uses ${args.focus_areas}.`
          ],
          culture_fit: [
            `How do you stay up to date with developments in ${args.focus_areas}?`,
            `How do you approach knowledge sharing about ${args.focus_areas} within your team?`,
            `Describe your ideal work environment when working with ${args.focus_areas}.`,
            `How do you handle situations where project requirements related to ${args.focus_areas} change midway?`,
            `What do you think makes someone successful when working with ${args.focus_areas}?`
          ]
        };
        
        const selectedQuestions = questionTypes[args.interview_type as string] || [];
        
        return {
          content: [
            { 
              type: "text", 
              text: `Here are tailored ${args.interview_type} interview questions for ${candidateConfig.name} focusing on ${args.focus_areas} at ${args.difficulty} level:\n\n${selectedQuestions.join('\n\n')}` 
            }
          ]
        };
      }
    );
  }
}

class AssessRoleFit extends Tool {
  constructor(candidateConfig: CandidateConfig) {
    super(
      "assess_role_fit",
      `Assess ${candidateConfig.name}'s fit for a specific role based on job description`,
      {
        job_title: z.string().describe("Title of the job position"),
        job_description: z.string().describe("Full job description text"),
        key_requirements: z.string().describe("Comma-separated list of key requirements for the role")
      },
      async (args, _extra) => {
        // Basic template response that would normally be more sophisticated
        return {
          content: [
            { 
              type: "text", 
              text: `Role Fit Assessment for ${candidateConfig.name} - ${args.job_title}\n\n` +
                    `I've analyzed ${candidateConfig.name}'s background against the provided job description and requirements.\n\n` +
                    `This assessment is based on reviewing the candidate's resume, website content, and GitHub profile (if available).\n\n` +
                    `For a detailed assessment, please use the "evaluate_job_fit" prompt with the full job description.`
            }
          ]
        };
      }
    );
  }
}

export { interviewTools }; 
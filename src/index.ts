import { createServer } from "./server";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CandidateConfig, ServerConfig } from "./config";

async function startServer() {
  try {
    const candidateConfig = new CandidateConfig();
    candidateConfig.name = "Jane Doe";
    candidateConfig.resumeUrl = "https://example.com/jane_doe_resume.pdf";
    candidateConfig.websiteUrl = "https://janedoe.com";
    candidateConfig.linkedinUrl = "https://linkedin.com/in/janedoe";
    candidateConfig.githubUrl = "https://github.com/janedoe";
    candidateConfig.resumeText = `Jane Doe
Embedded Systems Engineer

Experience:
- IoT Solutions Inc. (2019-Present)
  Senior Embedded Engineer

Skills:
- C, C++, Assembly
- RTOS, Embedded Linux
- PCB Design, Hardware Integration
- Microcontrollers (ARM, AVR)`;
    
    const serverConfig = new ServerConfig();
    const server = createServer(serverConfig, candidateConfig);
    await server.connect(new StdioServerTransport());    
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export { createServer };

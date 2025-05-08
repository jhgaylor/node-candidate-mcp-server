class ServerConfig {
  name: string;
  version: string;
  mailgunApiKey?: string;
  mailgunDomain?: string;
  contactEmail?: string;

  constructor(name = "Candidate MCP Server", version = "1.0.0", options: {
    mailgunApiKey?: string;
    mailgunDomain?: string;
    contactEmail?: string;
  } = {}) {
    this.name = name;
    this.version = version;
    this.mailgunApiKey = options.mailgunApiKey;
    this.mailgunDomain = options.mailgunDomain;
    this.contactEmail = options.contactEmail;
  }
}

class CandidateConfig {
  name: string = "Candidate";
  resumeText?: string;
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  websiteText?: string;

  constructor(name: string, options: {
    resumeText?: string;
    resumeUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    websiteText?: string;
  } = {}) {
    this.name = name;
    this.resumeText = options?.resumeText;
    this.resumeUrl = options?.resumeUrl;
    this.linkedinUrl = options?.linkedinUrl;
    this.githubUrl = options?.githubUrl;
    this.websiteUrl = options?.websiteUrl;
    this.websiteText = options?.websiteText;
  }
}

export { CandidateConfig, ServerConfig }; 